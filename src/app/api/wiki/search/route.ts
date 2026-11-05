import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get('q');

    if (!rawQuery || rawQuery.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    // Input Sanitization: Trim, enforce max length, strip control chars
    const sanitizedQuery = rawQuery
      .trim()
      .slice(0, 80)
      .replace(/[\x00-\x1F\x7F]/g, '');

    if (!sanitizedQuery) {
      return NextResponse.json({ results: [] });
    }

    const wikiUrl = `https://hotwheels.fandom.com/api.php?action=opensearch&search=${encodeURIComponent(
      sanitizedQuery
    )}&limit=8&format=json`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const res = await fetch(wikiUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'WortelemesVaultCollector/1.0',
        Accept: 'application/json',
      },
      next: { revalidate: 3600 }, // Cache 1 hour
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await res.json();
    // MediaWiki opensearch response format: [query, [titles], [descriptions], [urls]]
    const titles: string[] = Array.isArray(data?.[1]) ? data[1] : [];
    const urls: string[] = Array.isArray(data?.[3]) ? data[3] : [];

    const results = titles.map((title, index) => ({
      title: String(title),
      url: String(urls[index] || ''),
    }));

    return NextResponse.json({ results });
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      console.warn('Wiki search timed out');
      return NextResponse.json({ results: [], error: 'Upstream search timed out' }, { status: 504 });
    }
    console.error('Error fetching Hot Wheels Wiki API:', error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
