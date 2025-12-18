import { supabase } from './supabase/client';
import { PostRow } from './types';

export const loadGroupPosts = async (groupId: string): Promise<PostRow[]> => {
  if (!groupId) return [];
  
  try {
    const { data: postsData } = await supabase
      .from('posts')
      .select(`
        *,
        author:user_id (id, username, full_name, avatar_url),
        comments:post_comments (id, content, created_at, user_id, user:user_id (id, username, avatar_url)),
        likes:post_likes (user_id)
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });
      
    return (postsData as PostRow[]) || [];
  } catch (error) {
    console.error('Error loading group posts:', error);
    return [];
  }
};
