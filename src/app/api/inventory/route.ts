import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { showcaseCars } from '@/lib/data/mockData';
import { CollectionItem } from '@/types/diecast';

// GET /api/inventory - Retrieve all diecast collections
export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: true, data: showcaseCars, source: 'mock-fallback' });
    }

    const { data, error } = await supabaseAdmin
      .from('collections')
      .select(`
        *,
        series:series_id (*)
      `)
      .order('release_year', { ascending: false })
      .order('segment_number', { ascending: true });

    if (error) {
      console.error('Supabase query error in GET /api/inventory:', error);
      return NextResponse.json({ success: true, data: showcaseCars, error: error.message, source: 'fallback' });
    }

    // Format fields to match CollectionItem type
    const items: CollectionItem[] = (data || []).map((row: any) => ({
      id: row.id,
      series_id: row.series_id,
      series: row.series || undefined,
      name: row.name,
      casting_code: row.casting_code || undefined,
      release_year: row.release_year,
      segment_number: row.segment_number,
      color: row.color,
      scale: row.scale,
      condition: row.condition,
      tier_badge: row.tier_badge,
      sell_price: Number(row.sell_price) || 0,
      buy_price: row.buy_price !== null ? Number(row.buy_price) : undefined,
      qty: Number(row.qty) || 1,
      is_for_sale: Boolean(row.is_for_sale),
      is_favorite: Boolean(row.is_favorite),
      image_url: row.image_url,
      wiki_url: row.wiki_url || undefined,
      notes: row.notes || undefined,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return NextResponse.json({ success: true, data: items, source: 'supabase' });
  } catch (err: any) {
    console.error('Unexpected error in GET /api/inventory:', err);
    return NextResponse.json({ success: true, data: showcaseCars, source: 'mock-error-fallback' });
  }
}

// POST /api/inventory - Upsert one or multiple diecast items
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database client not configured' }, { status: 503 });
    }

    const body = await req.json();
    const isArray = Array.isArray(body);
    const items: CollectionItem[] = isArray ? body : [body];

    const records = items.map((item) => ({
      id: item.id || `car-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      series_id: item.series_id || null,
      name: item.name,
      casting_code: item.casting_code || null,
      release_year: item.release_year || 2026,
      segment_number: item.segment_number || 1,
      color: item.color || 'Standard',
      scale: item.scale || '1:64',
      condition: item.condition || 'Carded / Mint',
      tier_badge: item.tier_badge || 'Mainline',
      buy_price: item.buy_price !== undefined ? item.buy_price : 0,
      sell_price: item.sell_price || 0,
      qty: item.qty || 1,
      is_for_sale: item.is_for_sale !== undefined ? item.is_for_sale : false,
      is_favorite: item.is_favorite !== undefined ? item.is_favorite : false,
      image_url: item.image_url,
      wiki_url: item.wiki_url || null,
      notes: item.notes || null,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabaseAdmin
      .from('collections')
      .upsert(records, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Supabase upsert error in POST /api/inventory:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: data?.length || 0, data });
  } catch (err: any) {
    console.error('Error handling POST /api/inventory:', err);
    return NextResponse.json({ error: err?.message || 'Failed to upsert item' }, { status: 500 });
  }
}

// DELETE /api/inventory?id=xyz - Remove an item
export async function DELETE(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database client not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing item ID parameter' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error in DELETE /api/inventory:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    console.error('Error handling DELETE /api/inventory:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete item' }, { status: 500 });
  }
}
