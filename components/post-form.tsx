"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function PostForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    try {
      const form = e.currentTarget;
      const fd = new FormData(form);
      const res = await fetch("/actions/create-post", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      form.reset();
      toast("Post created");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to create");
    } finally {
      setPending(false);
    }
  };

  return (
    <form className="space-y-3" action="/actions/create-post" method="post" onSubmit={onSubmit}>
      <Input name="title" placeholder="Title" required />
      <Textarea name="content" placeholder="Write something…" required rows={4} />
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Create Post"}</Button>
    </form>
  );
}
