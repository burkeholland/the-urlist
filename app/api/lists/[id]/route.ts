import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.');
}
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { data: list, error: listError } = await supabase
    .from('lists')
    .select('*')
    .eq('id', id)
    .single();

  if (listError || !list) {
    return NextResponse.json({ error: listError?.message || 'List not found.' }, { status: 404 });
  }

  const { data: links, error: linksError } = await supabase
    .from('links')
    .select('*')
    .eq('list_id', id);

  if (linksError) {
    return NextResponse.json({ error: linksError.message }, { status: 500 });
  }

  return NextResponse.json({ ...list, links }, { status: 200 });
}
