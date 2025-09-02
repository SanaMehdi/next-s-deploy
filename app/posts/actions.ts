'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';

export async function signOut() {
  const supabase = getServerSupabase();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function createPost(formData: FormData) {

}

export async function updatePost(id: string, formData: FormData) {
  const supabase = getServerSupabase();
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
  const id = formData.get('id') as string;
  if (!id) {
    return { error: 'Missing post ID.' };
  }

  const supabase = getServerSupabase();
  const { error } = await supabase.from('posts').delete().eq('id', id)

  if (error) {
    console.error('Error deleting post:', error);
    return { error: 'Could not delete post.' };
  }

  revalidatePath('/'); // Revalidate the feed page
  return { success: true };
}
