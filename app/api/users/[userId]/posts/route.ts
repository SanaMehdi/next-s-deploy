export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params; // ✅ await params
  const supabase = getServerSupabase();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ posts: data });
}
