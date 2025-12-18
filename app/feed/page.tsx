'use client'
import { useEffect, useState, useCallback } from 'react'
import NavBar from '@/components/NavBar'
import PostComposer from '@/components/feed/PostComposer'
import PostCard from '@/components/feed/PostCard'
import { PostSkeleton } from '@/components/feed/PostSkeleton'
import { fetchFeed } from '@/lib/feed'
import type { PostRow } from '@/lib/types'
import { supabase } from '@/lib/supabase/client'

export default function FeedPage() {
  const [posts, setPosts] = useState<PostRow[]>([])
  const [loading, setLoading] = useState(true)
  const [uid, setUid] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchFeed()
      setPosts(data)
    } finally {
      setLoading(false)
    }
  }, [])

  // Always load the feed (shows Public posts even before session resolves)
  useEffect(() => {
    // Only load once on mount
    load();

    // Track auth changes for liked-state; do NOT gate fetching on it
    supabase.auth.getSession().then(({ data }) => setUid(data.session?.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUid(session?.user?.id ?? null);
    });

    // Realtime refresh
    const channel = supabase
      .channel('feed-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload) => {
        console.log('Realtime event on posts:', payload);
        load();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, (payload) => {
        console.log('Realtime event on post_likes:', payload);
        load();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_comments' }, (payload) => {
        console.log('Realtime event on post_comments:', payload);
        load();
      })
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Realtime channel subscribed successfully!');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Realtime channel error:', err);
        }
      });

    return () => {
      sub.subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [load]);

  return (
    <main className="flex justify-center bg-gray-50 min-h-screen">
      <section className="w-full max-w-[480px] px-2 py-4 space-y-4">
        <button
          onClick={() => setOpen(true)}
          className="border bg-white px-4 py-3 rounded-sm text-sm text-gray-500 hover:bg-gray-50 w-full"
        >
          Create a new post...
        </button>

        {open && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-sm">
              <PostComposer onPublished={load} onClose={() => setOpen(false)} />
            </div>
          </div>
        )}

        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-10">
            No posts yet. Be the first to share ✨
          </div>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} currentUserId={uid} />)
        )}
      </section>
    </main>
  )
}
