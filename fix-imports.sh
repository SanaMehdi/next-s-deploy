#!/usr/bin/env bash
set -e

files=(
  "app/api/posts/route.ts"
  "app/api/posts/[id]/route.ts"
  "app/api/auth/login/route.ts"
  "app/api/auth/logout/route.ts"
  "app/api/auth/me/route.ts"
  "app/api/auth/signup/route.ts"
  "app/api/users/[userId]/posts/route.ts"
)

for f in "${files[@]}"; do
  if [ -f "$f" ]; then
    sed -i '' -E "s#from ['\"][.\/A-Za-z_-]*src/lib/supabase/server['\"];#from '@/lib/supabase/server';#" "$f"
    echo "Updated: $f"
  fi
done
