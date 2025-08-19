import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { PostForm } from './ui/PostForm';
import { PostList } from './ui/PostList';
import { Button } from '@/components/ui/button';
import { signOut } from './actions';

export default async function PostsPage() {
  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: posts = [], error } = await supabase
    .from('posts')
    .select('id,title,content,created_at,updated_at,user_id')
    .eq('user_id', user.id) // 🔒 only my rows
    .order('created_at', { ascending: false });

  if (error) {
    // optional: handle error UI here
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">API Test</h1>
          <form action={signOut}>
            <Button variant="outline">Sign out</Button>
          </form>
        </header>

        {/* Create panel */}
        <section className="rounded-2xl bg-slate-800 p-5 text-slate-100 shadow">
          <div className="rounded-2xl bg-white p-4 text-slate-900 shadow-inner">
            <h2 className="mb-2 text-lg font-semibold">Posts</h2>
            <PostForm />
          </div>
          <p className="mt-6 text-center text-xs text-slate-400">No posts yet.</p>
        </section>

        {/* List panel */}
        <section className="rounded-2xl bg-slate-800 p-5 text-slate-100 shadow">
          <div className="rounded-2xl bg-white p-4 text-slate-900 shadow-inner">
            <h2 className="mb-2 text-lg font-semibold">Posts</h2>
            <PostList initialPosts={posts} userId={user.id} />
          </div>
          {posts.length === 0 && (
            <p className="mt-6 text-center text-xs text-slate-400">No posts yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}
