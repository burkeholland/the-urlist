import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";

export type LinkType = {
  url: string;
  title?: string | null;
  description?: string | null;
  icon?: string | null;
};

export type LinkListProps = {
  links: LinkType[];
  onRemove: (idx: number) => void;
};

export function LinkList({ links, onRemove }: LinkListProps) {
  return (
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
              onClick={() => onRemove(idx)}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
