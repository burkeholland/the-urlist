import { Container } from "@/components/ui/container";
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
  const { vanity_url } = await params;
  const data = await fetchList(vanity_url);
  if (!data || !data.list) {
    return (
      <main>
        <Container>
          <h1>List Not Found</h1>
        </Container>
      </main>
    );
  }
  const list = data.list;
  return (
    <main>
      <Container>
        <h1>{list.title}</h1>
        {list.description && <p>{list.description}</p>}
        <p>Vanity URL: <b>{list.vanity_url}</b></p>
        <h2>Links</h2>
        <ul>
          {list.links.map((link: any, idx: number) => (
            <li key={link.id || idx} style={{ marginBottom: 12 }}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
