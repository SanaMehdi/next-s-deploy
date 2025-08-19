'use client';

import { useRef, useTransition } from 'react';
import { createPost } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

export function PostForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={ref}
      action={(fd) =>
        startTransition(async () => {
          try {
            await createPost(fd);
            toast({ title: 'Post created' });
            ref.current?.reset();
          } catch (e: any) {
            toast({ variant: 'destructive', title: e.message || 'Failed to create' });
          }
        })
      }
      className="space-y-3"
    >
      <Input name="title" placeholder="Title" required />
      <Textarea name="content" placeholder="Write something..." required rows={3} />
      <Button disabled={isPending} className="w-full">Create Post</Button>
    </form>
  );
}
