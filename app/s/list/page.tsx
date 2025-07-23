
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
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
  type LinkType = {
    url: string;
    title?: string | null;
    description?: string | null;
    icon?: string | null;
  };
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
        body: JSON.stringify({ ...values, links: form.getValues("links") }),
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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100">
      <Container>
        <div className="pt-8 max-w-3xl mx-auto w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              {/* Section 1: List Details - large and prominent */}
              <section className="mb-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-3xl font-bold mb-4">List Details</h2>
                <p className="text-lg text-gray-500 mb-6">Give your list a title, description, and custom URL.</p>
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
              <section className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">Add New Link</h2>
                  <Badge variant="secondary" className="ml-2">{links.length} added</Badge>
                </div>
                <FormItem>
                  <FormLabel>Paste a URL and press Enter</FormLabel>
                  <FormControl>
                    <Input
                      ref={urlInputRef}
                      placeholder="https://example.com"
                      value={currentUrl}
                      onChange={(e) => setCurrentUrl(e.target.value)}
                      onKeyDown={handleUrlKeyDown}
                      disabled={loadingPreview}
                      className="bg-gray-50 border border-gray-200 rounded-lg text-xl py-4 px-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                {loadingPreview && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <svg className="animate-spin h-4 w-4 text-indigo-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                    Loading preview...
                  </div>
                )}
                {previewError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{previewError}</AlertDescription>
                  </Alert>
                )}
              </section>
              {/* Section 3: Links List */}
              <section>
                <h2 className="text-lg font-semibold mb-4">Links List</h2>
                <ul className="space-y-4">
                  {links.map((link, idx) => (
                    <li key={idx} className="transition-all duration-200 w-full bg-white rounded-xl shadow flex items-center gap-4 p-4 border border-gray-100 hover:shadow-lg">
                      {link.icon && (
                        <img src={link.icon} alt="icon" className="w-12 h-12 object-contain rounded-lg border border-gray-200" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-lg truncate text-indigo-700">{link.title ? link.title : link.url}</div>
                        {link.description && (
                          <div className="text-gray-600 text-sm mt-1 truncate">{link.description}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-1 break-all">{link.url}</div>
                      </div>
                      <Badge variant="outline" className="mr-2">Link</Badge>
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
              </section>
              {/* Error and submit button */}
              {form.formState.errors.root?.message && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{form.formState.errors.root?.message}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || links.length === 0}
                className="w-full mt-8 py-3 text-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
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