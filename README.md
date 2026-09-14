# AI Atlası - Yapay Zeka Öğrenme ve Deney Laboratuvarı

**AI Atlası**, matematikten donanıma, algoritmalardan büyük dil modellerine kadar yapay zeka alanını seviye seviye öğrenmenizi sağlayan interaktif bir öğrenme platformudur.

**Geliştiren & Düzenleyen:** Kenan AY

## 🎯 Özellikler

### ✅ Mevcut Özellikler

#### 🎓 Öğrenme Sistemi
- **5 Seviyeli İçerik Yapısı**
  - Seviye 0: Temel - Günlük dille açıklama
  - Seviye 1: Başlangıç - Temel kavramlar
  - Seviye 2: Uygulama - Python ve kütüphane kodları
  - Seviye 3: İleri - Matematiksel türetimler
  - Seviye 4: Uzman - Mimari, performans, üretim

- **71 Kapsamlı Konu** → **75 Kapsamlı Konu** ✅
  - Matematik Altyapısı (Vektörler, Matrisler, Türev, Gradient Descent, Özdeğer/Özvektör, **SVD**)
  - Makine Öğrenmesi (Regresyon, Sınıflandırma, **XGBoost & Boosting**, Kümeleme, PCA, **t-SNE/UMAP**)
  - Derin Öğrenme (CNN, RNN, Transformer, Attention)
  - Büyük Dil Modelleri (LLM, BERT, GPT, Prompt Engineering, **RAG & Vektör DB**, **AI Agents**, **LoRA/QLoRA**, **RLHF/DPO**)
  - Model Optimizasyonu ve Sistem Altyapısı

#### 🎮 İnteraktif Özellikler (Sprint 2 & 3 - YENİ!)
- **Gradient Descent Simülatörü** 🎢
  - 3 farklı fonksiyon tipi (quadratic, cubic, Rastrigin)
  - İnteraktif parametreler (learning rate, başlangıç noktası, animasyon hızı)
  - Adım adım mod ve real-time istatistikler

- **PCA Projeksiyon Visualizer** 📊 **(YENİ - Sprint 3!)**
  - 3D orijinal veri + 2D/1D projeksiyon
  - Explained variance gösterimi
  - Interactive component selection
  
- **K-Means Clustering Animator** 🎯 **(YENİ - Sprint 3!)**
  - Step-by-step centroid hareketi
  - Assignment/update phase animasyonu
  - Convergence detection
  
- **Python Kod Çalıştırma** 💻
  - Pyodide ile tarayıcıda Python execution
  - NumPy, Pandas desteği
  - Syntax highlighting ve code completion
  - Ctrl+Enter ile çalıştırma
  - **Executable code blocks in topics** **(YENİ - Sprint 3!)**

- **Badge Toast Notifications** 🎉 **(YENİ - Sprint 3!)**
  - Animasyonlu rozet unlock bildirimleri
  - Gradient border + progress bar
  - 5s auto-dismiss with stagger
  
- **Rozet Sistemi** 🏆
  - 26 farklı rozet (tamamlama, streak, ustalık, özel)
  - 4 rarity seviyesi (common, rare, epic, legendary)
  - Otomatik unlock sistemi
  - İlerleme entegrasyonu

- **Klavye Kısayolları** ⌨️
  - Global navigasyon (H, T, A, B, C)
  - Arama (Ctrl+K), Ayarlar (Ctrl+,)
  - Dark mode toggle (Ctrl+D)
  - Kısayollar modal (?)

#### 🎨 Kullanıcı Deneyimi
- **🌗 Dark Mode**
  - Açık / Koyu / Sistem teması
  - WCAG AA contrast standartları
  - Smooth geçişler
  
- **📊 Analitik Dashboard**
  - Genel istatistikler (tamamlanan, devam eden, süre)
  - Kategori ve seviye analizi
  - 7 günlük aktivite grafiği
  - Top kategoriler ve quiz istatistikleri

- **Quiz ve Flashcard Sistemi**
  - Çoktan seçmeli quiz'ler
  - 3D flip animasyonlu flashcard'lar
  - Spaced repetition tracking
  - Keyboard navigasyon

#### 🛠️ Teknik Özellikler
- **Üç Kolonlu Layout**
  - Sol: Konu ağacı, önkoşullar, seviye seçici
  - Orta: Markdown içerik, LaTeX formüller
  - Sağ: Kod örnekleri, görselleştirmeler

- **İlerleme Takibi**
  - LocalStorage (tamamen offline)
  - Seviye bazlı tamamlama
  - Süre takibi ve bookmark
  - Import/Export desteği

- **Görselleştirmeler**
  - Plotly.js ile interaktif grafikler
  - Vektör, matris, gradient descent plotları
  - Real-time animasyonlar

### 🚧 Yakında (Sprint 3+)

- [ ] **5 Yeni Kritik Konu:**
  - RAG & Vektör Veritabanları
  - AI Agents & Tool Calling  
  - PEFT: LoRA & QLoRA
  - XGBoost & Gradient Boosting
  - Özdeğer/Özvektör & SVD

- [ ] Daha fazla interaktif simülasyon
- [ ] LLM inference optimizasyonu konuları
- [ ] PWA desteği
- [ ] Çoklu dil desteği

## 🚀 Başlangıç

### Gereksinimler

- Node.js 18+ 
- npm veya yarn

### Kurulum

```bash
cd ai-atlasi
npm install
```

### Başlatma Seçenekleri

#### 1. Otomatik Başlatma (Önerilen) ⭐
Port yönetimi ve otomatik tarayıcı açma ile:

```bash
npm run launch
```

**Özellikler:**
- Port kontrolü (kullanımdaysa alternatif önerir)
- Otomatik tarayıcı açma
- Network IP gösterimi
- Temizlik seçenekleri

#### 2. Basit Başlatma

```bash
npm run dev
```

#### 3. Makefile ile (macOS/Linux)

```bash
make launch    # Otomatik başlatma
make dev       # Basit başlatma
make help      # Tüm komutlar
```

**Detaylı başlatma kılavuzu için:** [BASLAT.md](BASLAT.md)

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

### Production Build

```bash
npm run build
npm start
```

## 📁 Proje Yapısı

```
ai-atlasi/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Ana sayfa
│   ├── topics/              # Konular listesi
│   ├── topic/[id]/          # Konu detay sayfası
│   ├── analytics/           # Analitik dashboard
│   ├── badges/              # Rozet sistemi
│   ├── code-lab/            # Python kod laboratuvarı
│   ├── search/              # Arama sayfası
│   └── settings/            # Ayarlar
├── components/
│   ├── ui/                  # Temel UI (Button, Card, Badge, CodeExecutor)
│   ├── layout/              # Layout (Header, Sidebar, KeyboardShortcuts)
│   ├── theme/               # Theme (ThemeProvider, ThemeToggle)
│   ├── topic/               # Konu özel (TopicContent, NotesPanel, Quiz)
│   ├── quiz/                # Quiz & Flashcard bileşenleri
│   └── visualization/       # İnteraktif görselleştirmeler
├── data/
│   └── topics/              # 67 konu JSON dosyası
├── lib/
│   ├── topics.ts            # Konu yönetimi
│   ├── progress.ts          # İlerleme tracking
│   ├── badges.ts            # Rozet sistemi
│   └── utils.ts             # Yardımcı fonksiyonlar
├── hooks/
│   └── useKeyboardShortcuts.ts  # Klavye kısayolları
└── types/
    └── index.ts             # TypeScript tipleri
```

## 🎨 Teknoloji Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Math:** KaTeX (LaTeX formüller)
- **Code Editor:** Monaco Editor + Prism.js
- **Visualization:** Plotly.js (interaktif grafikler)
- **Python Runtime:** Pyodide (WASM)
- **State:** LocalStorage + React Hooks
- **Build:** Turbopack

## 📚 Konu İçerik Yapısı

### Kategoriler
- **Matematik** (Vektör, Matris, Türev, Gradient Descent, PCA, Özdeğer/SVD)
- **Makine Öğrenmesi** (Regresyon, SVM, Decision Trees, XGBoost, Kümeleme)
- **Derin Öğrenme** (CNN, RNN, LSTM, Attention, Transformer)
- **LLM & NLP** (Word Embeddings, BERT, GPT, RAG, Agents, Fine-tuning)
- **Computer Vision** (Image Processing, Object Detection, Segmentation)
- **Reinforcement Learning** (Q-Learning, Policy Gradients, PPO)
- **Sistem & Altyapı** (GPU, Distributed Training, MLOps, Deployment)

### Yeni Eklenen Kritik Konular
1. **Özdeğer ve Özvektörler** - PCA, spektral kümeleme temeli
2. **SVD** - Low-rank approximation, LoRA temeli  
3. **XGBoost & Gradient Boosting** - Tabular data'da #1 algoritma
4. **RAG & Vektör DB** - LLM + kurumsal veri entegrasyonu
5. **AI Agents** - Tool calling, ReAct, multi-agent workflows

## 📚 Konu Ekleme

Yeni bir konu eklemek için `data/topics/` klasörüne JSON dosyası ekleyin:

```json
{
  "id": "konu-id",
  "title": "Konu Başlığı",
  "category": "kategori",
  "level": 2,
  "estimatedTime": 60,
  "content": {
    "level0_basic": "Temel açıklama...",
    "level1_beginner": "Başlangıç açıklama...",
    "level2_application": "Uygulama açıklama...",
    "level3_advanced": "İleri açıklama...",
    "level4_expert": "Uzman açıklama..."
  },
  "whatIsIt": "Bu nedir?",
  "whyNeeded": "Neden gerekli?",
  "realWorldAnalogy": "Günlük hayattan benzetme",
  "prerequisites": ["onkosul-konu-id"],
  "nextTopics": ["sonraki-konu-id"],
  "codeExamples": [],
  "quiz": [],
  "tags": []
}
```

Sonra `lib/topics.ts` dosyasında import edin.

## 🎨 Teknoloji Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Code Editor:** Monaco Editor (yakında)
- **Math:** KaTeX (yakında)
- **Visualization:** Plotly.js (yakında)

## 📝 Lisans

Bu proje Kenan AY tarafından geliştirilmiştir. Kişisel ve eğitim amaçlı kullanım içindir.

## 🤝 Katkıda Bulunma

Şu an kişisel bir projedir. Önerileriniz için issue açabilirsiniz.

## 📧 İletişim

Sorularınız için GitHub Issues kullanabilirsiniz.

---

**AI Atlası v2.0.0** - Production Ready! 🚀  
Geliştiren & Düzenleyen: **Kenan AY**  

**Son Güncelleme:** Ocak 2025
- ✅ Sprint 1: Dark Mode, Quiz UI, Flashcard UI, Analytics Dashboard
- ✅ Sprint 2: Gradient Descent Viz, Code Execution, Badge System, Keyboard Shortcuts
- ✅ Sprint 3: 5 Kritik Konu Ekleme (RAG, Agents, LoRA, XGBoost, Özdeğer/SVD)
- ✅ Production: Error boundaries, Mobile responsive, Lazy loading, ARIA labels, Framer Motion

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kenanay/ai-atlasi)

**One-click deployment:**
1. Click the button above
2. Connect your GitHub account
3. Deploy!

**Manual deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Live URL:** [https://ai-atlasi.vercel.app](https://ai-atlasi.vercel.app) (will be available after deployment)

### Production Checklist
- [x] Build passing (npm run build)
- [x] TypeScript errors resolved
- [x] 80 topics validated (Zod)
- [x] Error boundaries in place
- [x] Mobile responsive
- [x] Lazy loading (Monaco, React Flow, Simulators)
- [x] ARIA labels & accessibility
- [x] Smooth animations (Framer Motion)
- [x] Loading skeletons
