#!/usr/bin/env bash
set -euo pipefail

# Change if your dev server is on a different port
PORT=${PORT:-3004}
CJ=${CJ:-cookies.txt}

# Your credentials
EMAIL=${EMAIL:-sanamehdi625@gmail.com}
PASSWORD=${PASSWORD:-sana12345}

say(){ printf "\n\033[32m== %s ==\033[0m\n" "$*"; }

say "Login"
curl -sS -i -c "$CJ" -b "$CJ" -X POST "http://localhost:$PORT/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" | sed -n '1,20p'

say "Me"
ME_JSON=$(curl -sS -c "$CJ" -b "$CJ" "http://localhost:$PORT/api/auth/me")
echo "$ME_JSON"
USER_ID=$(python - <<'PY' <<<"$ME_JSON"
import json,sys
print(json.loads(sys.stdin.read())["user"]["id"])
PY
)

say "Create post"
CREATE_JSON=$(curl -sS -c "$CJ" -b "$CJ" -X POST "http://localhost:$PORT/api/posts" \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","body":"World"}')
echo "$CREATE_JSON"
POST_ID=$(python - <<'PY' <<<"$CREATE_JSON"
import json,sys
print(json.loads(sys.stdin.read())["post"]["id"])
PY
)

say "Get by id"
curl -sS -c "$CJ" -b "$CJ" "http://localhost:$PORT/api/posts/$POST_ID" | sed -n '1,200p'

say "Update"
curl -sS -c "$CJ" -b "$CJ" -X PUT "http://localhost:$PORT/api/posts/$POST_ID" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated"}' | sed -n '1,200p'

say "List"
curl -sS -c "$CJ" -b "$CJ" "http://localhost:$PORT/api/posts" | sed -n '1,200p'

say "By user"
curl -sS -c "$CJ" -b "$CJ" "http://localhost:$PORT/api/users/$USER_ID/posts" | sed -n '1,200p'

# Uncomment to delete the post afterwards:
# say "Delete"
# curl -sS -c "$CJ" -b "$CJ" -X DELETE "http://localhost:$PORT/api/posts/$POST_ID" | sed -n '1,200p'

say "Done ✅  USER_ID=$USER_ID  POST_ID=$POST_ID"
