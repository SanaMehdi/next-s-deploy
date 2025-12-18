'use client'
import { useState } from 'react'
import { createPost } from '@/lib/feed'
import type { Audience } from '@/lib/types'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function PostComposer({ 
  onPublished, 
  onClose, 
  groupId 
}: { 
  onPublished?: () => void, 
  onClose: () => void,
  groupId?: string 
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [audience, setAudience] = useState<Audience>('Public')
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function publish() {
    if (!content.trim() && !title.trim()) {
      toast.error('Please write something.');
      return;
    }
    setBusy(true)
    try {
      await createPost({ 
        title: title.trim(), 
        content: content.trim(), 
        audience: groupId ? 'Group' as any : audience,
        groupId: groupId
      })
      toast.success('Post shared');
      setTitle(''); setContent(''); setAudience('Public')
      onPublished?.()      // refresh feed
      router.refresh?.()   // extra nudge
      onClose()            // close modal
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to publish')
    } finally { setBusy(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h2 className="text-sm font-semibold">Create new post</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
      </div>
      <div className="p-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)"
               className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm mb-3" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write something…"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm h-24" />
        <div className="mt-3 flex items-center justify-between">
          {!groupId && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-700">Audience</span>
              <select 
                value={audience} 
                onChange={(e) => setAudience(e.target.value as Audience)}
                className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
              >
                <option>Public</option>
                <option>Friends</option>
              </select>
            </div>
          )}
          {groupId && (
            <div className="text-sm text-gray-500">
              Posting in group
            </div>
          )}
          <button onClick={publish} disabled={busy}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm hover:bg-slate-800 disabled:opacity-50">
            {busy ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}
