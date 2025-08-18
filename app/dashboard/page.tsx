import { redirect } from 'next/navigation';
import { getServerClient } from '@/lib/supabase/server';
import { TopBar } from '../components/TopBar';
import CreatePost from './parts/CreatePost';
import PostsList from './parts/PostsList';

export default async function DashboardPage() {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch this user's posts (same query your API exposes)
  const { data: posts = [] } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen">
      <TopBar email={user.email ?? user.id} />
      <main className="max-w-5xl mx-auto p-4 space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Your Posts</h2>
              <PostsList initialPosts={posts} />
            </div>
          </div>

          <aside className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="text-lg font-semibold mb-3">Create Post</h2>
              <CreatePost />
            </div>
            <div className="bg-white rounded-2xl shadow p-4 mt-4">
              <h2 className="text-lg font-semibold mb-2">Account</h2>
              <div className="text-sm text-gray-600 break-all">
                <div>User ID: <span className="font-mono">{user.id}</span></div>
                {user.email && <div>Email: {user.email}</div>}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
