# Yakında Eklenecek Kritik Konular

**Geliştiren & Düzenleyen:** Kenan AY

Bu dokümanda, mevcut 67 konuluk yapıya eklenecek ve uygulamaya en çok değer katacak 5 kritik konu detaylandırılmıştır.

## 🎯 Seçim Kriterleri

1. **Endüstri Standardı**: Gerçek dünyada aktif kullanım
2. **Güncellik**: 2023-2024 yapay zeka ekosisteminde kritik öneme sahip
3. **Matematik-Uygulama Dengesi**: Teorik temeli olan, uygulanabilir konular
4. **Eksiklik Giderme**: Mevcut yapıda bulunmayan ama olması gereken konular

---

## 1. Özdeğer ve Özvektörler (Eigenvalues & Eigenvectors)

### Kategori
Matematik / Lineer Cebir

### Seviye
2 (Orta)

### Neden Kritik?
- **PCA'nın Temeli**: Boyut azaltmanın matematiksel altyapısı
- **Spektral Kümeleme**: Graf analizinde kullanılır
- **Kovaryans Matrisleri**: Veri yapısını anlamak için kritik
- **Kararlılık Analizi**: Dinamik sistemlerin davranışını inceler

### İçerik Kapsamı
- Özdeğer/Özvektör tanımı ve geometrik yorumu
- Karakteristik denklem ve hesaplama yöntemleri
- PCA'da kullanımı (kovaryans matrisinin eigen-decomposition)
- Spektral kümeleme ve Laplacian matrisi
- Power iteration algoritması
- Rayleigh quotient
- Simetrik matrisler ve ortogonal özvektörler

### Kod Örnekleri
- NumPy ile özdeğer hesaplama
- PCA implementasyonu (from scratch)
- Spektral kümeleme örneği
- Veri görselleştirme (scree plot, biplot)

### Önkoşullar
- Matrisler ve Tensörler
- Vektörler
- Temel Lineer Cebir

### Tahmini Süre
45 dakika

### Durum
✅ JSON dosyası oluşturuldu (eigenvalues-eigenvectors.json)

---

## 2. SVD - Singular Value Decomposition (Tekil Değer Ayrışımı)

### Kategori
Matematik / Lineer Cebir

### Seviye
3 (İleri)

### Neden Kritik?
- **Low-Rank Approximation**: Matris yaklaşımları ve sıkıştırma
- **Matrix Factorization**: Öneri sistemlerinin temeli
- **LoRA (Low-Rank Adaptation)**: LLM fine-tuning'in matematik temeli
- **LSA (Latent Semantic Analysis)**: Doğal dil işlemede kullanım
- **Image Compression**: Görüntü sıkıştırma uygulamaları

### İçerik Kapsamı
- SVD tanımı: A = UΣV^T
- Geometrik yorum (rotasyon, scaling, rotasyon)
- Truncated SVD ve rank-k approximation
- Matrix factorization (collaborative filtering)
- PCA vs SVD ilişkisi
- Pseudoinverse ve lineer sistem çözümü
- LoRA'da SVD kullanımı

### Kod Örnekleri
- NumPy ile SVD
- Image compression
- Recommender system (MovieLens)
- Text LSA örneği
- LoRA simulasyonu

### Önkoşullar
- Özdeğer ve Özvektörler
- Matrisler ve Tensörler
- PCA (opsiyonel ama tavsiye)

### Tahmini Süre
50 dakika

### Durum
⏳ Planlama aşamasında

---

## 3. XGBoost & Gradient Boosting

### Kategori
Machine Learning / Ensemble Methods

### Seviye
2 (Orta)

### Neden Kritik?
- **Tabular Data'da #1**: Kaggle yarışmalarında en çok kullanılan
- **Endüstri Standardı**: Finans, sağlık, e-ticaret'te yaygın
- **Performans**: Hızlı ve yüksek doğruluk
- **Varyantlar**: LightGBM, CatBoost da popüler

### İçerik Kapsamı
- Boosting kavramı (ensemble of weak learners)
- Gradient Boosting temelleri
- XGBoost mimarisi ve optimizasyonları
- Hyperparameter tuning
- Feature importance
- Regularization (L1/L2)
- LightGBM ve CatBoost karşılaştırması
- Early stopping ve cross-validation

### Kod Örnekleri
- XGBoost classification (Titanic dataset)
- Hyperparameter tuning (GridSearch)
- Feature importance visualization
- LightGBM comparison
- SHAP values (model explainability)

### Önkoşullar
- Decision Trees
- Random Forest
- Loss Functions
- Gradient Descent

### Tahmini Süre
40 dakika

### Durum
⏳ Planlama aşamasında

---

## 4. RAG & Vektör Veritabanları

### Kategori
LLM / Applications

### Seviye
2 (Orta - Uygulama)

### Neden Kritik?
- **Kurumsal LLM'lerin Temeli**: Özel verilerle LLM kullanımı
- **Güncel Bilgi**: LLM'lere fresh data sağlama
- **Halüsinasyon Azaltma**: Kaynak tabanlı cevaplar
- **En Popüler Pattern**: 2023-2024'te en çok kullanılan LLM mimarisi

### İçerik Kapsamı
- RAG (Retrieval-Augmented Generation) nedir?
- Chunking stratejileri (fixed, recursive, semantic)
- Embedding modelleri (OpenAI, Sentence-BERT)
- Vektör veritabanları (FAISS, Chroma, Pinecone, Weaviate)
- Similarity search (cosine, dot product, euclidean)
- Hybrid search (BM25 + Vector)
- Reranking (cross-encoder)
- RAG evaluation metrics (faithfulness, relevance)

### Kod Örnekleri
- LangChain ile RAG pipeline
- FAISS ile local vector store
- Chunking strategies comparison
- Hybrid search implementation
- Reranking with cross-encoder
- RAG evaluation

### Önkoşullar
- Word Embeddings
- LLM Basics
- Transformer Architecture (opsiyonel)

### Tahmini Süre
50 dakika

### Durum
⏳ Planlama aşamasında

---

## 5. AI Agents & Tool Calling

### Kategori
LLM / Advanced Applications

### Seviye
3 (İleri)

### Neden Kritik?
- **LLM'den Aksiyona**: Sadece text generation değil, aksiyon alan sistemler
- **Güncel Trend**: OpenAI, Anthropic, Google'ın odak noktası
- **Otomasyon**: Karmaşık task'ları otomatikleştirme
- **Real-World Impact**: Email, API, veritabanı gibi sistemlerle entegrasyon

### İçerik Kapsamı
- Agent kavramı (Perception, Reasoning, Action)
- ReAct (Reasoning + Acting) döngüsü
- Tool/Function Calling
  - OpenAI Function Calling
  - Anthropic Tool Use
  - LangChain Tools
- Memory mimarileri (short-term, long-term)
- Multi-agent systems
  - Agent iletişimi
  - Coordination patterns
  - AutoGen, CrewAI
- Agent planning (Chain-of-Thought, Tree-of-Thought)

### Kod Örnekleri
- Simple ReAct agent
- OpenAI function calling
- LangChain agent with tools
- Multi-agent workflow (AutoGen)
- Memory-augmented agent
- Tool creation (custom functions)

### Önkoşullar
- LLM Basics
- Prompt Engineering (opsiyonel)
- API kullanımı (temel programlama)

### Tahmini Süre
55 dakika

### Durum
⏳ Planlama aşamasında

---

## 🎯 İmplementasyon Öncelikleri

### Sprint 3 (Ocak 2025)
1. ✅ **Özdeğer ve Özvektörler** - JSON hazır, test edilecek
2. **SVD** - Yüksek öncelik (LoRA için kritik)
3. **XGBoost** - Orta öncelik (popüler talep)

### Sprint 4 (Şubat 2025)
4. **RAG & Vektör DB** - Yüksek öncelik (#1 LLM pattern)
5. **AI Agents** - Yüksek öncelik (gelecek trend)

---

## 📊 Ek İyileştirmeler

### İnteraktif Simülasyonlar
- [ ] PCA projeksiyon görselleştiricisi
- [ ] SVD decomposition animasyonu
- [ ] XGBoost tree building simulator
- [ ] RAG chunking/retrieval demo
- [ ] Agent reasoning görselleştiricisi

### Kod Çalıştırma
- [x] Pyodide entegrasyonu (Sprint 2'de tamamlandı)
- [ ] Konulara kod çalıştırma widget'ı ekleme
- [ ] Önceden yüklenmiş NumPy, scikit-learn
- [ ] API key yönetimi (OpenAI, Anthropic)

---

## 📝 Notlar

- Tüm konular 5 seviyeli içerik yapısına uygun hazırlanacak
- Her konu için quiz ve flashcard setleri eklenecek
- Gerçek dünya veri setleri kullanılacak (Kaggle, Hugging Face)
- Görselleştirmeler Plotly.js ile interaktif olacak
- Kod örnekleri hem scikit-learn hem from-scratch içerecek

---

**Geliştirme Takibi:**  
GitHub Issues veya bu dosya üzerinden güncellenecektir.

**Son Güncelleme:** Ocak 2025  
**Geliştiren:** Kenan AY
