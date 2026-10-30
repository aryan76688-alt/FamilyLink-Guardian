#!/data/data/com.termux/files/usr/bin/bash
# ==============================================================================
# FamilyLink Guardian — Termux 1-Click Complete System Setup
# Deploys Full-Stack Family Safety Platform locally on Android via Termux
# ==============================================================================

set -e

# ANSI Color Codes
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "====================================================================="
echo "   🛡️  FamilyLink Guardian — 1-Click Termux Full System Setup"
echo "   Real-Time Background Family Safety & Device Management Platform"
echo "====================================================================="
echo -e "${NC}"

# Detect if running in Termux
if [ -z "$PREFIX" ] || [ ! -d "/data/data/com.termux" ]; then
    echo -e "${YELLOW}⚠️ Notice: This script is optimized for Android Termux ($PREFIX).${NC}"
    echo -e "${YELLOW}Proceeding with standard Linux environment adaptation...${NC}"
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PG_DATA="$PREFIX/var/lib/postgresql"

# Step 1: Install Dependencies
echo -e "${CYAN}[1/6] Installing necessary Termux packages...${NC}"
pkg update -y || apt update -y
pkg install -y nodejs-lts git postgresql procps curl jq || apt install -y nodejs git postgresql curl jq

# Step 2: Initialize & Configure PostgreSQL
echo -e "${CYAN}[2/6] Configuring PostgreSQL cluster in Termux...${NC}"
mkdir -p "$PREFIX/var/lib"
if [ ! -d "$PG_DATA" ] || [ -z "$(ls -A "$PG_DATA" 2>/dev/null)" ]; then
    echo -e "${YELLOW}Initializing new PostgreSQL data cluster at $PG_DATA...${NC}"
    initdb -D "$PG_DATA" --auth=trust --locale=C.UTF-8
fi

# Start PostgreSQL if not running
if ! pg_ctl -D "$PG_DATA" status >/dev/null 2>&1; then
    echo -e "${YELLOW}Starting PostgreSQL daemon...${NC}"
    pg_ctl -D "$PG_DATA" -l "$PREFIX/var/log/postgresql.log" start || true
    sleep 2
fi

# Ensure user and database exist
echo -e "${YELLOW}Setting up database & user credentials...${NC}"
psql -h localhost -U "$(whoami)" -d postgres -tc "SELECT 1 FROM pg_roles WHERE rolname='familylink'" | grep -q 1 || \
    psql -h localhost -U "$(whoami)" -d postgres -c "CREATE USER familylink WITH SUPERUSER PASSWORD 'familylink_password';" || true

psql -h localhost -U "$(whoami)" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname='familylink_db'" | grep -q 1 || \
    psql -h localhost -U "$(whoami)" -d postgres -c "CREATE DATABASE familylink_db OWNER familylink;" || true

# Step 3: Install & Configure Backend API
echo -e "${CYAN}[3/6] Installing and building NestJS API backend...${NC}"
cd "$ROOT_DIR/api"

# Configure .env
cat <<EOT > .env
DATABASE_URL="postgresql://familylink:familylink_password@localhost:5432/familylink_db?schema=public"
JWT_SECRET="familylink_termux_jwt_production_secret_key_2026"
PORT=3000
FRONTEND_URL="*"
GOOGLE_MAPS_API_KEY="AIzaSyADv-hBmMfj_GDU4ZDjvMq8wHPSV75IEo0"
EOT

npm install --production=false
npx prisma generate
npx prisma db push
npm run build

# Step 4: Install & Build Cloud Retention Worker
echo -e "${CYAN}[4/6] Installing background retention worker...${NC}"
cd "$ROOT_DIR/worker"
cat <<EOT > .env
DATABASE_URL="postgresql://familylink:familylink_password@localhost:5432/familylink_db?schema=public"
EOT
npm install --production=false
npm run build

# Step 5: Install & Build Next.js Web Dashboard
echo -e "${CYAN}[5/6] Building Next.js responsive web dashboard...${NC}"
cd "$ROOT_DIR/web"
cat <<EOT > .env
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyADv-hBmMfj_GDU4ZDjvMq8wHPSV75IEo0"
PORT=3002
EOT
npm install --production=false
npm run build

# Step 6: Create Termux Start & Stop Control Scripts
echo -e "${CYAN}[6/6] Generating Termux runtime controllers...${NC}"

# termux-start.sh
cat <<'STARTEOT' > "$ROOT_DIR/termux-start.sh"
#!/data/data/com.termux/files/usr/bin/bash
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PG_DATA="$PREFIX/var/lib/postgresql"

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}Starting FamilyLink Guardian System in Termux...${NC}"

# 1. PostgreSQL
if ! pg_ctl -D "$PG_DATA" status >/dev/null 2>&1; then
    echo "Starting PostgreSQL..."
    pg_ctl -D "$PG_DATA" -l "$PREFIX/var/log/postgresql.log" start
    sleep 2
fi

# 2. NestJS API
echo "Starting FamilyLink API on port 3000..."
cd "$ROOT_DIR/api"
nohup node dist/main.js > "$ROOT_DIR/api.log" 2>&1 &
echo $! > "$ROOT_DIR/.api.pid"

# 3. Retention Worker
echo "Starting Cloud Retention Worker..."
cd "$ROOT_DIR/worker"
nohup node dist/index.js > "$ROOT_DIR/worker.log" 2>&1 &
echo $! > "$ROOT_DIR/.worker.pid"

# 4. Web Dashboard
echo "Starting Next.js Web Dashboard on port 3002..."
cd "$ROOT_DIR/web"
nohup npm run start -- -H 0.0.0.0 -p 3002 > "$ROOT_DIR/web.log" 2>&1 &
echo $! > "$ROOT_DIR/.web.pid"

# 5. Lightweight APK Download Server
cd "$ROOT_DIR/web/public/downloads"
nohup python3 -m http.server 8088 --bind 0.0.0.0 > "$ROOT_DIR/downloads.log" 2>&1 &
echo $! > "$ROOT_DIR/.downloads.pid"

sleep 3

# Detect IP address
DEVICE_IP=$(ip route get 1.1.1.1 2>/dev/null | awk '{print $7}' || ifconfig 2>/dev/null | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -n1 || echo "localhost")

echo -e "${GREEN}=====================================================================${NC}"
echo -e "${GREEN}   ✅ FamilyLink Guardian Full Stack is LIVE in Termux!${NC}"
echo -e "${GREEN}=====================================================================${NC}"
echo -e "Web Dashboard:     ${CYAN}http://localhost:3002${NC} (or ${CYAN}http://${DEVICE_IP}:3002${NC})"
echo -e "Live Google Map:   ${CYAN}http://${DEVICE_IP}:3002/map${NC}"
echo -e "AI Safety Hub:     ${CYAN}http://${DEVICE_IP}:3002/ai${NC}"
echo -e "Backend API:       ${CYAN}http://localhost:3000/api${NC}"
echo -e ""
echo -e "📱 Direct APK Downloads:"
echo -e "  - Member APK:    ${YELLOW}http://${DEVICE_IP}:3002/downloads/member-debug.apk${NC}"
echo -e "  - Guardian APK:  ${YELLOW}http://${DEVICE_IP}:3002/downloads/guardian-debug.apk${NC}"
echo -e "====================================================================="
echo -e "To stop the system later, run: ${YELLOW}./termux-stop.sh${NC}"
STARTEOT

chmod +x "$ROOT_DIR/termux-start.sh"

# termux-stop.sh
cat <<'STOPEOT' > "$ROOT_DIR/termux-stop.sh"
#!/data/data/com.termux/files/usr/bin/bash
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PG_DATA="$PREFIX/var/lib/postgresql"

echo "Stopping FamilyLink Guardian services..."

[ -f "$ROOT_DIR/.api.pid" ] && kill -9 $(cat "$ROOT_DIR/.api.pid") 2>/dev/null && rm -f "$ROOT_DIR/.api.pid"
[ -f "$ROOT_DIR/.web.pid" ] && kill -9 $(cat "$ROOT_DIR/.web.pid") 2>/dev/null && rm -f "$ROOT_DIR/.web.pid"
[ -f "$ROOT_DIR/.worker.pid" ] && kill -9 $(cat "$ROOT_DIR/.worker.pid") 2>/dev/null && rm -f "$ROOT_DIR/.worker.pid"
[ -f "$ROOT_DIR/.downloads.pid" ] && kill -9 $(cat "$ROOT_DIR/.downloads.pid") 2>/dev/null && rm -f "$ROOT_DIR/.downloads.pid"

# Kill stray node processes on 3000 & 3002
pkill -f "node dist/main.js" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
pkill -f "python3 -m http.server 8088" 2>/dev/null || true

echo "FamilyLink Guardian services stopped successfully."
STOPEOT

chmod +x "$ROOT_DIR/termux-stop.sh"

echo -e "${GREEN}"
echo "====================================================================="
echo "   🎉 Termux Setup Complete in 1 Click!"
echo "   To launch all services now, execute:"
echo -e "   ${YELLOW}./termux-start.sh${GREEN}"
echo "====================================================================="
echo -e "${NC}"
