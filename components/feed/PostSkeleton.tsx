export function PostSkeleton() {
  return (
    <div className="border bg-white rounded-sm animate-pulse">
      <div className="h-10 px-3 flex items-center gap-3">
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
      </div>
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-200 rounded" />
      </div>
    </div>
  );
}
