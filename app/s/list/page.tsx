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
  links: z
    .array(linkSchema)
    .min(1, { message: "At least one link required" }),
});

type FormValues = z.infer<typeof formSchema>;

const normalizeUrl = (url: string) => {
  // If the URL does not start with http:// or https://, prepend https://
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

export default function ListPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      vanity_url: "",
      links: [],
    },
  });

  const urlInputRef = useRef<HTMLInputElement>(null);

  // Local state for the current URL input
  const [currentUrl, setCurrentUrl] = React.useState("");

  // Open Graph preview state
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
          // Immediately add the link with Open Graph info
          form.setValue("links", [...form.getValues("links"), {
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
    const links = form.getValues("links");
    form.setValue("links", links.filter((_, i) => i !== idx));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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

  return (
    <main>
      <Container>
        <h1 className="text-2xl font-bold mb-6">Create a New List</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="List title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="List description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vanity_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vanity URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Custom URL (e.g. favorites)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <h2 className="text-lg font-semibold mb-2">Links</h2>
              <FormItem>
                <FormLabel>Enter a URL and press Enter</FormLabel>
                <FormControl>
                  <Input
                    ref={urlInputRef}
                    placeholder="https://example.com"
                    value={currentUrl}
                    onChange={(e) => setCurrentUrl(e.target.value)}
                    onKeyDown={handleUrlKeyDown}
                    disabled={loadingPreview}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              {loadingPreview && <div className="mt-2 text-sm text-gray-500">Loading preview...</div>}
              {previewError && <div className="mt-2 text-sm text-red-500">{previewError}</div>}
              <ul className="mt-4 space-y-4">
                {form.getValues("links").map((link, idx) => (
                  <li key={idx} className="w-full bg-white rounded-lg shadow flex items-center gap-4 p-4 border">
                    {link.icon && (
                      <img src={link.icon} alt="icon" className="w-12 h-12 object-contain rounded" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg truncate">{link.title ? link.title : link.url}</div>
                      {link.description && (
                        <div className="text-gray-600 text-sm mt-1 truncate">{link.description}</div>
                      )}
                      <div className="text-xs text-gray-400 mt-1 break-all">{link.url}</div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveLink(idx)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <Button type="submit" disabled={form.formState.isSubmitting || form.getValues("links").length === 0}>
              {form.formState.isSubmitting ? "Creating..." : "Create List"}
            </Button>
            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
          </form>
        </Form>
      </Container>
    </main>
  );
}