import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import React, { useRef } from "react";

export type LinkInputProps = {
  currentUrl: string;
  setCurrentUrl: (url: string) => void;
  loadingPreview: boolean;
  previewError: string | null;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  urlInputRef: React.RefObject<HTMLInputElement>;
  linksCount: number;
};

export function LinkInput({
  currentUrl,
  setCurrentUrl,
  loadingPreview,
  previewError,
  onKeyDown,
  urlInputRef,
  linksCount,
}: LinkInputProps) {
  return (
    <section className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Add New Link</h2>
        <Badge variant="secondary" className="ml-2">{linksCount} added</Badge>
      </div>
      <FormItem>
        <FormLabel>Paste a URL and press Enter</FormLabel>
        <FormControl>
          <Input
            ref={urlInputRef}
            placeholder="https://example.com"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            onKeyDown={onKeyDown}
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
  );
}
