import { Container } from "@/components/ui/container";
import React from "react";

async function fetchList(vanity_url: string) {
  const res = await fetch(`/api/lists/vanity/${vanity_url}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function ListDetailPage({ params }: { params: { vanity_url: string } }) {
  const data = await fetchList(params.vanity_url);
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
