import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { defaultArticles, defaultUpcomingDrops } from '@/lib/storage/newsStorage';
import { ArticleItem, UpcomingDropItem } from '@/types/diecast';

// GET /api/news - Retrieve articles and drops
export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: true,
        articles: defaultArticles,
        drops: defaultUpcomingDrops,
        source: 'mock-fallback',
      });
    }

    const [articlesRes, dropsRes] = await Promise.all([
      supabaseAdmin.from('news_articles').select('*').order('created_at', { ascending: false }),
      supabaseAdmin.from('upcoming_drops').select('*').order('created_at', { ascending: true }),
    ]);

    const articles: ArticleItem[] = (articlesRes.data && articlesRes.data.length > 0)
      ? articlesRes.data.map((r: any) => ({
          id: r.id,
          category: r.category,
          title: r.title,
          excerpt: r.excerpt || '',
          content: r.content || '',
          date: r.date || '',
          readTime: r.read_time || '3 min read',
          tag: r.tag || 'News',
        }))
      : defaultArticles;

    const drops: UpcomingDropItem[] = (dropsRes.data && dropsRes.data.length > 0)
      ? dropsRes.data.map((r: any) => ({
          id: r.id,
          month: r.month,
          date: r.date,
          model: r.model,
          series: r.series || '',
          status: r.status || 'Upcoming',
        }))
      : defaultUpcomingDrops;

    return NextResponse.json({
      success: true,
      articles,
      drops,
      source: 'supabase',
    });
  } catch (err: any) {
    console.error('Error in GET /api/news:', err);
    return NextResponse.json({
      success: true,
      articles: defaultArticles,
      drops: defaultUpcomingDrops,
      source: 'error-fallback',
    });
  }
}

// POST /api/news - Upsert article or drop
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database client not configured' }, { status: 503 });
    }

    const body = await req.json();
    const type = body.type; // 'article' | 'drop'

    if (type === 'article') {
      const art: ArticleItem = body.data;
      const record = {
        id: art.id || `art-${Date.now()}`,
        category: art.category,
        title: art.title,
        excerpt: art.excerpt,
        content: art.content,
        date: art.date,
        read_time: art.readTime,
        tag: art.tag,
      };

      const { data, error } = await supabaseAdmin
        .from('news_articles')
        .upsert(record, { onConflict: 'id' })
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    } else if (type === 'drop') {
      const drop: UpcomingDropItem = body.data;
      const record = {
        id: drop.id || `drop-${Date.now()}`,
        month: drop.month,
        date: drop.date,
        model: drop.model,
        series: drop.series || null,
        status: drop.status || 'Upcoming',
      };

      const { data, error } = await supabaseAdmin
        .from('upcoming_drops')
        .upsert(record, { onConflict: 'id' })
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: 'Invalid type parameter (expected article or drop)' }, { status: 400 });
  } catch (err: any) {
    console.error('Error handling POST /api/news:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update news' }, { status: 500 });
  }
}

// DELETE /api/news?type=article&id=xyz
export async function DELETE(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database client not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!id || !type) {
      return NextResponse.json({ error: 'Missing required parameters id and type' }, { status: 400 });
    }

    const table = type === 'article' ? 'news_articles' : 'upcoming_drops';
    const { error } = await supabaseAdmin.from(table).delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, deletedId: id, type });
  } catch (err: any) {
    console.error('Error handling DELETE /api/news:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete' }, { status: 500 });
  }
}
