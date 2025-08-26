'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { id } = useParams();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    supabase.from('profiles').select('*').eq('id', id).single().then(({ data }) => setProfile(data));
    supabase.from('badges').select('*').eq('user_id', id).then(({ data }) => setBadges(data || []));
    supabase.from('followers').select('follower_id').eq('user_id', id).then(({ data }) => setFollowers(data || []));
    supabase.from('followers').select('user_id').eq('follower_id', id).then(({ data }) => setFollowing(data || []));
  }, [id]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <div className="relative h-48 bg-gray-200">
        {profile.cover_url && (
          <img src={profile.cover_url} alt="cover" className="object-cover w-full h-full" />
        )}
        <div className="absolute -bottom-8 left-4">
          <Avatar src={profile.avatar_url} name={profile.full_name || profile.username} className="w-20 h-20 border-4 border-white" />
        </div>
      </div>
      <div className="pl-28 pt-4">
        <h1 className="text-2xl font-bold">{profile.full_name || profile.username}</h1>
        <p className="text-gray-500">@{profile.username}</p>
        <p className="mt-2">{profile.bio}</p>
        <div className="flex gap-2 mt-2">
          {badges.map((b) => (
            <Badge key={b.id}>{b.label}</Badge>
          ))}
        </div>
        <div className="flex gap-4 mt-2 text-sm text-gray-600">
          <span>{followers.length} Followers</span>
          <span>{following.length} Following</span>
        </div>
        <Button className="mt-4">Follow</Button>
      </div>
    </div>
  );
}