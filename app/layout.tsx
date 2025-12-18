import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import { Toaster as HotToaster } from 'react-hot-toast';
import { 
  Home, 
  Search, 
  Bell, 
  MessageSquare, 
  Users, 
  Bookmark, 
  BarChart2, 
  Settings,
  Calendar,
  Menu 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'MySocial',
  description: 'A modern social media platform',
};

const navItems = [
  { name: 'Feed', path: '/feed', icon: <Home size={20} /> },
  { name: 'Explore', path: '/explore', icon: <Search size={20} /> },
  { name: 'Notifications', path: '/notifications', icon: <Bell size={20} /> },
  { name: 'Messages', path: '/messages', icon: <MessageSquare size={20} /> },
  { name: 'Groups', path: '/groups', icon: <Users size={20} /> },
  { name: 'Bookmarks', path: '/bookmarks', icon: <Bookmark size={20} /> },
  { name: 'Polls', path: '/polls', icon: <BarChart2 size={20} /> },
  { name: 'Events', path: '/events', icon: <Calendar size={20} /> },
  { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
  { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="text-xl font-bold text-pink-600">
                MySocial
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors flex items-center gap-2"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile menu button */}
              <button className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100">
                <Menu size={24} />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden overflow-x-auto hide-scrollbar">
              <div className="flex space-x-4 py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-pink-600 whitespace-nowrap flex flex-col items-center"
                  >
                    {item.icon}
                    <span className="text-xs mt-1">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>

        <ShadcnToaster />
        <HotToaster />
      </body>
    </html>
  );
}