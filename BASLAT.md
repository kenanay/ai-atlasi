# 🚀 AI Atlası - Başlatma Kılavuzu

## Hızlı Başlatma

AI Atlası'nı başlatmak için **3 farklı yöntem** var. Hangisi size uygunsa onu kullanın!

---

## Yöntem 1: Otomatik Başlatma (Önerilen) ⭐

**Port yönetimi ve otomatik tarayıcı açma özellikli**

### macOS / Linux / Git Bash (Windows)

```bash
npm run launch
```

veya

```bash
node scripts/start.js
```

veya (Makefile ile)

```bash
make launch
```

### Windows (CMD / PowerShell)

```bash
npm run launch:win
```

veya

```bash
scripts\start.bat
```

### Özellikler
- ✅ **Port kontrolü**: Eğer port kullanımdaysa alternatif önerir
- ✅ **Otomatik tarayıcı**: Tarayıcıyı otomatik açar
- ✅ **Dependency kontrolü**: node_modules yoksa yükler
- ✅ **Temizlik seçeneği**: .next dizinini temizleme seçeneği
- ✅ **Network IP**: Diğer cihazlardan erişim için IP gösterir

---

## Yöntem 2: Basit Başlatma

**Sadece sunucuyu başlatır (Next.js varsayılan)**

```bash
npm run dev
```

veya

```bash
make dev
```

### Port Belirtme

```bash
PORT=3001 npm run dev
```

veya

```bash
make port PORT=3001
```

---

## Yöntem 3: Bash Script (macOS/Linux)

**Terminal özellikleri ile renkli çıktı**

```bash
npm run launch:bash
```

veya

```bash
bash scripts/start.sh
```

veya port ile

```bash
bash scripts/start.sh 3001
```

---

## 📋 Kullanım Senaryoları

### Senaryo 1: İlk Kez Başlatma

```bash
# 1. Proje klasörüne git
cd ai-atlasi

# 2. Bağımlılıkları yükle (sadece ilk seferinde)
npm install

# 3. Başlat
npm run launch
```

### Senaryo 2: Port 3000 Kullanımda

```bash
# Otomatik başlatma script'i çalıştır
npm run launch

# Script size seçenekler sunacak:
# 1) Alternatif port kullan (ör. 3001)
# 2) Manuel port gir
# 3) İptal
```

### Senaryo 3: Temiz Build

```bash
# Otomatik başlatma
npm run launch

# Script soracak: "Temiz build yapmak ister misiniz?"
# 'y' yazın - .next dizini temizlenecek
```

### Senaryo 4: Başka Cihazdan Erişim

```bash
# 1. Sunucuyu başlat
npm run launch

# 2. Terminal'de gösterilen Network IP'sini not et:
#    ➜ Network: http://192.168.1.100:3000

# 3. Aynı ağdaki başka bir cihazdan bu adrese girin
```

---

## 🛠️ Makefile Komutları

Makefile kullanıyorsanız daha kısa komutlar:

```bash
make help      # Tüm komutları göster
make launch    # Otomatik başlat
make dev       # Basit başlat
make build     # Production build
make clean     # Temizle
make install   # Bağımlılıkları yükle
make check     # Sistem kontrolü
make info      # Proje bilgileri
```

**Kısa alias'lar:**

```bash
make l    # launch
make d    # dev
make b    # build
make c    # clean
make i    # install
```

---

## 🔧 Port Yönetimi

### Port Değiştirme

#### Method 1: Script'e parametre
```bash
node scripts/start.js 3001
bash scripts/start.sh 3001
```

#### Method 2: Environment variable
```bash
PORT=3001 npm run dev
```

#### Method 3: Makefile
```bash
make port PORT=3001
```

### Port Kontrolü

Hangi port'un kullanımda olduğunu görmek için:

**macOS/Linux:**
```bash
lsof -i :3000
```

**Windows:**
```bash
netstat -ano | findstr :3000
```

### Port Temizleme

Eğer bir port takılı kaldıysa:

**macOS/Linux:**
```bash
# Port'u kullanan process'i bul
lsof -ti :3000

# Process'i durdur
kill -9 $(lsof -ti :3000)
```

**Windows:**
```bash
# Port'u kullanan PID'yi bul
netstat -ano | findstr :3000

# Process'i durdur (PID yerine gerçek numarayı yazın)
taskkill /PID <PID> /F
```

---

## 📱 Erişim Yöntemleri

Sunucu başladıktan sonra şu adreslerden erişebilirsiniz:

### Local Erişim
```
http://localhost:3000
```

### Network Erişim (Aynı Ağdaki Cihazlar)
```
http://192.168.1.xxx:3000
```
(Script otomatik olarak IP'nizi gösterir)

### Mobil Cihazdan Erişim
1. Bilgisayarınızın IP'sini öğrenin
2. Mobil cihazınızdan tarayıcıda bu IP'yi açın
3. Port numarasını eklemeyi unutmayın: `http://IP:3000`

---

## 🐛 Sorun Giderme

### Problem: "Port already in use"

**Çözüm 1:** Otomatik başlatma kullanın
```bash
npm run launch  # Size alternatif önerecek
```

**Çözüm 2:** Başka port kullanın
```bash
PORT=3001 npm run dev
```

**Çözüm 3:** Kullanılan port'u temizleyin (yukarı bakın)

---

### Problem: "Cannot find module"

**Çözüm:** Bağımlılıkları yeniden yükleyin
```bash
rm -rf node_modules
npm install
```

veya

```bash
make reinstall
```

---

### Problem: "Command not found: npm"

**Çözüm:** Node.js yüklü değil
1. https://nodejs.org adresinden Node.js indirin
2. Kurulumu yapın
3. Terminal'i yeniden açın
4. `node -v` ve `npm -v` ile kontrol edin

---

### Problem: Tarayıcı otomatik açılmıyor

**Normal!** Manuel olarak açın: `http://localhost:3000`

Veya tarayıcı komutu:
- **macOS:** `open http://localhost:3000`
- **Linux:** `xdg-open http://localhost:3000`
- **Windows:** `start http://localhost:3000`

---

### Problem: Hot reload çalışmıyor

**Çözüm 1:** Sayfayı manuel yenileyin (Ctrl+R / Cmd+R)

**Çözüm 2:** Sunucuyu durdurup yeniden başlatın
```bash
Ctrl+C  # Durdur
npm run launch  # Yeniden başlat
```

**Çözüm 3:** .next'i temizleyin
```bash
make clean
npm run launch
```

---

## 💡 İpuçları

### 1. Hızlı Başlatma
Terminal'inizde alias oluşturun:

**Bash/Zsh (~/.bashrc veya ~/.zshrc):**
```bash
alias ai-atlasi='cd ~/path/to/ai-atlasi && npm run launch'
```

Artık her yerden sadece `ai-atlasi` yazarak başlatabilirsiniz!

### 2. VS Code Task
`.vscode/tasks.json` dosyası oluşturun:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "AI Atlası Başlat",
      "type": "shell",
      "command": "npm run launch",
      "problemMatcher": [],
      "group": {
        "kind": "build",
        "isDefault": true
      }
    }
  ]
}
```

Sonra `Cmd+Shift+B` (macOS) veya `Ctrl+Shift+B` (Windows/Linux)

### 3. Desktop Kısayolu (macOS)

Automator ile uygulama oluşturun:
1. Automator açın
2. "Application" seçin
3. "Run Shell Script" ekleyin
4. Script: `cd /path/to/ai-atlasi && npm run launch`
5. Kaydedin ve Desktop'a koyun

---

## 📊 Performans İpuçları

### 1. Turbo Mode (Daha hızlı başlatma)
```bash
# .next'i sakla, temizleme
npm run dev
```

### 2. Production Mode (Optimize edilmiş)
```bash
npm run build
npm run start
```

### 3. Memory Limit (Düşük RAM için)
```bash
NODE_OPTIONS="--max-old-space-size=2048" npm run dev
```

---

## 🎯 Sonraki Adımlar

Sunucu başladıktan sonra:

1. ✅ Ana sayfayı keşfedin
2. ✅ "Vektörler" konusunu açın
3. ✅ Kod editörünü deneyin
4. ✅ Görselleştirmeleri inceleyin
5. ✅ Quiz çözün
6. ✅ Flashcard'larla tekrar yapın

---

## 📚 Ek Kaynaklar

- **README.md**: Proje hakkında genel bilgi
- **FEATURES.md**: Detaylı özellik listesi
- **KURULUM.md**: Kurulum ve kullanım kılavuzu
- **package.json**: npm komutları

---

**Kolay gelsin! 🚀**

Sorularınız için: GitHub Issues
