

import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import React from "react";

async function fetchList(vanity_url: string) {
  // Use absolute URL for server-side fetch
  const isServer = typeof window === "undefined";
  let url = `/api/lists/vanity/${vanity_url}`;
  if (isServer) {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    url = `${base}/api/lists/vanity/${vanity_url}`;
  }
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}


export default async function ListDetailPage({ params }: { params: { vanity_url: string } }) {
  const { vanity_url } = params;
  const data = await fetchList(vanity_url);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100">
      <Container>
  <div className="pt-16 max-w-6xl mx-auto w-full px-4">
          {!data || !data.list ? (
            <Alert variant="destructive" className="mb-8">
              <AlertTitle>List Not Found</AlertTitle>
              <AlertDescription>
                Sorry, we couldn't find a list for this URL. Please check the link or try again.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Header Section with links inside card */}
              <div className="relative mb-8">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  {/* List avatar/icon or fallback */}
                  {data.list.icon ? (
                    <img src={data.list.icon} alt="List Icon" className="w-20 h-20 rounded-full shadow-lg border-4 border-white" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-400 flex items-center justify-center shadow-lg border-4 border-white">
                      <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff" /><text x="12" y="16" textAnchor="middle" fontSize="16" fill="#6366f1">🔗</text></svg>
                    </div>
                  )}
                </div>
                <div className="pt-12 pb-8 px-8 text-center">
                  <h1 className="text-4xl font-extrabold mb-2 text-indigo-700 drop-shadow-sm pt-4 pb-4">{data.list.title}</h1>
                  {data.list.description && (
                    <p className="text-lg text-gray-500 mb-8">{data.list.description}</p>
                  )}
                  {/* Links heading removed for public view */}
                  <ul className="flex flex-col gap-6">
                    {data.list.links.map((link: any, idx: number) => (
                      <li key={link.id || idx}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group w-full"
                        >
                          <Card className="p-6 flex flex-col gap-2 bg-white border border-gray-200 shadow-md group-hover:shadow-xl transition-shadow text-left">
                            <span className="text-indigo-600 font-semibold text-lg group-hover:underline break-all mb-1">
                              {link.title || link.url}
                            </span>
                            <div className="flex items-start gap-3">
                              {link.icon ? (
                                <img src={link.icon} alt="icon" className="w-10 h-10 rounded mt-1" />
                              ) : (
                                <div className="w-10 h-10 rounded bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 flex items-center justify-center mt-1">
                                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#6366f1" /><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff">🔗</text></svg>
                                </div>
                              )}
                              {link.description && (
                                <span className="text-sm text-gray-500">
                                  {link.description}
                                </span>
                              )}
                            </div>
                            {/* Visit button removed for public view */}
                          </Card>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
    </main>
  );
}
