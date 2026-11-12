import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { defaultProfile } from '@/lib/storage/profileStorage';
import { CollectorProfile } from '@/types/diecast';

// GET /api/profile
export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: true, profile: defaultProfile, source: 'mock-fallback' });
    }

    const { data, error } = await supabaseAdmin
      .from('collector_profile')
      .select('data')
      .eq('id', 'default')
      .single();

    if (error || !data?.data) {
      return NextResponse.json({ success: true, profile: defaultProfile, source: 'fallback' });
    }

    return NextResponse.json({ success: true, profile: data.data, source: 'supabase' });
  } catch (err: any) {
    console.error('Error in GET /api/profile:', err);
    return NextResponse.json({ success: true, profile: defaultProfile, source: 'error-fallback' });
  }
}

// POST /api/profile
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database client not configured' }, { status: 503 });
    }

    const profile: CollectorProfile = await req.json();

    const { data, error } = await supabaseAdmin
      .from('collector_profile')
      .upsert(
        {
          id: 'default',
          data: profile,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Error handling POST /api/profile:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update profile' }, { status: 500 });
  }
}
