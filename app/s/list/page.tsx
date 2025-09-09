"use client";
import { Container } from "@/components/ui/container";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const linkSchema = z.object({
  url: z.string().url({ message: "Must be a valid URL" }),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
});

const formSchema = z.object({
  title: z.string().min(1, { message: "Title required" }),
  description: z.string().optional(),
  vanity_url: z.string().optional(),
  links: z.array(linkSchema).min(1, { message: "At least one link required" }),
});

type LinkPreview = {
  url: string;
  title?: string | null;
  description?: string | null;
  icon?: string | null;
};

type FormValues = z.infer<typeof formSchema>;

const normalizeUrl = (url: string) => {
  // If the URL does not start with http:// or https://, prepend https://
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

export default function ListPage() {
  // Local state for the links array
  const [links, setLinks] = React.useState<LinkPreview[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      vanity_url: "",
      // links: [], // Remove from defaultValues
    },
  });

  const urlInputRef = useRef<HTMLInputElement>(null);
  const [currentUrl, setCurrentUrl] = React.useState("");
  const [loadingPreview, setLoadingPreview] = React.useState(false);
  const [previewError, setPreviewError] = React.useState<string | null>(null);

  // Add URL to links array
  const handleUrlKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      let url = currentUrl.trim();
      if (!url) return;
      url = normalizeUrl(url);
      // Validate URL
      const result = linkSchema.safeParse({ url });
      if (!result.success) {
        form.setError("root", { message: result.error.issues[0].message });
        return;
      }
      form.clearErrors("root");
      setLoadingPreview(true);
      setPreviewError(null);
      try {
        const res = await fetch("/api/og-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (!res.ok) {
          setPreviewError(data.error || "Failed to fetch preview.");
        } else {
          // Add the link with Open Graph info to local state
          setLinks([...links, {
            url: data.url,
            title: data.title,
            description: data.description,
            icon: data.icon,
          }]);
          setCurrentUrl("");
          urlInputRef.current?.focus();
        }
      } catch {
        setPreviewError("Network error.");
      }
      setLoadingPreview(false);
    }
  };

  // Remove a link
  const handleRemoveLink = (idx: number) => {
    setLinks(links.filter((_, i) => i !== idx));
  };

  const onSubmit = async (values: Omit<FormValues, "links">) => {
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, links }),
      });
      const data = await res.json();
      if (!res.ok) {
        form.setError("root", { message: data.error || "Failed to create list." });
      } else {
        window.location.href = `/s/list/${data.list.vanity_url}`;
      }
    } catch {
      form.setError("root", { message: "Network error." });
    }
  };

  type LinkListProps = {
    links: LinkPreview[];
    setLinks: React.Dispatch<React.SetStateAction<LinkPreview[]>>;
    handleRemoveLink: (idx: number) => void;
  };

  function LinkList({ links, setLinks, handleRemoveLink }: LinkListProps) {
    const [editingIdx, setEditingIdx] = React.useState<number | null>(null);
    const [editValues, setEditValues] = React.useState<{ title: string; description: string }>({ title: "", description: "" });

    const startEdit = (idx: number) => {
      setEditingIdx(idx);
      setEditValues({
        title: links[idx].title ?? "",
        description: links[idx].description ?? "",
      });
    };

    const cancelEdit = () => {
      setEditingIdx(null);
      setEditValues({ title: "", description: "" });
    };

    const saveEdit = (idx: number) => {
      const newLinks = [...links];
      newLinks[idx] = {
        ...newLinks[idx],
        title: editValues.title,
        description: editValues.description,
      };
      setLinks(newLinks);
      setEditingIdx(null);
    };

    return (
      <div className="flex flex-col gap-4">
    {links.map((link: LinkPreview, idx: number) => (
          <Card key={idx} className="w-full">
            <CardContent className="flex flex-row gap-4 items-center">
              {link.icon && (
                <img src={link.icon} alt="icon" className="w-12 h-12 object-contain rounded" />
              )}
              <div className="flex-1 min-w-0">
                {editingIdx === idx ? (
                  <div className="mb-2">
                    <Input
                      value={editValues.title}
                      placeholder="Title"
                      onChange={e => setEditValues(ev => ({ ...ev, title: e.target.value }))}
                      className="mb-1"
                    />
                    <Input
                      value={editValues.description}
                      placeholder="Description"
                      onChange={e => setEditValues(ev => ({ ...ev, description: e.target.value }))}
                      className="mb-1"
                    />
                    <div className="flex gap-2 mt-2">
                      <Button type="button" size="sm" onClick={() => saveEdit(idx)} variant="default">Save</Button>
                      <Button type="button" size="sm" onClick={cancelEdit} variant="secondary">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-2">
                    <div className="font-bold text-lg truncate">{link.title ? link.title : link.url}</div>
                    {link.description && (
                      <div className="text-muted-foreground text-sm mt-1 truncate">{link.description}</div>
                    )}
                    <Button type="button" size="sm" className="mt-2" onClick={() => startEdit(idx)} variant="outline">Edit</Button>
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1 break-all">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                        {link.url}
                      </a>
                    </HoverCardTrigger>
                    <HoverCardContent className="max-w-xs">
                      <div className="font-bold mb-1">{link.title || link.url}</div>
                      {link.description && <div className="text-sm mb-2">{link.description}</div>}
                      <div className="text-xs text-muted-foreground">{link.url}</div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="ml-2"
                aria-label="Remove link"
                onClick={() => handleRemoveLink(idx)}
              >
                <span className="sr-only">Remove</span>
                &times;
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Container>
        <div className="max-w-2xl mx-auto py-8">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl">Create a New List</CardTitle>
              <CardDescription>
                Organize your favorite links in a beautiful, shareable list.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="List title" {...field} />
                        </FormControl>
                        <FormDescription>
                          Give your list a descriptive title.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="List description (optional)" {...field} />
                        </FormControl>
                        <FormDescription>
                          Add a short description for your list.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vanity_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vanity URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Custom URL (e.g. favorites)" {...field} />
                        </FormControl>
                        <FormDescription>
                          Make your list easy to share with a custom URL.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="pt-2">
                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-lg">Add Links</CardTitle>
                        <CardDescription>Paste a URL and press Enter to add it to your list.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 items-center">
                          <Input
                            ref={urlInputRef}
                            placeholder="https://example.com"
                            value={currentUrl}
                            onChange={(e) => setCurrentUrl(e.target.value)}
                            onKeyDown={handleUrlKeyDown}
                            disabled={loadingPreview}
                            className="flex-1"
                            aria-label="Add link URL"
                          />
                          <Button
                            type="button"
                            onClick={async () => {
                              let url = currentUrl.trim();
                              if (!url) return;
                              url = normalizeUrl(url);
                              // Validate URL
                              const result = linkSchema.safeParse({ url });
                              if (!result.success) {
                                form.setError("root", { message: result.error.issues[0].message });
                                return;
                              }
                              form.clearErrors("root");
                              setLoadingPreview(true);
                              setPreviewError(null);
                              try {
                                const res = await fetch("/api/og-preview", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ url }),
                                });
                                const data = await res.json();
                                if (!res.ok) {
                                  setPreviewError(data.error || "Failed to fetch preview.");
                                } else {
                                  setLinks([...links, {
                                    url: data.url,
                                    title: data.title,
                                    description: data.description,
                                    icon: data.icon,
                                  }]);
                                  setCurrentUrl("");
                                  urlInputRef.current?.focus();
                                }
                              } catch {
                                setPreviewError("Network error.");
                              }
                              setLoadingPreview(false);
                            }}
                            disabled={loadingPreview || !currentUrl.trim()}
                            variant="default"
                          >
                            Add
                          </Button>
                        </div>
                        {loadingPreview && (
                          <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                            <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-primary rounded-full" />
                            Loading preview...
                          </div>
                        )}
                        {previewError && (
                          <div className="mt-2 text-sm text-destructive">{previewError}</div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || links.length === 0}
                    className="w-full mt-4"
                  >
                    {form.formState.isSubmitting ? "Creating..." : "Create List"}
                  </Button>
                  <FormMessage>{form.formState.errors.root?.message}</FormMessage>
                </form>
              </Form>
            </CardContent>
          </Card>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Links in Your List</h2>
            {links.length === 0 ? (
              <Card className="flex flex-col items-center justify-center py-12 bg-muted/50">
                <CardContent className="flex flex-col items-center">
                  <img src="/globe.svg" alt="Empty" className="w-16 h-16 mb-4 opacity-60" />
                  <CardTitle className="text-lg mb-2">No links added yet</CardTitle>
                  <CardDescription>Add your first link above to get started.</CardDescription>
                </CardContent>
              </Card>
            ) : (
              <LinkList links={links} setLinks={setLinks} handleRemoveLink={handleRemoveLink} />
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}