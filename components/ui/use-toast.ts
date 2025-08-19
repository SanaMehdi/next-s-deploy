'use client';

import { toast as sonnerToast } from 'sonner';
import type { ReactNode } from 'react';

type ShadcnToastInput =
  | string
  | {
      title?: ReactNode;
      description?: ReactNode;
      variant?: 'default' | 'destructive';
    };

// Adapter so existing `toast({ title, description, variant })` calls work with Sonner
export function toast(input: ShadcnToastInput) {
  if (typeof input === 'string') {
    sonnerToast(input);
    return;
  }

  const { title, description, variant } = input || {};
  const msg = [title, description].filter(Boolean).join(' — ') || '';

  if (!msg) return;

  if (variant === 'destructive') {
    sonnerToast.error(String(msg));
  } else {
    sonnerToast(String(msg));
  }
}

export default toast;
