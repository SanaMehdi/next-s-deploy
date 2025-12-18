import { getServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/feed/PostCard';
import type { PostRow } from '@/lib/types';

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const supabase = getServerSupabase();

  // Fetch profile and post count in one go
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, posts(count)')
    .eq('username', params.id)
    .single();

  if (!profile) {
    notFound();
  }

  // Get the currently logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch posts for this profile, using a structure similar to the main feed
  const { data: postsData = [] } = await supabase
    .from('posts')
    .select(`
      id, author_id, title, content, image_url, audience, created_at,
      author:profiles!posts_author_id_fkey (
        id, username, full_name, avatar_url
      ),
      comments:post_comments (
        id, post_id, user_id, content, created_at,
        user:profiles!post_comments_user_id_fkey (
          id, username, full_name, avatar_url
        )
      ),
      likes:post_likes (
        post_id, user_id
      )
    `)
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false });

  // Supabase returns a to-one relationship as an array. We need to flatten it.
  const posts = (postsData as any[]).map(p => ({
    ...p,
    author: Array.isArray(p.author) ? p.author[0] : p.author
  }));

  const displayName = profile.full_name || profile.username;

  return (
    <main className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <header className="flex items-center gap-6 px-4 py-6">
        <img
          src={profile.avatar_url ?? ''}
          alt={profile.username ?? 'avatar'}
          className="h-20 w-20 rounded-full"
        />

        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <p className="text-xl font-semibold">{profile.username}</p>
            {user?.id === profile.id ? (
              <Button variant="outline">Edit Profile</Button>
            ) : (
              <Button>Follow</Button>
            )}
          </div>

          <div className="flex gap-4 text-sm">
            <span><b>{posts.length}</b> posts</span>
            <span><b>0</b> followers</span>
            <span><b>0</b> following</span>
          </div>

          <p className="text-sm font-semibold">{displayName}</p>
        </div>
      </header>

      {/* Post Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post: any) => (
            <div key={post.id} className="aspect-square bg-gray-100">
              {post.image_url &&
                <img
                  src={post.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              }
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-gray-400 py-10 col-span-3">
          No posts yet
        </div>
      )}
    </main>
  );
}
