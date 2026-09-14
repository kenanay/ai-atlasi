# Katkıda Bulunma Rehberi

AI Atlası projesine katkıda bulunmak istediğiniz için teşekkür ederiz! 🎉

## 📋 İçindekiler

- [Nasıl Katkıda Bulunabilirim?](#nasıl-katkıda-bulunabilirim)
- [Geliştirme Ortamı](#geliştirme-ortamı)
- [Kod Standartları](#kod-standartları)
- [Commit Mesajları](#commit-mesajları)
- [Pull Request Süreci](#pull-request-süreci)
- [Yeni Konu Ekleme](#yeni-konu-ekleme)

## Nasıl Katkıda Bulunabilirim?

### 🐛 Bug Raporlama

Bir hata bulduysanız:

1. GitHub Issues'a gidin: https://github.com/kenanay/ai-atlasi/issues
2. "New Issue" butonuna tıklayın
3. Aşağıdaki bilgileri ekleyin:
   - **Başlık:** Kısa ve açıklayıcı
   - **Açıklama:** Hatayı nasıl tekrar oluşturabiliriz?
   - **Ekran görüntüsü:** Varsa ekleyin
   - **Tarayıcı/OS:** Chrome 120 / macOS Sonoma gibi
   - **Beklenen davranış:** Ne olmasını bekliyordunuz?
   - **Gerçek davranış:** Ne oldu?

### ✨ Yeni Özellik Önerme

Bir özellik fikriniz varsa:

1. GitHub Discussions'a gidin
2. "New Discussion" → "Ideas" seçin
3. Özelliği detaylıca açıklayın:
   - Kullanım senaryosu
   - Mockup/wireframe (varsa)
   - Alternatif çözümler

### 📝 Dokümantasyon

- README.md iyileştirmeleri
- Kod örnekleri ekleme
- Türkçe dil düzeltmeleri
- Yeni konu içerikleri

### 💻 Kod Katkısı

1. **Fork edin:** Repository'yi kendi hesabınıza fork edin
2. **Branch oluşturun:** `git checkout -b feature/yeni-ozellik`
3. **Geliştirme yapın:** Kodunuzu yazın
4. **Test edin:** `npm run build` çalıştığından emin olun
5. **Commit edin:** Anlamlı commit mesajları kullanın
6. **Push edin:** `git push origin feature/yeni-ozellik`
7. **Pull Request açın:** GitHub'da PR oluşturun

## Geliştirme Ortamı

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Git

### Kurulum

```bash
# Repository'yi clone edin
git clone https://github.com/kenanay/ai-atlasi.git
cd ai-atlasi

# Dependencies yükleyin
npm install

# Development server başlatın
npm run dev

# http://localhost:3000 açılacak
```

### Proje Yapısı

```
ai-atlasi/
├── app/              # Next.js App Router pages
├── components/       # React components
├── data/topics/      # Konu JSON dosyaları
├── lib/              # Utility functions
├── hooks/            # Custom React hooks
└── types/            # TypeScript types
```

## Kod Standartları

### TypeScript

- **Strict mode:** Tüm kod TypeScript strict mode'da yazılmalı
- **Type safety:** `any` kullanmaktan kaçının
- **Interfaces:** Component props için interface tanımlayın

```typescript
// ✅ İyi
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  children: ReactNode;
}

// ❌ Kötü
function Button(props: any) { ... }
```

### React Components

- **Functional components:** Class components kullanmayın
- **Hooks:** useState, useEffect, custom hooks kullanın
- **Props destructuring:** Props'ları destructure edin

```tsx
// ✅ İyi
export function Button({ variant = 'primary', onClick, children }: ButtonProps) {
  return <button className={variant} onClick={onClick}>{children}</button>;
}

// ❌ Kötü
export function Button(props) {
  return <button className={props.variant}>{props.children}</button>;
}
```

### Styling

- **Tailwind CSS:** Tüm styling Tailwind ile
- **Dark mode:** `dark:` prefix kullanın
- **Responsive:** `md:`, `lg:` breakpoints kullanın

```tsx
// ✅ İyi
<div className="p-4 bg-white dark:bg-slate-900 md:p-6 lg:p-8">

// ❌ Kötü
<div style={{ padding: '16px', backgroundColor: 'white' }}>
```

### Dosya Adlandırma

- **Components:** PascalCase → `Button.tsx`, `TopicCard.tsx`
- **Utils:** camelCase → `topics.ts`, `progress.ts`
- **Hooks:** camelCase + "use" prefix → `useProgress.ts`
- **Types:** camelCase → `index.ts`

## Commit Mesajları

Conventional Commits formatını kullanın:

```
<type>(<scope>): <subject>

<body> (optional)
```

### Types

- **feat:** Yeni özellik
- **fix:** Bug düzeltmesi
- **docs:** Dokümantasyon
- **style:** Code formatting (kod mantığı değişmez)
- **refactor:** Code refactoring
- **perf:** Performance iyileştirmesi
- **test:** Test ekleme/düzeltme
- **chore:** Build, dependencies güncelleme

### Örnekler

```bash
# Yeni özellik
feat(simulators): add CNN convolution visualizer

# Bug düzeltmesi
fix(topic): resolve level switching issue on mobile

# Dokümantasyon
docs(readme): update installation instructions

# Performance
perf(lazy-loading): implement code splitting for Monaco Editor
```

## Pull Request Süreci

### PR Oluşturmadan Önce

- [ ] `npm run build` başarılı mı?
- [ ] TypeScript hataları yok mu?
- [ ] Console'da error/warning yok mu?
- [ ] Dark mode test edildi mi?
- [ ] Mobile responsive test edildi mi?
- [ ] Accessibility (keyboard navigation) test edildi mi?

### PR Açarken

**Başlık:**
```
feat: Add Q-Learning GridWorld simulator
```

**Açıklama Template:**
```markdown
## Ne değişti?
- Q-Learning simülatörü eklendi
- Grid world environment
- Epsilon-greedy policy visualization

## Nasıl test edildi?
- Desktop (Chrome, Firefox, Safari)
- Mobile (iPhone 14, Android)
- Dark mode
- Keyboard navigation

## Screenshots
[Ekran görüntüsü ekleyin]

## Checklist
- [x] Build passing
- [x] TypeScript errors yok
- [x] Mobile responsive
- [x] Dark mode çalışıyor
- [x] Accessibility test edildi
```

### PR Review Süreci

1. **Automated checks:** GitHub Actions otomatik build çalıştırır
2. **Code review:** Maintainer kodu inceler
3. **Feedback:** Gerekirse değişiklik istenir
4. **Approval:** Onaylandıktan sonra merge edilir

## Yeni Konu Ekleme

### 1. JSON Dosyası Oluştur

`data/topics/yeni-konu.json`:

```json
{
  "id": "yeni-konu",
  "title": "Yeni Konu Başlığı",
  "category": "machine-learning",
  "level": 2,
  "estimatedTime": 45,
  "description": "Kısa açıklama",
  "content": {
    "level0_basic": "Temel seviye içerik...",
    "level1_beginner": "Başlangıç seviye içerik...",
    "level2_application": "Uygulama seviye içerik...",
    "level3_advanced": "İleri seviye içerik...",
    "level4_expert": "Uzman seviye içerik..."
  },
  "whatIsIt": "Bu teknoloji nedir?",
  "whyNeeded": "Neden gereklidir?",
  "realWorldAnalogy": "Günlük hayattan benzetme",
  "keyTakeaways": [
    "Önemli nokta 1",
    "Önemli nokta 2"
  ],
  "prerequisites": ["onkosul-konu-id"],
  "nextTopics": ["sonraki-konu-id"],
  "codeExamples": [
    {
      "title": "Örnek Kod",
      "language": "python",
      "code": "# Python kodu...",
      "explanation": "Açıklama"
    }
  ],
  "quiz": [
    {
      "question": "Soru?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Doğru cevap açıklaması"
    }
  ],
  "tags": ["machine-learning", "supervised-learning"]
}
```

### 2. Import Et

`lib/topics.ts` dosyasında import edin:

```typescript
import yeniKonu from '@/data/topics/yeni-konu.json';

// allTopicsArray'e ekleyin
const allTopicsArray: Topic[] = [
  // ... diğer konular
  yeniKonu,
];
```

### 3. Validate Et

```bash
# Zod validation çalıştır
npm run build

# "✅ BAŞARILI: Tüm X konu dosyası..." görmelisiniz
```

### 4. Test Et

- Topic listesinde görünüyor mu?
- Tüm 5 level render oluyor mu?
- Kod örnekleri çalışıyor mu?
- Quiz sorular doğru mu?
- Dark mode'da okunabilir mi?

## Kod Review Kriterleri

Maintainer şu kriterlere göre review yapar:

### ✅ Kabul Kriterleri

- Build başarılı
- TypeScript hataları yok
- Console error/warning yok
- Responsive (mobile test edilmiş)
- Dark mode çalışıyor
- Accessibility (WCAG 2.1 AA)
- Performance (lazy loading, bundle size)
- Code quality (clean, readable, maintainable)

### ❌ Red Kriterleri

- Build hatası
- TypeScript errors
- Console errors
- Responsive bozuk
- Dark mode broken
- Accessibility issues
- Performance regression
- Code quality düşük (magic numbers, duplicate code, no comments)

## İletişim

- **GitHub Issues:** Bug reports, feature requests
- **GitHub Discussions:** Genel sorular, öneriler
- **Email:** support@aiatlasi.com (gelecekte)

## Davranış Kuralları

- **Saygılı olun:** Tüm katkıda bulunanlara saygılı davranın
- **Yapıcı olun:** Eleştirilerinizi yapıcı yapın
- **Yardımcı olun:** Yeni başlayanları destekleyin
- **Sabırlı olun:** Review süreci zaman alabilir

## Lisans

Bu projeye katkıda bulunarak, katkılarınızın proje lisansı altında dağıtılmasını kabul edersiniz.

---

**Teşekkürler! 🎉**

Katkılarınız AI Atlası'nı daha iyi hale getirir.

