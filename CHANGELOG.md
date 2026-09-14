# Changelog

Bu dosya AI Atlası projesindeki tüm önemli değişiklikleri içerir.

Format [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standardını takip eder,
ve versiyon numaraları [Semantic Versioning](https://semver.org/spec/v2.0.0.html) kullanır.

## [2.0.0] - 2025-01-XX - Production Release 🚀

### 🎉 Production Ready

İlk production release! Uygulama artık https://aiatlasi.vercel.app adresinden erişilebilir.

### ✨ Added - Production Features

#### Error Handling & Stability
- **Global error boundaries** (`app/error.tsx`, `app/not-found.tsx`)
- **Component-level error boundaries** (reusable `ErrorBoundary` wrapper)
- **User-friendly error messages** (AlertCircle icon, retry button, home navigation)
- **404 page** with popular topics and search suggestions

#### Mobile Responsive
- **Hamburger menu** with spring animation (Framer Motion)
- **Mobile drawer navigation** (AnimatePresence, backdrop blur)
- **Touch-friendly buttons** (larger hit areas)
- **Mobile warning banners** (CodeLab, Simulators: "Desktop önerilir")
- **Responsive grids** (grid-cols-1 sm:grid-cols-2 md:grid-cols-3)
- **Desktop UX preserved** (panel collapse, fullscreen intact)

#### Performance Optimization
- **Lazy loading** for heavy components:
  - Monaco Editor (3.9MB) → CodeEditorWrapper
  - React Flow (2.9MB) → learning-map lazy load
  - All 7 simulators → individual lazy loading
  - TopicRightPanel visualizations → on-demand loading
- **Code splitting** (8.6MB total → 20+ chunks)
- **Bundle analyzer** configured (@next/bundle-analyzer)
- **First Load JS** < 500KB (optimized initial load)

#### Loading States
- **Shimmer animation** (custom @keyframes in globals.css)
- **Skeleton components**:
  - TopicCardSkeleton (realistic card placeholder)
  - TopicContentSkeleton (full page structure)
  - LearningPathCardSkeleton (compact card)
  - StatsCardSkeleton (dashboard stats)
- **Loading feedback** for Monaco, React Flow, simulators

#### Accessibility (WCAG 2.1 AA)
- **Skip-to-main link** (keyboard-only, Tab from page load)
- **ARIA labels** (all interactive elements)
- **Enhanced focus indicators** (2px blue outline, dark mode support)
- **Reduced motion support** (@prefers-reduced-motion)
- **High contrast mode** support (3px outline)
- **Keyboard navigation** (Tab, Enter, Space, Escape)
- **Screen reader friendly** (semantic HTML, role attributes)

#### Smooth Animations (Framer Motion)
- **Page transitions** (fade + slide, easeOutExpo)
- **Button animations** (whileHover: scale 1.02, whileTap: scale 0.98)
- **Card hover effects** (lift -4px + shadow)
- **Mobile drawer** (spring slide animation)
- **Stagger animations** (list/grid items)
- **60fps hardware-accelerated** (transform, opacity)

### 📊 Technical Improvements

#### Build & Dependencies
- **Framer Motion** added (smooth animations)
- **@next/bundle-analyzer** added (performance monitoring)
- **Build time** optimized (2.4s compile)
- **TypeScript strict mode** (no errors)
- **Zod validation** (80/80 topics passing)

#### Code Quality
- **Error boundary pattern** (isolation, retry, reset)
- **Dynamic imports** (next/dynamic with loading states)
- **Client components** ('use client' for motion components)
- **Accessibility best practices** (skip links, ARIA, focus management)
- **Reduced motion respect** (system preference detection)

### 🐛 Fixed

- **SSR issues** with Framer Motion (added 'use client' directives)
- **TypeScript errors** (motion component props casting)
- **Mobile navigation** overlapping content (z-index fixes)
- **Focus indicators** missing on some elements (global CSS added)

### 📚 Documentation

- **README.md** updated with production URL and deployment instructions
- **CONTRIBUTING.md** added (contribution guidelines, code standards)
- **LICENSE** added (MIT License)
- **CHANGELOG.md** created (this file)

### 🚀 Deployment

- **GitHub repository** created: https://github.com/kenanay/ai-atlasi
- **Vercel deployment** configured (automatic from GitHub)
- **Production URL**: https://aiatlasi.vercel.app
- **Automatic deployments** on git push to main

---

## [1.0.0] - 2025-01-05 - Initial Release

### ✨ Added - Core Features

#### Content & Topics
- **80 comprehensive topics** across ML, DL, LLM, CV, RL
- **5-level learning structure** (Basic → Expert)
- **Category organization** (Mathematics, Machine Learning, Deep Learning, LLM, etc.)
- **Prerequisite system** with visual dependency graph
- **Estimated time** for each topic

#### Interactive Learning
- **7 Interactive simulators**:
  - Gradient Descent Plot
  - PCA Visualizer
  - K-Means Animator
  - Attention Mechanism
  - CNN Convolution
  - Neural Network Simulator
  - Q-Learning GridWorld
- **Python Code Lab** (Pyodide WebAssembly)
- **Monaco Editor** integration (syntax highlighting, autocompletion)
- **Quiz system** (multiple choice, explanations)
- **Flashcard system** (3D flip animation, spaced repetition)

#### User Experience
- **Dark mode** (Light / Dark / System)
- **Keyboard shortcuts** (Ctrl+B/J, 0-4, ←→, Ctrl+K, Ctrl+D)
- **Badge system** (26 badges, 4 rarity levels)
- **Progress tracking** (localStorage, import/export)
- **Analytics dashboard** (stats, charts, category breakdown)
- **Learning map** (React Flow graph, 80 topics visualization)
- **Search functionality** (fuzzy search, tag filtering)

#### UI Components
- **Three-column layout** (sidebar, content, right panel)
- **Responsive design** (mobile, tablet, desktop)
- **Smooth transitions** (CSS animations)
- **LaTeX formulas** (KaTeX rendering)
- **Code syntax highlighting** (Prism.js)
- **Interactive charts** (Recharts)

#### Technical Stack
- **Next.js 15** (App Router, Turbopack)
- **TypeScript** (strict mode)
- **Tailwind CSS** (utility-first styling)
- **Framer Motion** (animations)
- **Zod** (runtime validation)
- **LocalStorage** (client-side persistence)

### 📝 Notes

- Projenin ilk public release'i
- 80 konu hazır ve test edilmiş
- Tüm core özellikler çalışır durumda
- Desktop-first approach (mobile optimizasyonu limited)

---

## Legend

- `Added` - Yeni özellikler
- `Changed` - Mevcut fonksiyonellikte değişiklikler
- `Deprecated` - Yakında kaldırılacak özellikler
- `Removed` - Kaldırılan özellikler
- `Fixed` - Bug düzeltmeleri
- `Security` - Güvenlik düzeltmeleri

---

**AI Atlası** - Yapay Zeka Öğrenme ve Deney Laboratuvarı  
Geliştiren: Kenan AY  
Lisans: MIT
