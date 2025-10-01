#!/usr/bin/env bash
# manage.sh, Manage all Next.js and Strapi apps with PM2
# Usage:
#   ./manage.sh <start|stop|restart|status|pull|logs|health|verify|delete|update|save> [sitename|all]
# sites.conf format:
#   domain  port  repo  [subdir]
# example:
#   raceready.com.au  3001  git@bitbucket.org:mraadmin/site-frontend.git
#   some.site.au      3002  git@bitbucket.org:mraadmin/site-frontend.git  apps/web

set -euo pipefail

ACTION="${1:-}"
TARGET="${2:-all}"
SITES_CONF="/apps/scripts/sites.conf"

if [ -z "$ACTION" ]; then
  echo "Usage: ./manage.sh <start|stop|restart|status|pull|logs|health|verify|delete|update|save> [sitename|all]"
  exit 1
fi

# If Node comes from nvm or a non login shell, uncomment the next line
# source ~/.nvm/nvm.sh || true

exists_pm2_app() {
  local name="$1"
  pm2 describe "$name" >/dev/null 2>&1
}

pm2_id_of() {
  local name="$1"
  # returns the first id for the given name, or empty
  pm2 id "$name" 2>/dev/null | tr -cd '0-9 \n' | awk 'NF{print $1; exit}'
}

start_pm2_app() {
  local name="$1" dir="$2" port="$3"
  if exists_pm2_app "$name"; then
    PORT="$port" SITE_PORT="$port" pm2 restart "$name" --update-env
  else
    PORT="$port" SITE_PORT="$port" pm2 start npm --name "$name" --cwd "$dir" --update-env -- start
  fi
}

restart_pm2_app() {
  local name="$1" dir="$2" port="$3"
  PORT="$port" SITE_PORT="$port" pm2 restart "$name" --update-env || \
  PORT="$port" SITE_PORT="$port" pm2 start npm --name "$name" --cwd "$dir" --update-env -- start
}

pull_build() {
  local app_dir="$1" repo="$2" subdir="${3:-}"
  if [ ! -d "$app_dir/.git" ]; then
    mkdir -p "$app_dir"
    git clone "$repo" "$app_dir"
  fi
  local defb
  defb="$(git -C "$app_dir" remote show origin 2>/dev/null | awk '/HEAD branch/ {print $NF}' || true)"
  [ -z "${defb:-}" ] && defb="main"
  git -C "$app_dir" fetch --all --prune
  git -C "$app_dir" checkout "$defb" || git -C "$app_dir" checkout -B "$defb"
  git -C "$app_dir" reset --hard "origin/$defb" || true

  local src_dir="$app_dir"
  [ -n "$subdir" ] && src_dir="$app_dir/$subdir"
  mkdir -p "$src_dir"

  if [ -f "$src_dir/package.json" ]; then
    if [ -f "$src_dir/package-lock.json" ]; then
      npm --prefix "$src_dir" ci
    else
      npm --prefix "$src_dir" install
    fi
    npm --prefix "$src_dir" run build || true
  fi
}

logs_one() {
  local name="$1"
  pm2 logs "$name"
}

health_one() {
  local name="$1" expected_port="$2"
  local id pid envp listen http
  id="$(pm2_id_of "$name")"
  if [ -z "$id" ]; then
    echo "$name, expected=$expected_port, status=not-running"
    return
  fi
  envp="$(pm2 env "$id" 2>/dev/null | awk -F= '/^PORT=/{print $2}')"
  pid="$(pm2 pid "$id" 2>/dev/null || true)"
  listen="$(ss -lptnH 2>/dev/null | awk -v p="$pid" '$6 ~ ("pid=" p ",") {split($4,a,":"); print a[length(a)]}' | sort -un | paste -sd, -)"
  http="$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${expected_port}" || true)"
  echo "$name, expected=${expected_port}, env=${envp:-none}, listen=${listen:-none}, http=${http:-000}"
}

verify_one() {
  local name="$1" expected_port="$2"
  local id pid envp listen
  id="$(pm2_id_of "$name")"
  if [ -z "$id" ]; then
    echo "$name, expected=${expected_port}, status=not-running"
    return
  fi
  envp="$(pm2 env "$id" 2>/dev/null | awk -F= '/^PORT=/{print $2}')"
  pid="$(pm2 pid "$id" 2>/dev/null || true)"
  listen="$(ss -lptnH 2>/dev/null | awk -v p="$pid" '$6 ~ ("pid=" p ",") {split($4,a,":"); print a[length(a)]}' | sort -un | paste -sd, -)"
  echo "$name, expected=${expected_port}, env=${envp:-none}, listen=${listen:-none}"
}

case "$ACTION" in
  status)
    echo "---------------------------------------------"
    echo "PM2 status"
    echo "---------------------------------------------"
    pm2 list
    exit 0
    ;;
  update)
    pm2 update
    exit 0
    ;;
  save)
    pm2 save
    exit 0
    ;;
esac

while IFS=$' \t' read -r DOMAIN PORT REPO SUBDIR || [ -n "${DOMAIN:-}" ]; do
  [[ -z "${DOMAIN:-}" ]] && continue
  [[ "$DOMAIN" =~ ^# ]] && continue

  APP_NAME="$DOMAIN"
  APP_DIR="/apps/$DOMAIN"
  SRC_DIR="$APP_DIR"
  [ -n "${SUBDIR:-}" ] && SRC_DIR="$APP_DIR/$SUBDIR"

  if [ "$TARGET" != "all" ] && [ "$TARGET" != "$APP_NAME" ]; then
    continue
  fi

  echo "Processing ${APP_NAME} [${ACTION}], port ${PORT}, dir ${SRC_DIR}"

  case "$ACTION" in
    start)
      start_pm2_app "$APP_NAME" "$SRC_DIR" "$PORT"
      ;;
    stop)
      pm2 stop "$APP_NAME" || true
      ;;
    restart)
      restart_pm2_app "$APP_NAME" "$SRC_DIR" "$PORT"
      ;;
    pull)
      pull_build "$APP_DIR" "$REPO" "${SUBDIR:-}"
      restart_pm2_app "$APP_NAME" "$SRC_DIR" "$PORT"
      ;;
    logs)
      logs_one "$APP_NAME"
      ;;
    health)
      health_one "$APP_NAME" "$PORT"
      ;;
    verify)
      verify_one "$APP_NAME" "$PORT"
      ;;
    delete)
      pm2 delete "$APP_NAME" || true
      ;;
    *)
      echo "Invalid action, ${ACTION}"
      exit 1
      ;;
  esac
done < "$SITES_CONF"

pm2 save
