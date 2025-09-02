export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function POST() {
  const supabase = getServerSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
