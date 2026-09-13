# AI Atlası - Özellikler ve Kullanım Kılavuzu

## ✅ Tamamlanan Özellikler

### 1. Proje Altyapısı
- ✅ Next.js 15 (App Router) ile modern React uygulaması
- ✅ TypeScript ile tip güvenliği
- ✅ Tailwind CSS ile responsive tasarım
- ✅ Lucide React ikonları

### 2. Veri Modeli ve İçerik Sistemi
- ✅ 5 seviyeli öğrenme yapısı (0: Temel → 4: Uzman)
- ✅ JSON tabanlı konu içerikleri
- ✅ Önkoşul ve sonraki konu bağlantıları
- ✅ Kategori bazlı organizasyon (17 kategori)
- ✅ Örnek konular:
  - Vektörler (Lineer Cebir)
  - Gradient Descent (Optimizasyon)

### 3. Kullanıcı Arayüzü

#### Ana Sayfa
- ✅ Genel istatistikler (toplam konu, tamamlanan, devam eden, süre)
- ✅ İlerleme yüzdesi gösterimi
- ✅ Önerilen sonraki konu
- ✅ Öğrenme yolu öneri sistemi
- ✅ Son çalışılan konular
- ✅ Başlangıç konuları

#### Konular Sayfası
- ✅ Tüm konuların grid/list görünümü
- ✅ Kategori bazlı filtreleme
- ✅ Seviye filtreleme
- ✅ Kilitli/açık konu gösterimi
- ✅ Sol sidebar ile kategori navigasyonu
- ✅ Her konuda ilerleme çubuğu

#### Arama Sayfası
- ✅ Başlık, açıklama ve tag bazlı arama
- ✅ Gerçek zamanlı arama sonuçları
- ✅ Arama ipuçları

#### Ayarlar Sayfası
- ✅ Genel istatistikler
- ✅ İlerleme verilerini dışa aktarma (JSON)
- ✅ İlerleme verilerini içe aktarma
- ✅ Tüm ilerlemeyi sıfırlama
- ✅ Hakkında bilgileri

### 4. Konu Detay Sayfası (3 Kolonlu Layout)

#### Sol Panel
- ✅ Konu bilgileri (başlık, seviye, süre)
- ✅ İlerleme göstergesi
- ✅ Bookmark özelliği
- ✅ Seviye seçici (0-4)
- ✅ Tamamlanan seviyelerin gösterimi
- ✅ Önkoşul konuları
- ✅ Sonraki önerilen konular
- ✅ Kişisel istatistikler

#### Orta Panel - İçerik Sekmesi
- ✅ Seviyeye göre dinamik içerik
- ✅ "Bu Konu Nedir?" bölümü
- ✅ "Neden Gerekli?" bölümü
- ✅ Günlük hayattan benzetme
- ✅ **Matematiksel formüller (KaTeX ile render)**
- ✅ Algoritma adım adım açıklama
- ✅ Karmaşıklık bilgisi
- ✅ Sık yapılan hatalar
- ✅ Referanslar ve kaynaklar
- ✅ Tag'ler

#### Orta Panel - Notlar Sekmesi
- ✅ Kişisel not alma
- ✅ Not düzenleme
- ✅ Otomatik kaydetme
- ✅ Son kaydetme zamanı

#### Sağ Panel
- ✅ Seviyeye göre kod örnekleri gösterimi
- ✅ **Monaco Editor entegrasyonu**
- ✅ Syntax highlighting (Python, NumPy, PyTorch, JavaScript)
- ✅ Kod kopyalama butonu
- ✅ Kod sıfırlama butonu
- ✅ Çalıştır butonu (placeholder)
- ✅ Kod açıklamaları
- ✅ Görselleştirme placeholderları

#### Alt Navigasyon
- ✅ Önceki/Sonraki seviye butonları
- ✅ "Bu Seviyeyi Tamamladım" butonu
- ✅ Tamamlanma durumu gösterimi

### 5. İlerleme Takibi
- ✅ LocalStorage tabanlı (sunucu gerektirmez)
- ✅ Seviye bazlı tamamlama
- ✅ Geçirilen süre kaydı (otomatik)
- ✅ Konu durumları (başlanmadı, devam ediyor, tamamlandı, tekrar)
- ✅ Bookmark sistemi
- ✅ Kişisel notlar
- ✅ Quiz skorları (hazır altyapı)
- ✅ Son erişim tarihi
- ✅ Dışa/içe aktarma

### 6. Markdown ve LaTeX Entegrasyonu
- ✅ **KaTeX ile LaTeX formül render**
- ✅ **Marked.js ile Markdown desteği**
- ✅ DOMPurify ile XSS koruması
- ✅ Matematiksel sembollerin doğru görünümü
- ✅ Responsive formül gösterimi

### 7. Kod Editörü
- ✅ **Monaco Editor (VS Code editörü)**
- ✅ Syntax highlighting
- ✅ Çoklu dil desteği
- ✅ Dark theme
- ✅ Line numbers
- ✅ Code folding
- ✅ Otomatik layout ayarlama
- ✅ Word wrap

### 8. UI Bileşenleri
- ✅ Button (5 varyant)
- ✅ Card ve alt bileşenleri
- ✅ Badge (6 varyant)
- ✅ ProgressBar (dinamik renklendirme)
- ✅ MathFormula (LaTeX render)
- ✅ MarkdownRenderer
- ✅ CodeEditor (Monaco tabanlı)
- ✅ LevelSelector
- ✅ NotesPanel

## 🚧 Planlanan Özellikler

### Yakında Eklenecek
- [ ] Quiz sistemi (altyapı hazır, UI gerekli)
- [ ] Flashcard sistemi (altyapı hazır, UI gerekli)
- [ ] Plotly.js ile interaktif grafikler
- [ ] Gerçek kod çalıştırma (Pyodide veya server)
- [ ] Daha fazla konu içeriği
- [ ] Markdown içinde LaTeX desteği
- [ ] Görselleştirme araçları:
  - Vektör çizici
  - Matris görselleştirici
  - Gradient descent animasyonu
  - Neural network görselleştirici

### Gelecek Güncellemeler
- [ ] Yapay zeka sohbet asistanı
- [ ] Ses içerikleri
- [ ] Video entegrasyonu
- [ ] Öğrenme yolu önerileri (ML tabanlı)
- [ ] Sosyal özellikler (isteğe bağlı)
- [ ] Mobil uygulama (PWA)
- [ ] Offline mode
- [ ] Dark mode
- [ ] Çoklu dil desteği

## 📖 Kullanım Kılavuzu

### Yeni Başlayanlar İçin

1. **Ana Sayfa**: Uygulamayı açtığınızda genel durumunuzu görürsünüz
2. **Önerilen Konu**: Önkoşulu tamamladığınız konular önerilir
3. **Seviye Sistemi**: Her konu 5 seviyede öğrenilir:
   - Seviye 0: Günlük dille temel anlayış
   - Seviye 1: Kavramsal öğrenme
   - Seviye 2: Kod örnekleri ve uygulama
   - Seviye 3: Matematiksel derinlik
   - Seviye 4: Mimari, performans, üretim

### Bir Konu Öğrenme Akışı

1. Konuya tıklayın
2. Seviye 0'dan başlayın
3. İçeriği okuyun
4. Notlar sekmesinde kişisel notlar alın
5. "Bu Seviyeyi Tamamladım" butonuna tıklayın
6. Sonraki seviyeye geçin
7. Seviye 2+'da kod örneklerini inceleyin
8. Editörde kodu düzenleyin ve deneyin

### İpuçları

- 🔖 Önemli konuları bookmark'layın
- 📝 Her seviyede not alın
- 🎯 Önkoşulları tamamlamadan ileri seviyeye geçmeyin
- ⏱️ Düzenli çalışma yapın (süreniz otomatik kaydedilir)
- 💾 Düzenli olarak ilerlemenizi dışa aktarın
- 📊 İstatistiklerinizi takip edin

## 🔧 Teknik Detaylar

### Kullanılan Teknolojiler

- **Frontend Framework**: Next.js 15 (App Router)
- **Dil**: TypeScript
- **Styling**: Tailwind CSS
- **İkonlar**: Lucide React
- **Matematik**: KaTeX
- **Markdown**: Marked.js
- **Sanitization**: DOMPurify
- **Kod Editörü**: Monaco Editor
- **Veri**: LocalStorage
- **Build Tool**: Turbopack

### Performans

- Static Site Generation (SSG) kullanımı
- Client-side routing ile hızlı sayfa geçişleri
- Lazy loading (Monaco Editor)
- Optimized bundle size
- LocalStorage ile instant load

### Güvenlik

- DOMPurify ile XSS koruması
- TypeScript ile tip güvenliği
- No backend = No server vulnerabilities
- Tüm veriler local

## 📚 Veri Modeli

Her konu şu bilgileri içerir:

```typescript
{
  id: string
  title: string
  category: TopicCategory
  level: 0 | 1 | 2 | 3 | 4
  estimatedTime: number // dakika
  
  content: {
    level0_basic: string
    level1_beginner: string
    level2_application: string
    level3_advanced: string
    level4_expert: string
  }
  
  whatIsIt: string
  whyNeeded: string
  realWorldAnalogy: string
  
  mathematics?: {
    formulas: string[] // LaTeX
  }
  
  algorithm?: {
    stepByStep: string[]
    complexity: string
  }
  
  codeExamples: CodeExample[]
  visualizations?: Visualization[]
  
  prerequisites: string[]
  nextTopics: string[]
  
  quiz: QuizQuestion[]
  flashcards?: Flashcard[]
  
  references?: Reference[]
  tags: string[]
}
```

## 🎨 Tasarım Prensipleri

1. **Sadelik**: Dikkat dağıtmayan, odaklanmayı destekleyen arayüz
2. **Hiyerarşi**: Açık bilgi hiyerarşisi ve görsel düzen
3. **Tutarlılık**: Tüm sayfalarda tutarlı tasarım dili
4. **Erişilebilirlik**: Renk kontrastları ve okunabilir fontlar
5. **Responsive**: Tüm ekran boyutlarında çalışır

## 🚀 Performans İpuçları

- Monaco Editor sadece kod paneli açıkken yüklenir
- KaTeX formülleri önbelleğe alınır
- LocalStorage değişiklikleri debounce edilir
- Büyük konularda lazy loading kullanın

## 🐛 Bilinen Sınırlamalar

1. Kod çalıştırma henüz gerçek değil (placeholder)
2. Görselleştirmeler placeholder
3. Quiz UI henüz yok (altyapı hazır)
4. Flashcard UI henüz yok (altyapı hazır)
5. Dark mode yok
6. Mobil optimize edilebilir

## 📝 Lisans

Kişisel kullanım için tasarlanmıştır.

---

**Versiyon**: 1.0.0-beta  
**Son Güncelleme**: 2026  
**Durum**: Beta - Aktif Geliştirme
