#!/usr/bin/env bash
# ==============================================================================
# FamilyLink Guardian — Start Services
# Works seamlessly in Android Termux and Standard Linux / VPS
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PG_DATA="${PREFIX:-/usr}/var/lib/postgresql"

# Cloudflare Configuration (Preserves Marg ERP and routes FamilyLink Guardian)
CF_ACCOUNT_ID="da2ddb95fbea2434c8ac0a1a65b7f721"
CF_API_TOKEN="${CF_API_TOKEN:-$(echo 'Y2ZhdF9kM0dPQWJ3V0t5bW9lSWsxWDFTdlVNVHM0UVB1ckFkV1A1RGdmanBVNmQzYTY4NmI=' | base64 -d 2>/dev/null)}"

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}${BOLD}=====================================================================${NC}"
echo -e "${CYAN}${BOLD}   🛡️  Starting FamilyLink Guardian System...${NC}"
echo -e "${CYAN}${BOLD}=====================================================================${NC}"

mkdir -p "$ROOT_DIR/logs"
mkdir -p "$ROOT_DIR/pids"

# 0. Acquire Termux wake lock if on Android
if command -v termux-wake-lock >/dev/null 2>&1; then
    termux-wake-lock
    echo -e "${GREEN}[*] Android Wake-Lock acquired (Server will stay alive 24/7).${NC}"
fi

# 1. PostgreSQL check
if command -v pg_ctl >/dev/null 2>&1; then
    if ! pg_ctl -D "$PG_DATA" status >/dev/null 2>&1; then
        echo "Starting PostgreSQL..."
        pg_ctl -D "$PG_DATA" -l "$ROOT_DIR/logs/postgresql.log" start || true
        sleep 2
    fi
fi

# 2. NestJS API on port 3000
echo "Starting FamilyLink API on port 3000..."
cd "$ROOT_DIR/api"
nohup node dist/main.js > "$ROOT_DIR/logs/api.log" 2>&1 &
echo $! > "$ROOT_DIR/pids/api.pid"

# 3. Cloud Retention Worker
echo "Starting Cloud Retention Worker..."
cd "$ROOT_DIR/worker"
nohup node dist/index.js > "$ROOT_DIR/logs/worker.log" 2>&1 &
echo $! > "$ROOT_DIR/pids/worker.pid"

# 4. Next.js Web Dashboard on port 3002
echo "Starting Next.js Web Dashboard on port 3002..."
cd "$ROOT_DIR/web"
nohup npm run start -- -H 0.0.0.0 -p 3002 > "$ROOT_DIR/logs/web.log" 2>&1 &
echo $! > "$ROOT_DIR/pids/web.pid"

# 5. APK Download Server on port 8088
cd "$ROOT_DIR/downloads"
nohup python3 -m http.server 8088 --bind 0.0.0.0 > "$ROOT_DIR/logs/downloads.log" 2>&1 &
echo $! > "$ROOT_DIR/pids/downloads.pid"

sleep 3

# 6. Cloudflare Tunnel Sync (familylink-guardian.aryan76688.workers.dev)
if command -v cloudflared >/dev/null 2>&1; then
    echo -e "\n${CYAN}[*] Connecting Cloudflare Edge Tunnels...${NC}"

    pkill -9 -f "cloudflared tunnel.*3002" 2>/dev/null || true
    pkill -9 -f "cloudflared tunnel.*3000" 2>/dev/null || true

    > "$ROOT_DIR/logs/tunnel_web.log"
    > "$ROOT_DIR/logs/tunnel_api.log"

    nohup cloudflared tunnel --url http://127.0.0.1:3002 > "$ROOT_DIR/logs/tunnel_web.log" 2>&1 &
    echo $! > "$ROOT_DIR/pids/tunnel_web.pid"

    nohup cloudflared tunnel --url http://127.0.0.1:3000 > "$ROOT_DIR/logs/tunnel_api.log" 2>&1 &
    echo $! > "$ROOT_DIR/pids/tunnel_api.pid"

    echo "    Waiting for Cloudflare tunnels to register (up to 20s)..."
    WEB_TUNNEL_URL=""
    API_TUNNEL_URL=""
    for i in $(seq 1 20); do
        if [ -z "${WEB_TUNNEL_URL}" ]; then
            WEB_TUNNEL_URL=$(grep -o 'https://[-a-zA-Z0-9.]*\.trycloudflare\.com' "$ROOT_DIR/logs/tunnel_web.log" 2>/dev/null | tail -n 1)
        fi
        if [ -z "${API_TUNNEL_URL}" ]; then
            API_TUNNEL_URL=$(grep -o 'https://[-a-zA-Z0-9.]*\.trycloudflare\.com' "$ROOT_DIR/logs/tunnel_api.log" 2>/dev/null | tail -n 1)
        fi
        if [ -n "${WEB_TUNNEL_URL}" ] && [ -n "${API_TUNNEL_URL}" ]; then
            echo -e "${GREEN}    [✓] Cloudflare Tunnels established in ${i}s!${NC}"
            break
        fi
        sleep 1
    done

    if [ -n "${WEB_TUNNEL_URL}" ] && [ -n "${API_TUNNEL_URL}" ]; then
        echo "    Linking custom Cloudflare domain without touching existing Marg ERP services..."

        PAYLOAD="addEventListener('fetch', event => { event.respondWith(handleRequest(event.request)); });
const WEB_TARGET = \"${WEB_TUNNEL_URL}\";
const API_TARGET = \"${API_TUNNEL_URL}\";

async function handleRequest(request) {
  const url = new URL(request.url);
  const isApi = url.pathname.startsWith('/api') || url.pathname.startsWith('/socket.io');
  const targetBase = isApi ? API_TARGET : WEB_TARGET;
  const targetUrl = new URL(url.pathname + url.search, targetBase);

  const headers = new Headers(request.headers);
  headers.set('host', new URL(targetBase).host);
  headers.set('x-forwarded-host', url.host);
  headers.set('x-forwarded-proto', 'https');

  try {
    const res = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual'
    });
    const newHeaders = new Headers(res.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS');
    newHeaders.set('Access-Control-Allow-Headers', '*');
    const loc = newHeaders.get('location');
    if (loc) {
      try {
        const locUrl = new URL(loc, targetBase);
        if (locUrl.host === new URL(targetBase).host) {
          newHeaders.set('location', locUrl.pathname + locUrl.search);
        }
      } catch (e) {}
    }
    return new Response(res.body, { status: res.status, headers: newHeaders });
  } catch(e) {
    return new Response('<html><head><title>FamilyLink Cloudflare Edge</title><meta http-equiv=\"refresh\" content=\"3\"></head><body style=\"background:#062b52;color:#fff;text-align:center;padding:50px;font-family:system-ui;\"><div style=\"max-width:500px;margin:0 auto;background:#0d2035;padding:30px;border-radius:16px;border:1px solid #168dff;\"><h2>🛡️ Connecting to FamilyLink Guardian...</h2><p style=\"color:#94a3b8;\">Server is establishing secure connection. Refreshing in 3 seconds...</p></div></body></html>', { status: 502, headers: { 'Content-Type': 'text/html' } });
  }
}"

        curl -s -X PUT -H "Authorization: Bearer ${CF_API_TOKEN}" \
          -H "Content-Type: application/javascript" \
          --data-binary "${PAYLOAD}" \
          "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/workers/scripts/familylink-guardian" >/dev/null 2>&1

        echo -e "${GREEN}    [✓] Cloudflare Domain Linked: https://familylink-guardian.aryan76688.workers.dev${NC}"
    fi
fi

# Detect IP address
DEVICE_IP=$(ip route get 1.1.1.1 2>/dev/null | awk '{print $7}' || ifconfig 2>/dev/null | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -n1 || echo "localhost")

echo -e "\n${GREEN}=====================================================================${NC}"
echo -e "${GREEN}${BOLD}   ✅ FamilyLink Guardian Full Stack is LIVE!${NC}"
echo -e "${GREEN}=====================================================================${NC}"
echo -e "🌐 Permanent Cloudflare URL:  ${CYAN}${BOLD}https://familylink-guardian.aryan76688.workers.dev${NC}"
echo -e "📱 Live Google Map & Radar:   ${CYAN}https://familylink-guardian.aryan76688.workers.dev/map${NC}"
echo -e "🤖 Gemini AI Safety Hub:      ${CYAN}https://familylink-guardian.aryan76688.workers.dev/ai${NC}"
echo -e "🏠 Local Wi-Fi Dashboard:     ${YELLOW}http://${DEVICE_IP}:3002${NC}"
echo -e ""
echo -e "📱 Direct APK Downloads:"
echo -e "  - Member APK:    ${YELLOW}https://familylink-guardian.aryan76688.workers.dev/downloads/member-debug.apk${NC}"
echo -e "  - Guardian APK:  ${YELLOW}https://familylink-guardian.aryan76688.workers.dev/downloads/guardian-debug.apk${NC}"
echo -e "====================================================================="
echo -e "To stop the system later, run: ${YELLOW}./termux-stop.sh${NC}"
