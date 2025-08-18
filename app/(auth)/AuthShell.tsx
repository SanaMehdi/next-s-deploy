'use client';

import Link from 'next/link';

export default function AuthShell({
  title,
  children,
  footer
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-gray-500">Supabase • Next.js</p>
        </div>
        {children}
        {footer && <div className="text-center text-sm text-gray-600">{footer}</div>}
      </div>
    </div>
  );
}
