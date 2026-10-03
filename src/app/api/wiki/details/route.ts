import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return NextResponse.json({ error: 'Title parameter is required' }, { status: 400 });
  }

  try {
    const wikiUrl = `https://hotwheels.fandom.com/api.php?action=query&titles=${encodeURIComponent(
      title
    )}&prop=pageimages|info&inprop=url&pithumbsize=600&format=json`;

    const res = await fetch(wikiUrl, {
      headers: {
        'User-Agent': 'HotWheelsShowcaseTracker/1.0',
      },
      next: { revalidate: 3600 },
    });

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
    const fullurl = page.fullurl || `https://hotwheels.fandom.com/wiki/${encodeURIComponent(title)}`;

    return NextResponse.json({
      found: true,
      title: page.title,
      image_url,
      wiki_url: fullurl,
    });
  } catch (error) {
    console.error('Error fetching wiki details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
