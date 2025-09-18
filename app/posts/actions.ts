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
  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Handle unauthenticated user
    return { error: 'You must be logged in to create a post.' };
  }

  const title = String(formData.get('title') || '').trim();
  const content = String(formData.get('content') || '').trim();
  const imageFile = formData.get('image') as File;

  let imageUrl = null;

  if (imageFile && imageFile.size > 0) {
    const { data, error } = await supabase.storage
      .from('images-test')
      .upload(`${user.id}/${Date.now()}`, imageFile);

    if (error) {
      console.error('Error uploading image:', error);
      return { error: 'Failed to upload image.' };
    }
    const { data: { publicUrl } } = supabase.storage.from('images-test').getPublicUrl(data.path);
    imageUrl = publicUrl;
  }

  const { error: insertError } = await supabase
    .from('posts')
    .insert({ user_id: user.id, title, content, image_url: imageUrl });

  if (insertError) {
    console.error('Error creating post:', insertError);
    return { error: 'Failed to create post.' };
  }

  revalidatePath('/'); // Revalidate the feed page
  revalidatePath('/dashboard'); // Revalidate the dashboard page
  return { success: true };
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

  // First, fetch the post to get the image_url
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('image_url')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching post for deletion:', fetchError);
    return { error: 'Could not find post to delete.' };
  }

  // Now, delete the post from the database
  const { error: deleteError } = await supabase.from('posts').delete().eq('id', id);

  if (deleteError) {
    console.error('Error deleting post:', deleteError);
    return { error: 'Could not delete post.' };
  }

  // If the post had an image, delete it from storage
  if (post.image_url) {
    const bucketName = 'images-test';
    // Extract the file path from the URL
    const filePath = post.image_url.split(`${bucketName}/`)[1];
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
        // Non-critical error, so we don't return. The post is already deleted.
      }
    }
  }

  revalidatePath('/'); // Revalidate the feed page
  revalidatePath('/dashboard'); // Also revalidate the dashboard
  return { success: true };
}
