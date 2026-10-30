#!/usr/bin/env bash
# ==============================================================================
# FamilyLink Guardian — Stop Services
# Safely stops FamilyLink processes without touching any other services (e.g. Marg ERP)
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Stopping FamilyLink Guardian services..."

[ -f "$ROOT_DIR/pids/api.pid" ] && kill -9 $(cat "$ROOT_DIR/pids/api.pid") 2>/dev/null && rm -f "$ROOT_DIR/pids/api.pid"
[ -f "$ROOT_DIR/pids/web.pid" ] && kill -9 $(cat "$ROOT_DIR/pids/web.pid") 2>/dev/null && rm -f "$ROOT_DIR/pids/web.pid"
[ -f "$ROOT_DIR/pids/worker.pid" ] && kill -9 $(cat "$ROOT_DIR/pids/worker.pid") 2>/dev/null && rm -f "$ROOT_DIR/pids/worker.pid"
[ -f "$ROOT_DIR/pids/downloads.pid" ] && kill -9 $(cat "$ROOT_DIR/pids/downloads.pid") 2>/dev/null && rm -f "$ROOT_DIR/pids/downloads.pid"
[ -f "$ROOT_DIR/pids/tunnel_web.pid" ] && kill -9 $(cat "$ROOT_DIR/pids/tunnel_web.pid") 2>/dev/null && rm -f "$ROOT_DIR/pids/tunnel_web.pid"
[ -f "$ROOT_DIR/pids/tunnel_api.pid" ] && kill -9 $(cat "$ROOT_DIR/pids/tunnel_api.pid") 2>/dev/null && rm -f "$ROOT_DIR/pids/tunnel_api.pid"

# Kill FamilyLink-specific processes only
pkill -f "node dist/main.js" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
pkill -f "cloudflared tunnel.*3002" 2>/dev/null || true
pkill -f "cloudflared tunnel.*3000" 2>/dev/null || true

echo "FamilyLink Guardian services stopped successfully. (Existing Marg ERP services remain untouched)."
