import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawTitle = searchParams.get('title');

    if (!rawTitle || rawTitle.trim().length === 0) {
      return NextResponse.json({ error: 'Title parameter is required' }, { status: 400 });
    }

    // Input sanitization: Trim, enforce max length of 150 chars, strip control characters
    const sanitizedTitle = rawTitle
      .trim()
      .slice(0, 150)
      .replace(/[\x00-\x1F\x7F]/g, '');

    if (!sanitizedTitle) {
      return NextResponse.json({ error: 'Valid title parameter is required' }, { status: 400 });
    }

    const wikiUrl = `https://hotwheels.fandom.com/api.php?action=query&titles=${encodeURIComponent(
      sanitizedTitle
    )}&prop=pageimages|info&inprop=url&pithumbsize=600&format=json`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(wikiUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'WortelemesVaultCollector/1.0',
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from wiki' }, { status: 502 });
    }

    const data = await res.json();
    const pages = data.query?.pages || {};
    const pageId = Object.keys(pages)[0];

    if (!pageId || pageId === '-1') {
      return NextResponse.json({ found: false });
    }

    const page = pages[pageId];
    const image_url = page.thumbnail?.source || null;
    const fullurl = page.fullurl || `https://hotwheels.fandom.com/wiki/${encodeURIComponent(sanitizedTitle)}`;

    return NextResponse.json({
      found: true,
      title: page.title,
      image_url,
      wiki_url: fullurl,
    });
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      console.warn('Wiki details request timed out');
      return NextResponse.json({ error: 'Upstream request timed out' }, { status: 504 });
    }
    console.error('Error fetching wiki details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
