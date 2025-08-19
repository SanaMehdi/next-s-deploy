"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Post = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  profiles?: { email: string } | null;
  created_at: string;
  updated_at: string;
};

export function PostList({
  posts,
  currentUserId,
}: {
  posts: Post[];
  currentUserId: string | null;
}) {
  if (!posts?.length) return <p className="text-sm text-muted-foreground">No posts yet.</p>;
  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <PostItem key={p.id} post={p} canEdit={currentUserId === p.user_id} />
      ))}
    </div>
  );
}

function PostItem({ post, canEdit }: { post: Post; canEdit: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const save = async () => {
    setPending(true);
    try {
      const fd = new FormData();
      fd.set("title", title);
      fd.set("content", content);
      const res = await fetch(`/actions/update-post?id=${post.id}`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      toast("Updated");
      setEditing(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to update");
    } finally {
      setPending(false);
    }
  };

  const del = async () => {
    if (!confirm("Delete this post?")) return;
    setPending(true);
    try {
      const res = await fetch(`/actions/delete-post?id=${post.id}`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      toast("Deleted");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to delete");
    } finally {
      setPending(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        {editing ? (
          <div className="space-y-2">
            <Input value={title} onChange={(e)=>setTitle(e.target.value)} />
            <Textarea rows={4} value={content} onChange={(e)=>setContent(e.target.value)} />
            <div className="flex gap-2">
              <Button size="sm" onClick={save} disabled={pending}>Save</Button>
              <Button size="sm" variant="secondary" onClick={()=>setEditing(false)} disabled={pending}>Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="font-semibold">{post.title}</h3>
            <p className="whitespace-pre-wrap text-sm">{post.content}</p>
            <div className="text-xs text-muted-foreground">
              by {post.profiles?.email ?? "user"} · {new Date(post.created_at).toLocaleString()}
            </div>
            {canEdit && (
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={()=>setEditing(true)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={del} disabled={pending}>Delete</Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
