'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function PostDetailPage() {
  const { id } = useParams();
  const supabase = createClient();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [reactions, setReactions] = useState<any[]>([]);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from('posts').select('*').eq('id', id).single().then(({ data }) => setPost(data));
    supabase.from('comments').select('*').eq('post_id', id).order('created_at').then(({ data }) => setComments(data || []));
    supabase.from('reactions').select('*').eq('post_id', id).then(({ data }) => setReactions(data || []));
    // TODO: Check if current user bookmarked
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <div className="mb-4 p-4 border rounded">{post.content}</div>
      <div className="flex gap-2 mb-4">
        {['👍','❤️','😂','😮','😢','👏'].map(emoji => (
          <Button key={emoji} size="sm">{emoji} {reactions.filter(r => r.emoji === emoji).length}</Button>
        ))}
        <Button size="sm" variant={bookmarked ? "default" : "outline"}>Bookmark</Button>
        <Button size="sm" variant="outline">Report</Button>
      </div>
      <div>
        <h3 className="font-bold mb-2">Comments</h3>
        {comments.map(c => (
          <div key={c.id} className="mb-2 pl-2 border-l">
            <div>{c.content}</div>
            {/* TODO: Threaded replies */}
          </div>
        ))}
      </div>
    </div>
  );
}
