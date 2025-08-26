'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const redirectedFrom = params.get('redirectedFrom') || '/feed'

  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!email.trim()) { setError('Please enter your email.'); return }
    if (!password.trim()) { setError('Please enter your password.'); return }

    setLoading(true)
    const supabase = createClient();
    try {
      if (mode === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      }
      router.push(redirectedFrom)
    } catch (err: any) {
      setError(err?.message ?? 'Sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  async function signInWithGoogle() {
    setError(null)
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}${redirectedFrom}`
          : undefined,
      },
    })
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {mode === 'signIn' ? 'Sign in' : 'Create account'}
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? (mode === 'signIn' ? 'Signing in…' : 'Signing up…') : (mode === 'signIn' ? 'Sign in' : 'Sign up')}
            </button>
            <button
              type="button"
              className="text-sm text-slate-600 hover:text-slate-900"
              onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
            >
              {mode === 'signIn' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full px-4 py-2 rounded-xl bg-slate-100 text-slate-800 text-sm hover:bg-slate-200"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}
