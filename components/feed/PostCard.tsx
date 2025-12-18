'use client'
import { useMemo } from 'react'
import type { PostRow } from '@/lib/types'
import { toggleLike } from '@/lib/feed'
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PostCard({ post, currentUserId }: { post: PostRow; currentUserId?: string | null }) {
  const liked = useMemo(() => (post.likes ?? []).some(l => l.user_id === currentUserId), [post.likes, currentUserId])
  const likesCount = post.likes?.length ?? 0

  async function onLike() {
    try {
      await toggleLike(post.id)
      // Optimistic update can be handled here if needed
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to update like status')
    }
  }

  return (
    <div className="border bg-white rounded-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-3">
          <img
            src={post.author?.avatar_url ?? ''}
            alt={post.author?.username ?? 'user avatar'}
            className="h-8 w-8 rounded-full"
          />
          <span className="text-sm font-semibold">
            {post.author?.username ?? 'username'}
          </span>
        </div>
        <button className="text-gray-500">⋮</button>
      </div>

      {/* Image */}
      {post.image_url && (
        <div className="w-full aspect-square bg-black">
          <img
            src={post.image_url}
            alt=""
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-4">
          <button onClick={onLike} className="cursor-pointer active:scale-90 transition-transform hover:opacity-60">
            <Heart className="h-6 w-6" fill={liked ? '#ef4444' : 'none'} stroke={liked ? '#ef4444' : 'currentColor'} />
          </button>
          <button className="cursor-pointer active:scale-90 transition-transform hover:opacity-60">
            <MessageCircle className="h-6 w-6" />
          </button>
          <button className="cursor-pointer active:scale-90 transition-transform hover:opacity-60">
            <Send className="h-6 w-6" />
          </button>
        </div>
        <button className="cursor-pointer active:scale-90 transition-transform hover:opacity-60">
          <Bookmark className="h-6 w-6" />
        </button>
      </div>

      {/* Meta */}
      <div className="px-3 pb-3 text-sm space-y-1">
        <p className="font-semibold">
          {likesCount} likes
        </p>
        <p>
          <span className="font-semibold mr-1">
            {post.author?.username ?? 'username'}
          </span>
          {post.content}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(post.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

