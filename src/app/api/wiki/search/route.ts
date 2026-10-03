import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  try {
    const wikiUrl = `https://hotwheels.fandom.com/api.php?action=opensearch&search=${encodeURIComponent(
      query.trim()
    )}&limit=8&format=json`;

    const res = await fetch(wikiUrl, {
      headers: {
        'User-Agent': 'HotWheelsShowcaseTracker/1.0',
      },
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await res.json();
    // MediaWiki opensearch response format: [query, [titles], [descriptions], [urls]]
    const titles: string[] = data[1] || [];
    const urls: string[] = data[3] || [];

    const results = titles.map((title, index) => ({
      title,
      url: urls[index] || '',
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error fetching Hot Wheels Wiki API:', error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
