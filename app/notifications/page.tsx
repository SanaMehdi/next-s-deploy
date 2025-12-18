'use client';

export default function NotificationsPage() {
  // Dummy data updated for Step 4: empty state and unread styling.
  const notifications = [
    {
      id: '1',
      type: 'like',
      isToday: true,
      read: false, // Unread
      actor: {
        avatar_url: 'https://placehold.co/40x40/EFEFEF/333?text=A',
        username: 'johndoe',
      },
      action: 'liked your post',
      created_at_relative: '2h',
      post: {
        image_url: 'https://placehold.co/40x40/333/FFF?text=P',
      },
    },
    {
      id: '2',
      type: 'comment',
      isToday: true,
      read: true, // Read
      actor: {
        avatar_url: 'https://placehold.co/40x40/EFEFEF/333?text=B',
        username: 'janedoe',
      },
      action: 'commented on your post: "Looks great!"',
      created_at_relative: '3h',
      post: {
        image_url: 'https://placehold.co/40x40/333/FFF?text=P',
      },
    },
    {
      id: '3',
      type: 'follow',
      isToday: false,
      read: false, // Unread
      actor: {
        avatar_url: 'https://placehold.co/40x40/EFEFEF/333?text=C',
        username: 'samjones',
      },
      action: 'started following you',
      created_at_relative: '1d',
      post: null,
    },
  ];

  const today = notifications.filter(n => n.isToday);
  const earlier = notifications.filter(n => !n.isToday);

  const renderNotification = (n: any) => {
    const icon = (
      <span className="mr-1">
        {n.type === "like" && "❤️"}
        {n.type === "comment" && "💬"}
        {n.type === "follow" && "➕"}
      </span>
    );

    return (
      <div
        key={n.id}
        className={`flex items-center gap-3 text-sm px-2 py-1 rounded
          ${!n.read ? "bg-blue-50" : ""}
        `}
      >
        {!n.read && <span className="h-2 w-2 bg-blue-500 rounded-full" />}
        {/* Avatar */}
        <img
          src={n.actor.avatar_url}
          alt={n.actor.username}
          className="h-10 w-10 rounded-full"
        />

        {/* Text */}
        <div className="flex-1">
          <p>
            <span className="font-semibold">{n.actor.username}</span>
            &nbsp;
            {icon}
            {n.action}
          </p>
          <p className="text-xs text-gray-500">
            {n.created_at_relative}
          </p>
        </div>

        {/* Optional thumbnail (post-related) */}
        {n.post?.image_url && (
          <img
            src={n.post.image_url}
            alt=""
            className="h-10 w-10 object-cover rounded"
          />
        )}
      </div>
    );
  }

  return (
    <main className="flex justify-center bg-gray-50 min-h-screen">
      <section className="w-full max-w-[520px] px-4 py-4">
        {notifications.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-20">
            You’re all caught up 🎉
          </div>
        )}

        {today.length > 0 && (
          <>
            <p className="text-xs font-semibold text-gray-500 mb-2">
              Today
            </p>
            <div className="space-y-4 mb-6">
              {today.map(renderNotification)}
            </div>
          </>
        )}

        {earlier.length > 0 && (
          <>
            <p className="text-xs font-semibold text-gray-500 mb-2">
              Earlier
            </p>
            <div className="space-y-4">
              {earlier.map(renderNotification)}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
