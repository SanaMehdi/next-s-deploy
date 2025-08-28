import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="flex flex-wrap gap-3 p-4 bg-slate-100 border-b">
      <Link href="/feed">Feed</Link>
      <Link href="/compose">Compose</Link>
      <Link href="/explore">Explore</Link>
      <Link href="/notifications">Notifications</Link>
      <Link href="/messages">Messages</Link>
      <Link href="/groups">Groups</Link>
      <Link href="/bookmarks">Bookmarks</Link>
      <Link href="/lists">Lists</Link>
      <Link href="/settings">Settings</Link>
      <Link href="/analytics">Analytics</Link>
      <Link href="/admin">Admin</Link>
      <Link href="/events">Events</Link>
      <Link href="/polls">Polls</Link>
      <Link href="/help">Help</Link>
      {/* For profile and profile links, you can add dynamic links if you know the user id */}
      {/* <Link href={`/u/${userId}`}>Profile</Link> */}
      {/* <Link href={`/u/${userId}/links`}>My Links</Link> */}
    </nav>
  );
}
