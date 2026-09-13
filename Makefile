# AI Atlası Makefile
# Hızlı komutlar için

.PHONY: help install dev build start launch clean test

# Varsayılan hedef
.DEFAULT_GOAL := help

help: ## Kullanılabilir komutları göster
	@echo "╔═══════════════════════════════════════════════════════╗"
	@echo "║              AI ATLASI - KOMUTLAR                    ║"
	@echo "╚═══════════════════════════════════════════════════════╝"
	@echo ""
	@echo "Kullanım: make [komut]"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""

install: ## Bağımlılıkları yükle
	@echo "📦 Bağımlılıklar yükleniyor..."
	npm install
	@echo "✓ Tamamlandı!"

dev: ## Geliştirme sunucusunu başlat (basit)
	@echo "🚀 Geliştirme sunucusu başlatılıyor..."
	npm run dev

launch: ## Otomatik başlatma (port yönetimi ile)
	@echo "🚀 AI Atlası başlatılıyor..."
	npm run launch

launch-bash: ## Bash script ile başlat (macOS/Linux)
	@echo "🚀 AI Atlası başlatılıyor (Bash)..."
	npm run launch:bash

launch-win: ## Windows batch ile başlat
	@echo "🚀 AI Atlası başlatılıyor (Windows)..."
	npm run launch:win

build: ## Production build oluştur
	@echo "🏗️  Production build oluşturuluyor..."
	npm run build
	@echo "✓ Build tamamlandı!"

start: ## Production sunucusunu başlat
	@echo "🚀 Production sunucusu başlatılıyor..."
	npm run start

clean: ## Geçici dosyaları temizle
	@echo "🧹 Temizleniyor..."
	rm -rf .next
	rm -rf node_modules/.cache
	@echo "✓ Temizlendi!"

clean-all: ## Tüm oluşturulmuş dosyaları temizle
	@echo "🧹 Tüm dosyalar temizleniyor..."
	rm -rf .next
	rm -rf node_modules
	rm -rf out
	@echo "✓ Tamamen temizlendi!"

reinstall: clean-all install ## Yeniden yükle (temizle + yükle)
	@echo "✓ Yeniden yükleme tamamlandı!"

update: ## Bağımlılıkları güncelle
	@echo "📦 Bağımlılıklar güncelleniyor..."
	npm update
	@echo "✓ Güncellendi!"

check: ## Sistem kontrolü yap
	@echo "🔍 Sistem kontrol ediliyor..."
	@echo ""
	@echo "Node.js:"
	@node --version || echo "  ✗ Node.js bulunamadı!"
	@echo ""
	@echo "npm:"
	@npm --version || echo "  ✗ npm bulunamadı!"
	@echo ""
	@echo "Proje:"
	@if [ -d "node_modules" ]; then echo "  ✓ node_modules mevcut"; else echo "  ✗ node_modules yok (make install çalıştırın)"; fi
	@if [ -f "package.json" ]; then echo "  ✓ package.json mevcut"; else echo "  ✗ package.json bulunamadı!"; fi
	@echo ""

info: ## Proje bilgilerini göster
	@echo "╔═══════════════════════════════════════════════════════╗"
	@echo "║              AI ATLASI - BİLGİLER                    ║"
	@echo "╚═══════════════════════════════════════════════════════╝"
	@echo ""
	@echo "Proje: AI Atlası"
	@echo "Açıklama: Yapay Zeka Öğrenme ve Deney Laboratuvarı"
	@echo "Versiyon: 1.0.0-beta"
	@echo ""
	@echo "Teknolojiler:"
	@echo "  • Next.js 15 (App Router)"
	@echo "  • React 19"
	@echo "  • TypeScript"
	@echo "  • Tailwind CSS"
	@echo "  • KaTeX (LaTeX render)"
	@echo "  • Monaco Editor (VS Code)"
	@echo "  • Plotly.js (Görselleştirme)"
	@echo ""
	@echo "Özellikler:"
	@echo "  • 5 seviyeli öğrenme sistemi"
	@echo "  • İnteraktif kod editörü"
	@echo "  • Matematik görselleştirmeleri"
	@echo "  • Quiz ve Flashcard sistemi"
	@echo "  • İlerleme takibi (LocalStorage)"
	@echo ""
	@echo "Komutlar:"
	@echo "  make launch  - Otomatik başlatma"
	@echo "  make dev     - Basit başlatma"
	@echo "  make build   - Production build"
	@echo ""

port: ## Belirli bir portta başlat (Kullanım: make port PORT=3001)
	@echo "🚀 Port $(or $(PORT),3000) üzerinde başlatılıyor..."
	@PORT=$(or $(PORT),3000) npm run dev

# Kısa komutlar (alias'lar)
i: install ## install kısayolu
d: dev ## dev kısayolu
l: launch ## launch kısayolu
b: build ## build kısayolu
s: start ## start kısayolu
c: clean ## clean kısayolu
