import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.');
}
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request, { params }: { params: { vanity_url: string } }) {
  const { vanity_url } = params;
  const { data: list, error } = await supabase
    .from('lists')
    .select('id')
    .eq('vanity_url', vanity_url)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exists: !!list }, { status: 200 });
}
