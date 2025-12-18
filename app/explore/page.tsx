'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { type PostRow } from '@/lib/types';
import PostCard from '@/components/feed/PostCard';

export default function ExplorePage() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostRow | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      // Fetch all public posts that have an image, along with author and like details for the PostCard.
      const { data, error } = await supabase
        .from('posts')
        .select('*, author:profiles(*), likes(*)')
        .not('image_url', 'is', null)
        .eq('audience', 'Public')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching explore posts:', error);
      } else {
        // Manually add comments_count for hover, assuming it's not directly queryable here.
        // In a real app, this might be a computed column or an RPC.
        const postsWithCommentCounts = (data || []).map(p => ({ ...p, comments_count: 0 }));
        setPosts(postsWithCommentCounts);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <main className="flex justify-center bg-gray-50 min-h-screen">
      <section className="w-full max-w-[520px] px-2 py-4">
        {loading ? (
          <div className="grid grid-cols-3 gap-1">
            {/* Skeleton loaders for the grid */}
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {posts.map(post => (
              post.image_url && (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group relative aspect-square bg-gray-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={post.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white">
                    <div className="flex items-center gap-2">
                      <span>❤️</span>
                      <span className="font-semibold">{post.likes?.length ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💬</span>
                      <span className="font-semibold">{post.comments_count}</span>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {selectedPost && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
            <div className="bg-white w-full max-w-[520px] rounded-sm relative">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-2 right-2 text-xl z-10"
              >
                ✕
              </button>

              <PostCard post={selectedPost} />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
