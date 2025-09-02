export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const supabase = getServerSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return NextResponse.json({ error: error.message }, { status: 401 });
  return NextResponse.json({ user });
}
