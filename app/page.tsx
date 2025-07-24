

import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100">
      <Container>
        <div className="pt-8 max-w-3xl mx-auto w-full">
          <Card className="mb-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex flex-col items-center text-center gap-6">
              <Image src="/globe.svg" alt="The Urlist logo" width={64} height={64} className="mb-2" />
              <h1 className="text-3xl font-bold mb-2">Share Your World of Links</h1>
              <p className="text-lg text-gray-500 mb-4 max-w-xl">
                The easiest way to create, organize, and share lists of links. Curate resources, collections, and favorites - all in one place.
              </p>
              <Button size="lg" className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white rounded-xl shadow-lg hover:scale-[1.02] transition-transform" asChild>
                <a href="/s/list">Create Your List</a>
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </main>
  );
}
