# 🚀 Otomatik Başlatma Sistemi

## Genel Bakış

AI Atlası için **3 farklı platform** ve **3 farklı yöntem** ile otomatik başlatma sistemi oluşturuldu.

---

## 📁 Dosyalar

### 1. `scripts/start.js` (Node.js) ⭐ **ÖNERILEN**
- **Platform:** Tüm platformlar (Windows, macOS, Linux)
- **Dil:** JavaScript (Node.js)
- **Özellikler:**
  - ✅ Platform bağımsız
  - ✅ Port kontrolü ve alternatif port önerisi
  - ✅ Port çakışmasında kullanıcı seçeneği
  - ✅ Otomatik tarayıcı açma
  - ✅ Network IP gösterimi
  - ✅ node_modules kontrolü ve otomatik yükleme
  - ✅ .next temizleme seçeneği
  - ✅ Renkli ve kullanıcı dostu çıktı
  - ✅ Graceful shutdown (Ctrl+C)

**Kullanım:**
```bash
npm run launch
# veya
node scripts/start.js
# veya port ile
node scripts/start.js 3001
```

---

### 2. `scripts/start.sh` (Bash)
- **Platform:** macOS, Linux, Git Bash (Windows)
- **Dil:** Bash Script
- **Özellikler:**
  - ✅ Port kontrolü (lsof ile)
  - ✅ Port çakışmasında process bilgisi
  - ✅ Kullanıcı interaktif menü
  - ✅ Manuel port girişi
  - ✅ Port temizleme seçeneği
  - ✅ Network IP gösterimi
  - ✅ Otomatik tarayıcı açma
  - ✅ ASCII Art banner
  - ✅ Renkli terminal çıktısı

**Kullanım:**
```bash
npm run launch:bash
# veya
bash scripts/start.sh
# veya port ile
bash scripts/start.sh 3001
```

---

### 3. `scripts/start.bat` (Windows Batch)
- **Platform:** Windows (CMD, PowerShell)
- **Dil:** Batch Script
- **Özellikler:**
  - ✅ Port kontrolü (netstat ile)
  - ✅ Port çakışmasında alternatif port
  - ✅ Otomatik tarayıcı açma
  - ✅ .next temizleme seçeneği
  - ✅ Windows native komutları

**Kullanım:**
```bash
npm run launch:win
# veya
scripts\start.bat
# veya port ile
scripts\start.bat 3001
```

---

## 🎯 Port Yönetimi Özellikleri

### Senaryolar

#### Senaryo 1: Port Boş
```
✓ Port 3000 kullanılabilir
→ Sunucu başlatılıyor...
→ Tarayıcı otomatik açılıyor
```

#### Senaryo 2: Port Kullanımda
```
⚠️ Port 3000 zaten kullanımda!
   Kullanan: PID 12345 (node)

Ne yapmak istersiniz?
  1) Alternatif port kullan (3001)
  2) Mevcut süreci durdur
  3) Manuel port gir
  4) İptal

Seçim: _
```

#### Senaryo 3: Otomatik Port Bulma
```
⚠️ Port 3000 kullanımda
🔍 Alternatif port aranıyor...
✓ Port 3001 kullanılacak
```

---

## 🛠️ Teknik Detaylar

### Port Kontrolü

**Node.js (start.js):**
```javascript
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      resolve(err.code !== 'EADDRINUSE');
    });
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}
```

**Bash (start.sh):**
```bash
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0  # Port kullanımda
    else
        return 1  # Port boş
    fi
}
```

**Batch (start.bat):**
```batch
netstat -ano | findstr ":%PORT%" >nul 2>&1
if %errorlevel% equ 0 (
    echo Port kulanimda!
)
```

### Tarayıcı Açma

**Platform Detection:**
```javascript
const isWindows = os.platform() === 'win32';
const isMac = os.platform() === 'darwin';
const isLinux = os.platform() === 'linux';

if (isWindows) command = `start ${url}`;
else if (isMac) command = `open ${url}`;
else if (isLinux) command = `xdg-open ${url}`;
```

### Network IP Bulma

```javascript
function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}
```

---

## 📦 npm Scripts

**package.json'a eklenen komutlar:**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "launch": "node scripts/start.js",
    "launch:bash": "bash scripts/start.sh",
    "launch:win": "scripts\\start.bat"
  }
}
```

---

## 🎨 Makefile Entegrasyonu

**Kullanılabilir komutlar:**

```makefile
make launch        # Otomatik başlatma (Node.js)
make launch-bash   # Bash script ile
make dev           # Basit başlatma
make port PORT=3001 # Belirli port
make help          # Yardım
make info          # Proje bilgileri
make check         # Sistem kontrolü
```

**Kısa alias'lar:**
```makefile
make l    # launch
make d    # dev
make b    # build
make c    # clean
```

---

## 🔧 Kullanıcı Deneyimi

### Başlatma Akışı

```
1. Script çalıştırılır
   ↓
2. Banner gösterilir
   ↓
3. Node.js ve npm kontrol edilir
   ↓
4. Port kontrol edilir
   ├─ Boş → 7'ye geç
   └─ Dolu → 5'e geç
   ↓
5. Port çakışması menüsü gösterilir
   ├─ Alternatif port
   ├─ Manuel port
   ├─ Process durdur
   └─ İptal
   ↓
6. Port belirlenir
   ↓
7. node_modules kontrolü
   ├─ Var → 9'a geç
   └─ Yok → 8'e geç
   ↓
8. npm install çalıştırılır
   ↓
9. .next temizlik seçeneği
   ↓
10. Sunucu başlatılır
    ↓
11. Tarayıcı otomatik açılır
    ↓
12. Hot reload aktif
```

---

## 🎯 Avantajlar

### 1. Port Yönetimi
- Otomatik çakışma tespiti
- Alternatif port önerisi
- Manuel port girişi
- Process bilgisi gösterimi

### 2. Kullanıcı Deneyimi
- Renkli ve net çıktı
- İnteraktif menüler
- Otomatik tarayıcı
- Network erişim bilgisi

### 3. Hata Yönetimi
- Dependency kontrol
- Node.js version kontrol
- Port validation
- Graceful error handling

### 4. Platform Desteği
- Windows (Batch)
- macOS (Bash)
- Linux (Bash)
- Cross-platform (Node.js)

---

## 📝 Örnekler

### Örnek 1: İlk Başlatma
```bash
$ npm run launch

╔═══════════════════════════════════════╗
║         🚀 AI ATLASI 🚀              ║
║   Yapay Zeka Öğrenme Laboratuvarı   ║
╚═══════════════════════════════════════╝

🚀 AI Atlası başlatılıyor...

✓ Node.js v20.11.0 kullanılıyor
✓ npm 10.2.4 kullanılıyor

📦 Bağımlılıklar yükleniyor...
✓ Bağımlılıklar yüklendi

═══════════════════════════════════════
🚀 Geliştirme sunucusu başlatılıyor...
═══════════════════════════════════════

📍 Sunucu Adresleri:
   ➜ Local:   http://localhost:3000
   ➜ Network: http://192.168.1.100:3000

💡 İpuçları:
   • Tarayıcınızda otomatik açılacak
   • Durdurmak için: Ctrl+C
   • Hot reload aktif

═══════════════════════════════════════

▲ Next.js 16.3.5 (Turbopack)
- Local:   http://localhost:3000
✓ Ready in 1.2s
```

### Örnek 2: Port Çakışması
```bash
$ npm run launch

⚠️ Port 3000 zaten kullanımda!
   Kullanan: PID 45678

Ne yapmak istersiniz?
  1) Alternatif port kullan (otomatik bul)
  2) Mevcut süreci durdur ve bu portu kullan
  3) Manuel port gir
  4) İptal

Seçiminiz (1-4): 1
✓ Port 3001 kullanılacak

🚀 Geliştirme sunucusu başlatılıyor...
```

---

## 🔮 Gelecek Geliştirmeler

### Potansiyel Özellikler
- [ ] Config dosyası (.ai-atlasi.config.js)
- [ ] Port favorileri kaydetme
- [ ] Çoklu instance yönetimi
- [ ] Docker desteği
- [ ] PM2 entegrasyonu
- [ ] Sistemd service dosyası
- [ ] Auto-update kontrolü
- [ ] Crash recovery

---

## 📚 Referanslar

### Kullanılan Teknolojiler
- Node.js `net` modülü (port kontrolü)
- Node.js `child_process` (process yönetimi)
- Node.js `os` modülü (platform detection)
- Bash `lsof` (port kontrolü)
- Bash `netstat` (Windows port kontrolü)

### İlham Kaynakları
- Next.js CLI
- Create React App
- Vue CLI
- Angular CLI

---

**Hazırlayan:** AI Atlası Development Team  
**Tarih:** 2025  
**Versiyon:** 1.0.0-beta

---

## 🎉 Sonuç

Artık AI Atlası'nı **tek komutla** başlatabilirsiniz:

```bash
npm run launch
```

Port çakışması, dependency eksikliği veya platform farklılıkları gibi sorunlar **otomatik olarak çözülür**.

**Kolay gelsin! 🚀**
