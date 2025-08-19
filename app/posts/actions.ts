'use server';

import { revalidatePath } from 'next/cache';
import { getServerSupabase } from '@/lib/supabase/server';

export async function signOut() {
  const supabase = getServerSupabase();
  await supabase.auth.signOut();
  return true;
}

export async function createPost(formData: FormData) {
  const supabase = getServerSupabase();
  const title = String(formData.get('title') || '').trim();
  const content = String(formData.get('content') || '').trim();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('posts').insert({
    title, content, user_id: user.id,
  });
  if (error) throw error;

  revalidatePath('/posts');
  return { ok: true };
}

export async function updatePost(formData: FormData) {
  const supabase = getServerSupabase();
  const id = String(formData.get('id'));
  const title = String(formData.get('title') || '').trim();
  const content = String(formData.get('content') || '').trim();

  const { error } = await supabase
    .from('posts')
    .update({ title, content })
    .eq('id', id);

  if (error) throw error;
  revalidatePath('/posts');
  return { ok: true };
}

export async function deletePost(formData: FormData) {
  const supabase = getServerSupabase();
  const id = String(formData.get('id'));
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/posts');
  return { ok: true };
}
