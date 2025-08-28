export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: 'Missing email/password' }, { status: 400 });

  const supabase = await getServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return NextResponse.json({ error: error.message }, { status: 401 });

  // Return the entire session object. It includes the user, access_token,
  // and refresh_token, which is more useful for the client.
  return NextResponse.json({ session: data.session });
}
