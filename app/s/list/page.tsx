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

  // Add URL to links array
  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const url = currentUrl.trim();
      if (!url) return;
      // Validate URL
      const result = linkSchema.safeParse({ url });
      if (!result.success) {
        form.setError("root", { message: result.error.issues[0].message });
        return;
      }
      form.clearErrors("root");
      form.setValue("links", [...form.getValues("links"), { url }]);
      setCurrentUrl("");
      urlInputRef.current?.focus();
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <ul className="mt-4 space-y-2">
                {form.getValues("links").map((link, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="truncate max-w-xs">{link.url}</span>
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