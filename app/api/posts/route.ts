// Explain this API route and suggest improvements for performance and security

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const supabase = getServerSupabase();
  const url = new URL(req.url);
  const userId = url.searchParams.get('user_id') ?? undefined;

  let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
  if (userId) query = query.eq('user_id', userId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ posts: data });
}

export async function POST(req: Request) {
  const supabase = getServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, content = '' } = await req.json();
  if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 });

  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: user.id, title, content })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ post: data }, { status: 201 });
}
