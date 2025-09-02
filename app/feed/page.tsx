'use client'
import { useEffect, useState, useCallback } from 'react'
import NavBar from '@/components/NavBar'
import PostComposer from '@/components/feed/PostComposer'
import PostCard from '@/components/feed/PostCard'
import { fetchFeed } from '@/lib/feed'
import type { PostRow } from '@/lib/types'
import { supabase } from '@/lib/supabase/client'

export default function FeedPage() {
  const [posts, setPosts] = useState<PostRow[]>([])
  const [loading, setLoading] = useState(true)
  const [uid, setUid] = useState<string | null>(null)

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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_comments' }, load)
      .subscribe();

    return () => {
      sub.subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [load]);

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <NavBar />
      <div className="max-w-3xl mx-auto px-4">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Feed</h1>
        </header>

        <PostComposer onPublished={load} />

        {loading ? (
          <div className="text-sm text-slate-500">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="text-sm text-slate-500">No posts yet.</div>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} currentUserId={uid} />)
        )}
      </div>
    </div>
  )
}
