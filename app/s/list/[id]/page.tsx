import { Container } from "@/components/ui/container";
import React from "react";

async function fetchList(id: string) {
  const res = await fetch(`/api/lists/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function ListDetailPage({ params }: { params: { id: string } }) {
  const data = await fetchList(params.id);
  if (!data) {
    return (
      <main>
        <Container>
          <h1>List Not Found</h1>
        </Container>
      </main>
    );
  }
  return (
    <main>
      <Container>
        <h1>{data.title}</h1>
        <p>{data.description}</p>
        {data.vanity_url && <p>Vanity URL: <b>{data.vanity_url}</b></p>}
        <h2>Links</h2>
        <ul>
          {data.links.map((link: any, idx: number) => (
            <li key={link.id || idx} style={{ marginBottom: 12 }}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
              <div>{link.description}</div>
              <div>Icon: {link.icon ? link.icon : <i>(reserved)</i>}</div>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
