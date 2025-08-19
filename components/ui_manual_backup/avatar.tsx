import * as React from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadixAvatar.Root>) {
  return (
    <RadixAvatar.Root
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  );
}

export function AvatarImage(props: React.ComponentPropsWithoutRef<typeof RadixAvatar.Image>) {
  return <RadixAvatar.Image className="aspect-square h-full w-full" {...props} />;
}

export function AvatarFallback({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixAvatar.Fallback>) {
  return (
    <RadixAvatar.Fallback
      className={cn("flex h-full w-full items-center justify-center bg-slate-100 text-sm font-medium", className)}
      {...props}
    />
  );
}
