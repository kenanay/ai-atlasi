#!/bin/bash

# AI Atlası Otomatik Başlatma Script'i
# Port yönetimi ve otomatik açılma özellikli

set -e

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${CYAN}"
cat << "EOF"
   ___   ____    ___  __  __           _ 
  / _ \ |_  /   / _ \| |_| |__ _ _____(_)
 / /_\ \ / /   / /_\ \  _| / _` (_-< | |
/  ___/ /___  /__/ |_|\__|_\__,_/__/ |_|
        
Yapay Zeka Öğrenme ve Deney Laboratuvarı
EOF
echo -e "${NC}"

# Varsayılan port
DEFAULT_PORT=3000
PORT=${1:-$DEFAULT_PORT}

echo -e "${BLUE}🚀 AI Atlası Başlatılıyor...${NC}"
echo ""

# Port kontrolü fonksiyonu
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0  # Port kullanımda
    else
        return 1  # Port boş
    fi
}

# Port bulma fonksiyonu
find_available_port() {
    local start_port=$1
    local max_attempts=10
    local current_port=$start_port
    
    for ((i=0; i<$max_attempts; i++)); do
        if ! check_port $current_port; then
            echo $current_port
            return 0
        fi
        current_port=$((current_port + 1))
    done
    
    return 1
}

# Port kontrolü
if check_port $PORT; then
    echo -e "${YELLOW}⚠️  Port $PORT zaten kullanımda!${NC}"
    echo -e "${YELLOW}🔍 Alternatif port aranıyor...${NC}"
    
    # Kullanılan port bilgisini göster
    PID=$(lsof -ti:$PORT)
    PROCESS=$(ps -p $PID -o comm= 2>/dev/null || echo "bilinmeyen")
    echo -e "${YELLOW}   Port $PORT'u kullanan: PID $PID ($PROCESS)${NC}"
    echo ""
    
    # Kullanıcıya seçenek sun
    echo -e "${CYAN}Ne yapmak istersiniz?${NC}"
    echo "  1) Alternatif port kullan (otomatik bul)"
    echo "  2) Mevcut süreci durdur ve bu portu kullan"
    echo "  3) Manuel port gir"
    echo "  4) İptal"
    echo ""
    
    read -p "Seçiminiz (1-4): " choice
    
    case $choice in
        1)
            NEW_PORT=$(find_available_port $PORT)
            if [ $? -eq 0 ]; then
                PORT=$NEW_PORT
                echo -e "${GREEN}✓ Port $PORT kullanılacak${NC}"
            else
                echo -e "${RED}✗ Boş port bulunamadı!${NC}"
                exit 1
            fi
            ;;
        2)
            echo -e "${YELLOW}⚠️  Port $PORT'taki süreç durduruluyor...${NC}"
            kill -9 $PID 2>/dev/null || {
                echo -e "${RED}✗ Süreç durdurulamadı! Yetki gerekebilir.${NC}"
                exit 1
            }
            sleep 1
            echo -e "${GREEN}✓ Süreç durduruldu${NC}"
            ;;
        3)
            read -p "Port numarası girin: " PORT
            if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [ "$PORT" -lt 1024 ] || [ "$PORT" -gt 65535 ]; then
                echo -e "${RED}✗ Geçersiz port numarası!${NC}"
                exit 1
            fi
            ;;
        4)
            echo -e "${YELLOW}İptal edildi.${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}✗ Geçersiz seçim!${NC}"
            exit 1
            ;;
    esac
    echo ""
fi

# Node.js kontrolü
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js bulunamadı!${NC}"
    echo -e "${YELLOW}  Node.js kurulumu için: https://nodejs.org/${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION} bulundu${NC}"

# npm kontrolü
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm bulunamadı!${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm ${NPM_VERSION} bulundu${NC}"
echo ""

# Bağımlılık kontrolü
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Bağımlılıklar yükleniyor...${NC}"
    npm install
    echo -e "${GREEN}✓ Bağımlılıklar yüklendi${NC}"
    echo ""
fi

# .next dizini kontrolü ve temizlik seçeneği
if [ -d ".next" ]; then
    echo -e "${YELLOW}🧹 .next dizini mevcut${NC}"
    read -p "Temiz build yapmak ister misiniz? (y/N): " clean_build
    if [[ $clean_build =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🧹 .next dizini temizleniyor...${NC}"
        rm -rf .next
        echo -e "${GREEN}✓ Temizlendi${NC}"
    fi
    echo ""
fi

# Geliştirme sunucusunu başlat
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🚀 Geliştirme sunucusu başlatılıyor...${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}📍 Sunucu Adresleri:${NC}"
echo -e "${GREEN}   ➜ Local:   ${NC}http://localhost:$PORT"
echo -e "${GREEN}   ➜ Network: ${NC}http://$(ipconfig getifaddr en0 || hostname -I | awk '{print $1}'):$PORT"
echo ""
echo -e "${YELLOW}💡 İpuçları:${NC}"
echo -e "   • Tarayıcınızda otomatik açılacak"
echo -e "   • Durdurmak için: Ctrl+C"
echo -e "   • Kodu değiştirin, otomatik yenilenir (hot reload)"
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Tarayıcıyı otomatik aç (macOS)
open_browser() {
    local url=$1
    sleep 2  # Sunucunun başlaması için bekle
    
    if command -v open &> /dev/null; then
        # macOS
        open "$url" 2>/dev/null
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "$url" 2>/dev/null
    elif command -v start &> /dev/null; then
        # Windows (Git Bash)
        start "$url" 2>/dev/null
    fi
}

# Arka planda tarayıcıyı aç
(open_browser "http://localhost:$PORT") &

# Next.js dev sunucusunu başlat
PORT=$PORT npm run dev

# Temizlik (Ctrl+C ile çıkıldığında)
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Sunucu durduruluyor...${NC}"
    echo -e "${GREEN}✓ Güle güle!${NC}"
    exit 0
}

trap cleanup INT TERM
