import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { url } = await req.json();
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Invalid URL.' }, { status: 400 });
  }
  try {
    const ogs = (await import('open-graph-scraper')).default;
    const { result } = await ogs({ url });
    if (!result.success) {
      return NextResponse.json({ error: 'Failed to fetch Open Graph data.' }, { status: 500 });
    }
    return NextResponse.json({
      title: result.ogTitle || null,
      description: result.ogDescription || null,
      icon: Array.isArray(result.ogImage) && result.ogImage.length > 0 && result.ogImage[0].url ? result.ogImage[0].url : (result.favicon || null),
      url,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching Open Graph data.' }, { status: 500 });
  }
}
