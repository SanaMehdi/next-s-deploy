export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = await getServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
