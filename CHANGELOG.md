# Changelog

## [2.6.0] - Sprint 4 - 2024-01-XX

### 🎉 Major Features Completed

#### Advanced ML/LLM Topics Added (4 Critical Topics)

1. **XGBoost & Gradient Boosting** - Level 3
   - Gradient boosting theory ve XGBoost optimization techniques
   - Tree building algorithm, regularization, approximate split finding
   - Hyperparameter tuning (max_depth, learning_rate, lambda, alpha)
   - Real-world: Kaggle winner algorithm, tabular data king
   - Performance: 10-100x faster than traditional boosting

2. **LoRA & QLoRA (PEFT)** - Level 3
   - Parameter-Efficient Fine-Tuning (PEFT) methodology
   - Low-Rank Adaptation (LoRA): ΔW = B × A decomposition
   - QLoRA: 4-bit quantization + LoRA (65B models on single GPU!)
   - Hyperparameters: rank, alpha, target_modules
   - Real-world: 50K+ adapters on HuggingFace, 10-50x cost reduction

3. **RLHF & DPO (Alignment)** - Level 3
   - Reinforcement Learning from Human Feedback (RLHF)
   - 3-stage pipeline: SFT → Reward Model → PPO
   - Direct Preference Optimization (DPO): Single-stage alternative
   - Constitutional AI: Self-improvement loop
   - Real-world: ChatGPT, Claude, Llama 2 Chat alignment

4. **t-SNE & UMAP (Manifold Learning)** - Level 3
   - Nonlinear dimensionality reduction for visualization
   - t-SNE: Stochastic Neighbor Embedding with t-distribution
   - UMAP: 10-100x faster, generalizable to new data
   - Hyperparameters: perplexity (t-SNE), n_neighbors (UMAP)
   - Real-world: scRNA-seq, word embeddings, genomics

### 📊 Statistics
- **Total Topics**: 75 (was 71) ✅ Target achieved!
- **Sprint 4 Additions**: 4 critical topics
- **Categories**: 8 consolidated categories
- **Build**: TypeScript 0 errors, 10 routes generated
- **File Sizes**: XGBoost (49KB), LoRA (45KB), RLHF (48KB), t-SNE (42KB)

### 🎯 Sprint Goals Achieved
- ✅ XGBoost & Gradient Boosting (ensemble methods, Kaggle essential)
- ✅ LoRA & QLoRA (modern LLM fine-tuning standard)
- ✅ RLHF & DPO (ChatGPT's secret sauce)
- ✅ t-SNE & UMAP (visualization beyond PCA)
- ✅ 71 → 75 topics milestone reached

---

## [2.5.0] - Sprint 3 - 2024-01-XX

### 🎉 Major Features Added

#### New Interactive Visualizers
- **PCA Projeksiyon Visualizer**: 3D orijinal veri görselleştirmesi + 2D/1D projeksiyon, explained variance display, interactive component selection
- **K-Means Clustering Animator**: Step-by-step centroid movement animation, assignment/update phase visualization, convergence detection

#### Badge System Enhancement
- **Badge Unlock Toast Notifications**: Animasyonlu toast bildirimleri, gradient border effects, 5 saniye auto-dismiss, 500ms stagger animation, progress bar

#### Code Execution Enhancement
- **Executable Code Blocks**: Markdown içinde Python kod bloklarına "▶ Çalıştır" butonu eklendi
- Inline code execution with Pyodide
- Syntax-highlighted output display
- Error handling with styled messages

### 📚 New Topics (3 Critical Topics)

1. **SVD (Singular Value Decomposition)** - Level 3
   - Tekil değer ayrışımı teorisi ve uygulamaları
   - LoRA ve model compression'ın matematiksel temeli
   - Truncated SVD ve optimal rank-k approximation
   - Real-world: Netflix Prize, image compression, LLM fine-tuning
   
2. **RAG & Vektör Veritabanları** - Level 2
   - Retrieval-Augmented Generation pattern'i
   - Semantic search ve embedding'ler
   - Vektör veritabanları (Pinecone, Qdrant, Chroma, FAISS)
   - Hybrid search, reranking, evaluation metrics
   - Production deployment ve cost optimization
   
3. **AI Agents & Tool Calling** - Level 3
   - Function calling ve tool use
   - ReAct pattern (Reasoning + Acting)
   - Multi-agent systems ve collaboration
   - LangChain, AutoGPT, LangGraph frameworks
   - Real-world case studies (support, research, trading, medical)

### 🐛 Bug Fixes
- Fixed TopicCard level/difficulty type mismatch
- Added fallback for missing level property in topics
- Fixed badge type naming conflict (Badge vs BadgeType)

### 📊 Statistics
- **Total Topics**: 71 (was 68)
- **New Visualizers**: 2
- **New Interactive Features**: 3
- **Build**: TypeScript 0 errors, all routes generated successfully

---

## [2.0.0] - Sprint 2 - 2024-01-XX

### 🎉 Major Features Added

#### Interactive Simulations
- **Gradient Descent Visualizer**: 3 function types, real-time animation, step-by-step mode
- **Python Code Execution**: Pyodide WebAssembly integration, NumPy support

#### Gamification
- **Badge System**: 26 badges across 4 rarity levels
- **Keyboard Shortcuts**: 11 shortcuts for quick navigation

#### UI/UX Improvements
- **Dark Mode**: 3 themes (light/dark/system)
- **Quiz System**: Multiple choice with explanations
- **Flashcard System**: 3D flip animations, spaced repetition tracking

### 📚 New Topics (15 topics)
- K-Nearest Neighbors, Naive Bayes, Ensemble Methods
- Evaluation Metrics, Word Embeddings, Dropout Regularization
- Weight Initialization, Seq2Seq, Q-Learning/DQN
- Tokenization, Probability/Statistics, Cross-Validation
- Learning Rate Scheduling, CPU/GPU Architecture, MLOps Monitoring
- **Eigenvalues & Eigenvectors**

### 📊 Statistics
- **Total Topics**: 68
- **Categories**: 5 (Math, ML, DL, LLM, System)
- **Quiz Questions**: 272+
- **Flashcards**: 340+

---

## [1.5.0] - Sprint 1 - 2024-01-XX

### Initial Release
- 53 core AI/ML topics
- 5-level content structure
- Progress tracking with localStorage
- Topic prerequisites and learning paths
- Responsive design

### Categories
- Mathematics (11 topics)
- Machine Learning (17 topics)
- Deep Learning (20 topics)
- LLM & Gen AI (13 topics)
- System & MLOps (7 topics)

---

## Future Roadmap

### Sprint 5 (Next)
- [ ] DBSCAN & Hierarchical Clustering (unsupervised learning)
- [ ] LLM Inference Optimization (vLLM, KV Cache, PagedAttention)
- [ ] Speech AI (Whisper, ASR, TTS)
- [ ] Additional visualizers (Decision Tree, CNN filters, NN forward/backward)

### Long-term
- [ ] AI Chatbot/Teacher Mode (topic-specific Q&A)
- [ ] PWA support (offline mode)
- [ ] Multi-language support
- [ ] Video/animation embeddings
- [ ] Community features (leaderboard, sharing)
