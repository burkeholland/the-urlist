
"use client";
import { Container } from "@/components/ui/container";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { LinkInput } from "@/components/LinkInput";
import { LinkList, LinkType } from "@/components/LinkList";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
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

type FormValues = z.infer<typeof formSchema>;

const normalizeUrl = (url: string) => {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};


export default function ListPage() {
  // Use react-hook-form for links array
  // LinkType is now imported from LinkList
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      vanity_url: "",
      links: [],
    },
  });
  const links = form.watch("links");
  const setLinks = (newLinks: LinkType[]) => form.setValue("links", newLinks);
  const urlInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const [currentUrl, setCurrentUrl] = React.useState("");
  const [loadingPreview, setLoadingPreview] = React.useState(false);
  const [previewError, setPreviewError] = React.useState<string | null>(null);

  // Add URL to links array (moved to LinkInput)
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
          // If preview fetch fails, add link with just the URL as title, do not show error
          setLinks([
            ...links,
            {
              url,
              title: url,
              description: null,
              icon: null,
            },
          ]);
          setPreviewError(null); // Do not show preview error
          setCurrentUrl("");
          urlInputRef.current?.focus();
        } else {
          setLinks([
            ...links,
            {
              url: data.url,
              title: data.title,
              description: data.description,
              icon: data.icon,
            },
          ]);
          setCurrentUrl("");
          urlInputRef.current?.focus();
        }
      } catch {
        // On network error, add link with just the URL as title and show error
        setLinks([
          ...links,
          {
            url,
            title: url,
            description: null,
            icon: null,
          },
        ]);
        setPreviewError("Network error.");
        setCurrentUrl("");
        urlInputRef.current?.focus();
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
        body: JSON.stringify({ ...values, links: form.getValues("links") }),
      });
      const data = await res.json();
      if (!res.ok) {
        form.setError("root", { message: data.error || "Failed to create list." });
      } else {
  window.location.href = `/${data.list.vanity_url}`;
      }
    } catch {
      form.setError("root", { message: "Network error." });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100">
      <Container>
  <div className="pt-8 max-w-6xl mx-auto w-full px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-14">
              {/* Section 1: List Details - large and prominent */}
              <section className="mb-10 bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
                <h2 className="text-3xl font-bold mb-4">List Details</h2>
                <p className="text-lg text-gray-500 mb-8">Give your list a title, description, and custom URL.</p>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. My Favorite Resources" {...field} className="text-xl py-3" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Description</FormLabel>
                          <FormControl>
                            <Input placeholder="A short description (optional)" {...field} className="text-xl py-3" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="vanity_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Custom URL</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. favorites" {...field} className="text-xl py-3" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </section>
              {/* Section 2: Big Input for New Links */}
              <div className="mb-8">
                <LinkInput
                  currentUrl={currentUrl}
                  setCurrentUrl={setCurrentUrl}
                  loadingPreview={loadingPreview}
                  previewError={previewError}
                  onKeyDown={handleUrlKeyDown}
                  urlInputRef={urlInputRef}
                  linksCount={links.length}
                />
              </div>
              {/* Section 3: Links List */}
              <div className="mb-8">
                <LinkList links={links} onRemove={handleRemoveLink} />
              </div>
              {/* Error and submit button */}
              {form.formState.errors.root?.message && (
                <Alert variant="destructive" className="mb-8">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{form.formState.errors.root?.message}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || links.length === 0}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
              >
                {form.formState.isSubmitting ? "Creating..." : "Create List"}
              </Button>
            </form>
          </Form>
        </div>
      </Container>
    </main>
  );
}