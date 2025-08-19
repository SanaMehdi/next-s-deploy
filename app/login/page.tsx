import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import { LoginForm } from './ui';

export default async function Login() {
  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/posts');
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
