import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  redirect('/posts'); // or render something else here
}
