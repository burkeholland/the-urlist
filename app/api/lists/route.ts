import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.');
}
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, vanity_url, links } = body;

  // Basic validation
  if (!title || !Array.isArray(links) || links.length === 0) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  // Check vanity_url uniqueness
  const sanitizedVanityUrl = typeof vanity_url === 'string' ? vanity_url.trim() : '';
  if (sanitizedVanityUrl) {
    const { data: existing } = await supabase
      .from('lists')
      .select('id')
      .eq('vanity_url', sanitizedVanityUrl)
      .single();
    if (existing) {
      return NextResponse.json({ error: 'Vanity URL is already taken.' }, { status: 409 });
    }
  }

  // Create list
  const { data: list, error: listError } = await supabase
    .from('lists')
    .insert({ title, description: description ?? null, vanity_url: sanitizedVanityUrl || null })
    .select()
    .single();

  if (listError || !list) {
    // Check for unique constraint violation on vanity_url
    if (listError?.message && listError.message.includes('duplicate key value violates unique constraint')) {
      return NextResponse.json({ error: 'Vanity URL is already taken.' }, { status: 409 });
    }
    return NextResponse.json({ error: listError?.message || 'Failed to create list.' }, { status: 500 });
  }

  // Insert links
  const linksToInsert = links.map((link: any) => ({
    list_id: list.id,
    url: link.url,
    title: null,
    description: null,
    icon: null,
  }));

  const { error: linksError } = await supabase
    .from('links')
    .insert(linksToInsert);

  if (linksError) {
    return NextResponse.json({ error: linksError.message }, { status: 500 });
  }

  return NextResponse.json({ list }, { status: 201 });
}
