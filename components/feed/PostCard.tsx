'use client'
import { useMemo, useState } from 'react'
import type { PostRow } from '@/lib/types'
import { addComment, toggleLike } from '@/lib/feed'

function Avatar({ name, src }: { name?: string | null; src?: string | null }) {
  const initial = (name ?? '?').charAt(0).toUpperCase()
  return (
    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0">
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <span className="text-sm font-semibold text-slate-700">{initial}</span>}
    </div>
  )
}

export default function PostCard({ post, currentUserId }: { post: PostRow; currentUserId?: string | null }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const liked = useMemo(() => (post.likes ?? []).some(l => l.user_id === currentUserId), [post.likes, currentUserId])
  const likesCount = post.likes?.length ?? 0
  const commentsCount = post.comments?.length ?? 0

  async function onLike() { await toggleLike(post.id) }
  async function onComment() { if (!text.trim()) return; await addComment(post.id, text); setText('') }

  const displayName = post.author?.full_name ?? post.author?.username ?? 'User'
  const handle = post.author?.username ? `@${post.author.username}` : ''
  const ts = new Date(post.created_at).toLocaleString()

  return (
    <article className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 mb-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={displayName} src={post.author?.avatar_url} />
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">{displayName}</span>
              {handle && <span className="text-slate-500">@{post.author!.username}</span>}
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 text-sm">{ts}</span>
            </div>
            <div className="mt-1">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                post.audience === 'Public'
                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                  : 'bg-indigo-50 text-indigo-700 ring-indigo-200'
              }`}>
                {post.audience === 'Public' ? '🌐 Public' : '👥 Friends'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      {post.title && <h3 className="font-semibold text-slate-900 text-xl mt-4">{post.title}</h3>}
      {post.content && <p className="text-slate-700 mt-2 whitespace-pre-wrap">{post.content}</p>}
      {post.image_url && <img key={post.id} src={post.image_url} alt="Post image" className="mt-4 w-full h-auto rounded-lg" />}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={onLike}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 ${
            liked ? 'bg-slate-900 text-white ring-slate-900' : 'bg-slate-100 text-slate-800 ring-slate-200 hover:bg-slate-200'
          }`}
          aria-pressed={liked}
        >
          <span>👍</span>
          <span>Like • {likesCount}</span>
        </button>
        <button
          onClick={() => setOpen(v => !v)}
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm bg-slate-100 text-slate-800 ring-1 ring-slate-200 hover:bg-slate-200"
        >
          <span>💬</span>
          <span>Comment • {commentsCount}</span>
        </button>
      </div>

      {/* Comments */}
      {open && (
        <div className="mt-4 border-t pt-4 space-y-3">
          <div className="flex items-start gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment…"
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <button onClick={onComment} className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm hover:bg-slate-800">
              Post
            </button>
          </div>
          <ul className="space-y-2">
            {(post.comments ?? []).map((c) => (
              <li key={c.id} className="flex gap-3 text-sm text-slate-700 bg-slate-50 rounded-xl px-3 py-2">
                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-slate-700">
                    {(c.user?.full_name ?? c.user?.username ?? 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-slate-900 font-medium">
                    {c.user?.full_name ?? c.user?.username ?? 'User'}
                    <span className="text-slate-500 font-normal"> · {new Date(c.created_at).toLocaleString()}</span>
                  </div>
                  <div className="mt-0.5 whitespace-pre-wrap">{c.content}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
