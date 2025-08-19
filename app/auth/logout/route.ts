import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = getServerSupabase();
  await supabase.auth.signOut();
  return NextResponse.redirect(`${origin}/login`);
}
