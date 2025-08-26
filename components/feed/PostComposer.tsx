'use client'
import { useState } from 'react'
import { createPost } from '@/lib/feed'
import type { Audience } from '@/lib/types'
import { useRouter } from 'next/navigation'

export default function PostComposer({ onPublished }: { onPublished?: () => void }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [audience, setAudience] = useState<Audience>('Public')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const router = useRouter()

  async function publish() {
    setErr(null)
    if (!content.trim() && !title.trim()) { setErr('Please write something.'); return }
    setBusy(true)
    try {
      await createPost({ title: title.trim(), content: content.trim(), audience })
      setTitle(''); setContent(''); setAudience('Public')
      onPublished?.()      // refresh feed
      router.refresh?.()   // extra nudge
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to publish')
    } finally { setBusy(false) }
  }

  return (
    <section className="bg-slate-900 rounded-3xl p-5 mb-8">
      <div className="bg-white rounded-2xl p-4">
        <h2 className="font-semibold text-slate-900 mb-3">Create Post</h2>
        {err && <div className="mb-3 text-sm text-red-700 bg-red-50 ring-1 ring-red-200 rounded-lg px-3 py-2">{err}</div>}
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)"
               className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm mb-3" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write something…"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm h-24" />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700">Audience</span>
            <select value={audience} onChange={(e) => setAudience(e.target.value as Audience)}
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm">
              <option>Public</option>
              <option>Friends</option>
            </select>
          </div>
          <button onClick={publish} disabled={busy}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm hover:bg-slate-800 disabled:opacity-50">
            {busy ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>
    </section>
  )
}
