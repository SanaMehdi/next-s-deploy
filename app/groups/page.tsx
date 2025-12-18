'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/feed/PostCard';
import dynamic from 'next/dynamic';
import { loadGroupPosts } from '@/lib/group-utils';

// Dynamically import PostComposer to avoid SSR issues
const PostComposer = dynamic(
  () => import('@/components/feed/PostComposer'),
  { ssr: false }
);

interface Group {
  id: string;
  name: string;
  description: string;
  members_count: number;
  is_member: boolean;
}

export default function GroupPage() {
  const params = useParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  // Load group posts function
  const loadGroupPosts = async () => {
    if (!params.groupId) return;
    
    try {
      const { data: postsData } = await supabase
        .from('posts')
        .select(`
          *,
          author:user_id (id, username, full_name, avatar_url),
          comments:post_comments (id, content, created_at, user_id, user:user_id (id, username, avatar_url)),
          likes:post_likes (user_id)
        `)
        .eq('group_id', params.groupId)
        .order('created_at', { ascending: false });
        
      setPosts(postsData || []);
    } catch (error) {
      console.error('Error loading group posts:', error);
    }
  };

  useEffect(() => {
    const loadGroup = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
        
        // Load group data
        const { data: groupData } = await supabase
          .from('groups')
          .select('*')
          .eq('id', params.groupId)
          .single();
          
        if (groupData) {
          // Check if current user is a member
          let isMember = false;
          
          if (user) {
            const { data: membership } = await supabase
              .from('group_members')
              .select('*')
              .eq('group_id', params.groupId)
              .eq('user_id', user.id)
              .single();
              
            isMember = !!membership;
          }
          
          // Get member count
          const { count } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', params.groupId);
            
          setGroup({
            ...groupData,
            members_count: count || 0,
            is_member: isMember
          });
          
          // Load group posts
          await loadGroupPosts();
        }
      } catch (error) {
        console.error('Error loading group:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGroup();
  }, [params.groupId]);

  const handleJoinLeave = async () => {
    if (!group || !params.groupId) return;
    
    try {
      setIsJoining(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      if (group.is_member) {
        // Leave group
        await supabase
          .from('group_members')
          .delete()
          .eq('group_id', params.groupId)
          .eq('user_id', user.id);
      } else {
        // Join group
        await supabase
          .from('group_members')
          .insert([{ group_id: params.groupId, user_id: user.id }]);
      }
      
      // Update local state
      setGroup(prev => prev ? {
        ...prev,
        is_member: !prev.is_member,
        members_count: prev.is_member ? prev.members_count - 1 : prev.members_count + 1
      } : null);
      
    } catch (error) {
      console.error('Error updating group membership:', error);
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div>Loading...</div>
      </main>
    );
  }

  if (!group) {
    return (
      <main className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div>Group not found</div>
      </main>
    );
  }

  return (
    <main className="flex justify-center bg-gray-50 min-h-screen">
      <section className="w-full max-w-[520px] bg-white">
        {/* Group Header */}
        <div className="px-4 py-4 border-b">
          <h1 className="text-lg font-semibold">
            {group.name}
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {group.description}
          </p>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">
              {group.members_count} {group.members_count === 1 ? 'member' : 'members'}
            </span>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleJoinLeave}
                disabled={isJoining}
                className={`px-3 py-1 text-sm border rounded ${
                  group.is_member 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-blue-500 text-white border-blue-500'
                }`}
              >
                {isJoining ? '...' : group.is_member ? 'Joined' : 'Join'}
              </button>
              
              {group.is_member && (
                <button
                  onClick={() => setIsComposerOpen(true)}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                >
                  Post in group
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Group Posts */}
        <div className="divide-y">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="p-4">
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No posts in this group yet.
              {group.is_member && (
                <button
                  onClick={() => setIsComposerOpen(true)}
                  className="mt-2 block text-blue-500 hover:underline"
                >
                  Be the first to post
                </button>
              )}
            </div>
          )}
        </div>

        {/* Post Composer Modal */}
        {isComposerOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">Create Post</h3>
                <button 
                  onClick={() => setIsComposerOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <PostComposer
                onPublished={() => {
                  loadGroupPosts().then(() => {
                    setIsComposerOpen(false);
                  });
                }}
                groupId={group.id}
                onClose={() => setIsComposerOpen(false)}
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}