#!/bin/bash
# bootstrap.sh - Setup and start apps defined in sites.conf
# Usage:
#   ./bootstrap.sh [sitename|all]

TARGET=$1
SITES_CONF="/apps/scripts/sites.conf"

if [ -z "$TARGET" ]; then
  echo "Usage: ./bootstrap.sh [sitename|all]"
  exit 1
fi

while read -r DOMAIN PORT REPO; do
  [[ "$DOMAIN" =~ ^#.*$ ]] && continue
  APP_NAME=$DOMAIN
  APP_DIR="/apps/$DOMAIN"

  if [ "$TARGET" == "all" ] || [ "$TARGET" == "$APP_NAME" ]; then
    echo "---------------------------------------------"
    echo "Bootstrapping $APP_NAME on port $PORT"
    echo "---------------------------------------------"

    if [ ! -d "$APP_DIR" ]; then
      echo "Cloning repository..."
      git clone $REPO $APP_DIR
      cd $APP_DIR || exit
      git checkout main || git checkout master
    else
      cd $APP_DIR || exit
      echo "Updating repository..."
      git pull origin main || git pull origin master
    fi

    echo "Installing dependencies..."
    npm install

    echo "Building application..."
    npm run build

    echo "Restarting app with pm2..."
    pm2 delete $APP_NAME >/dev/null 2>&1 || true
    pm2 start "npm run start" --name $APP_NAME --cwd $APP_DIR -- --port $PORT
  fi
done < $SITES_CONF

pm2 save
