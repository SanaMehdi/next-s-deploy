// app/test/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function TestPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('StrongPass123!');
  const [postId, setPostId] = useState('');
  const [userId, setUserId] = useState('');

  const callApi = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options);
    const data = await res.json();
    console.log(url, data);
    return data;
  };

  return (
    <div style={{ padding: 20, maxWidth: 720 }}>
      <h1 style={{ marginBottom: 12 }}>API Test</h1>

      {/* NEW: links to separate screens */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <Link href="/signup">Signup</Link>
        <Link href="/login">Login</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>

      {/* Your existing test controls */}
      <div style={{ display:'grid', gap: 8, maxWidth: 520 }}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />

        <button onClick={() => callApi('/api/auth/signup', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })}>Signup</button>

        <button onClick={() => callApi('/api/auth/login', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })}>Login</button>

        <button onClick={() => callApi('/api/auth/me')}>Me</button>
        <button onClick={() => callApi('/api/auth/logout', { method: 'POST' })}>Logout</button>

        <hr/>

        <button onClick={async () => {
          const d = await callApi('/api/posts', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Hello', body: 'World' }),
          });
          setPostId(d.post?.id || '');
          setUserId(d.post?.user_id || '');
        }}>Create Post</button>

        <button onClick={() => callApi(`/api/posts/${postId}`)}>Get Post</button>

        <button onClick={() => callApi(`/api/posts/${postId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Updated' }),
        })}>Update Post</button>

        <button onClick={() => callApi(`/api/users/${userId}/posts`)}>Get Posts by User</button>
      </div>
    </div>
  );
}
