#!/usr/bin/env bash
set -euo pipefail

TARGET=${1:-}
SITES_CONF="/apps/scripts/sites.conf"

if [ -z "$TARGET" ]; then
  echo "Usage: ./bootstrap.sh [sitename|all]"
  exit 1
fi

# Optional, ensure tools are present on PATH in headless shells
# source ~/.nvm/nvm.sh || true

while IFS=$' \t' read -r DOMAIN PORT REPO || [ -n "${DOMAIN:-}" ]; do
  # skip comments and blank lines
  [[ -z "${DOMAIN:-}" ]] && continue
  [[ "$DOMAIN" =~ ^# ]] && continue

  APP_NAME="$DOMAIN"
  APP_DIR="/apps/$DOMAIN"

  if [ "$TARGET" = "all" ] || [ "$TARGET" = "$APP_NAME" ]; then
    echo "---------------------------------------------"
    echo "Bootstrapping $APP_NAME on port $PORT from $REPO"
    echo "---------------------------------------------"

    if [ ! -d "$APP_DIR/.git" ]; then
      mkdir -p "$APP_DIR"
      echo "Cloning repository..."
      git clone "$REPO" "$APP_DIR"
      cd "$APP_DIR"
      # robust default branch detection
      DEFAULT_BRANCH=$(git remote show origin | awk '/HEAD branch/ {print $NF}')
      git checkout "$DEFAULT_BRANCH"
    else
      cd "$APP_DIR"
      echo "Updating repository..."
      # pull whichever branch is currently checked out
      CURR_BRANCH=$(git rev-parse --abbrev-ref HEAD)
      git fetch origin
      git pull --ff-only origin "$CURR_BRANCH" || true
    fi

    # site specific env, if you keep env files per domain
    if [ -f "/apps/env/$APP_NAME.env" ] && [ ! -f ".env" ]; then
      echo "Applying env file for $APP_NAME"
      cp "/apps/env/$APP_NAME.env" ".env"
    fi

    echo "Installing dependencies..."
    npm install

    echo "Building application..."
    npm run build

    echo "Restarting app with pm2..."
    pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
    # Option A, pass port via env
    PORT="$PORT" pm2 start npm --name "$APP_NAME" -- start --update-env --cwd "$APP_DIR"
    # If your start script needs arguments instead, use:
    # pm2 start npm --name "$APP_NAME" -- start -- --port "$PORT" --cwd "$APP_DIR"
  fi
done < "$SITES_CONF"

pm2 save
pm2 list
