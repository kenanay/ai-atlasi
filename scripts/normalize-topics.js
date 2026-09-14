const fs = require('fs');
const path = require('path');

const TOPICS_DIR = path.join(__dirname, '..', 'data', 'topics');

const aliasMap = {
  'xgboost': 'xgboost-gradient-boosting',
  'gradient-boosting': 'xgboost-gradient-boosting',
  'random-forests': 'decision-trees-random-forests',
  'decision-trees': 'decision-trees-random-forests',
  'dbscan': 'dbscan-hierarchical-clustering',
  'hierarchical-clustering': 'dbscan-hierarchical-clustering',
  'pca': 'pca-dimensionality-reduction',
  'dimensionality-reduction': 'pca-dimensionality-reduction',
  'rlhf': 'rlhf-dpo-alignment',
  'cnn': 'convolutional-neural-networks',
  'transformers': 'transformers-attention',
  'k-means-clustering': 'kmeans-clustering',
  'seq2seq-models': 'sequence-to-sequence',
  'variational-autoencoders': 'autoencoders-vae',
  'model-compression': 'model-compression-pruning',
  'model-monitoring': 'mlops-monitoring',
  'edge-deployment': 'edge-ai-mobile',
  'few-shot-learning': 'meta-learning-few-shot',
  'meta-learning': 'meta-learning-few-shot',
  'large-language-models': 'large-language-models-basics',
  'attention-mechanism': 'attention-mechanisms-detail',
  'kernel-methods': 'support-vector-machines',
  'llm-fine-tuning': 'lora-qlora-peft',
  'deep-learning-optimization': 'optimizers',
  'regularization-techniques': 'regularization',
  'data-augmentation': 'data-preprocessing-features',
  'data-augmentation-advanced': 'data-preprocessing-features',
  'feature-engineering': 'data-preprocessing-features',
  'multi-layer-perceptron': 'neural-networks',
  'bert-gpt-models': 'bert-language-models',
  'efficient-transformers': 'transformers-attention',
  'nlp-applications': 'nlp-fundamentals',
  'language-models': 'nlp-fundamentals',
  'time-series-analysis': 'time-series-forecasting',
  'overfitting-underfitting': 'regularization',
  'deep-rl-advanced': 'q-learning-dqn',
  'multi-agent-rl': 'reinforcement-learning-basics',
  'model-based-rl': 'reinforcement-learning-basics',
  'gans': 'generative-adversarial-networks',
  'linear-transformations': 'matrices-tensors',
  'basis-vectors': 'vectors',
  'image-classification': 'convolutional-neural-networks',
  'instance-segmentation': 'image-segmentation',
  'panoptic-segmentation': 'image-segmentation',
  'video-segmentation': 'image-segmentation',
  '3d-segmentation': 'image-segmentation',
  'video-generation': 'diffusion-models',
  '3d-generation': 'diffusion-models',
  'neural-style-transfer': 'generative-adversarial-networks',
  'tracking': 'object-detection',
  'hyperparameter-tuning': 'learning-rate-scheduling',
  'densenet': 'resnet-skip-connections',
  'unet-segmentation': 'image-segmentation',
  'efficientnet': 'convolutional-neural-networks',
  'domain-adaptation': 'transfer-learning',
  'self-supervised-learning': 'transfer-learning',
  'detection-transformers-detr': 'vision-transformers',
  'swin-transformer': 'vision-transformers',
  'stochastic-gradient-descent': 'gradient-descent',
  'mini-batch': 'gradient-descent',
  'gaussian-mixture-models': 'kmeans-clustering',
  'kubernetes-ml': 'model-deployment-production',
  'convolution': 'convolutional-neural-networks',
  'positional-encoding': 'transformers-attention',
  'layer-normalization': 'batch-normalization',
  'advanced-cnn-architectures': 'resnet-skip-connections',
  'bayesian-inference': 'probability-statistics',
  'expectation-maximization': 'kmeans-clustering',
  'variational-inference': 'autoencoders-vae',
  'vq-vae': 'autoencoders-vae',
  'flow-based-models': 'diffusion-models',
  'residual-networks': 'resnet-skip-connections',
  'advanced-architectures': 'resnet-skip-connections',
  'transformer-architectures': 'transformers-attention',
  'gpt-generative-models': 'large-language-models-basics',
  't5-text-to-text': 'sequence-to-sequence',
};

const defaultNextTopics = {
  'cpu-gpu-architecture': ['distributed-training', 'edge-ai-mobile', 'model-deployment-production'],
  'cross-validation': ['evaluation-metrics', 'learning-rate-scheduling', 'regularization'],
  'dropout-regularization': ['batch-normalization', 'learning-rate-scheduling', 'weight-initialization'],
  'eigenvalues-eigenvectors': ['svd', 'pca-dimensionality-reduction'],
  'ensemble-methods': ['decision-trees-random-forests', 'xgboost-gradient-boosting'],
  'evaluation-metrics': ['imbalanced-data-handling', 'cross-validation'],
  'k-nearest-neighbors': ['naive-bayes', 'support-vector-machines', 'kmeans-clustering'],
  'learning-rate-scheduling': ['optimizers', 'regularization', 'distributed-training'],
  'mle-map-estimation': ['probability-statistics', 'linear-regression', 'logistic-regression'],
  'mlops-monitoring': ['model-deployment-production', 'distributed-training'],
  'naive-bayes': ['logistic-regression', 'k-nearest-neighbors'],
  'probability-statistics': ['mle-map-estimation', 'linear-regression'],
  'q-learning-dqn': ['reinforcement-learning-basics', 'ai-agents-tool-calling'],
  'sequence-to-sequence': ['attention-mechanisms-detail', 'transformers-attention'],
  'tokenization': ['word-embeddings', 'nlp-fundamentals'],
  'weight-initialization': ['batch-normalization', 'optimizers'],
  'word-embeddings': ['recurrent-neural-networks', 'transformers-attention'],
};

// Kod bloğu ayıklayıcı
function extractCodeBlocks(text) {
  const regex = /```(python|numpy|pytorch|javascript|bash)?\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const lang = match[1] || 'python';
    const code = match[2].trim();
    if (code.length > 20) {
      blocks.push({ language: lang === 'numpy' || lang === 'pytorch' ? lang : 'python', code });
    }
  }
  return blocks;
}

function normalize() {
  const files = fs.readdirSync(TOPICS_DIR).filter(f => f.endsWith('.json'));
  const allTopicIds = new Set(files.map(f => f.replace('.json', '')));

  console.log(`Starting normalization across ${files.length} topics...`);

  let modifiedCount = 0;

  files.forEach(filename => {
    const filePath = path.join(TOPICS_DIR, filename);
    const rawContent = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(rawContent);
    const topicId = filename.replace('.json', '');

    let changed = false;

    // 1. ID doğrulaması
    if (data.id !== topicId) {
      data.id = topicId;
      changed = true;
    }

    // 2. Seviye kontrolü (level)
    if (data.level === undefined || data.level === null) {
      if (data.difficulty === 'beginner') data.level = 1;
      else if (data.difficulty === 'intermediate') data.level = 2;
      else if (data.difficulty === 'advanced') data.level = 3;
      else if (data.difficulty === 'expert') data.level = 4;
      else data.level = 2;
      changed = true;
    }

    // 3. Etiketler (tags)
    if (!Array.isArray(data.tags) || data.tags.length === 0) {
      if (data.metadata && Array.isArray(data.metadata.tags) && data.metadata.tags.length > 0) {
        data.tags = data.metadata.tags;
      } else {
        data.tags = [data.category || 'yapay-zeka', topicId.split('-')[0]];
      }
      changed = true;
    }

    // 4. Seviyeler (levels) - Nesne formatını Dizi formatına dönüştürme
    if (data.levels && !Array.isArray(data.levels) && typeof data.levels === 'object') {
      const obj = data.levels;
      const newLevels = [];

      // Seviye 0 (Temel Kavramlar)
      if (obj.beginner) {
        newLevels.push({
          level: 0,
          title: 'Temel Kavramlar',
          content: obj.beginner.content || '',
          keyPoints: obj.beginner.keyPoints || []
        });
        // Seviye 1 (Başlangıç)
        newLevels.push({
          level: 1,
          title: 'Başlangıç ve Mantık',
          content: obj.beginner.content || '',
          keyPoints: obj.beginner.keyPoints || []
        });
      }

      // Seviye 2 (Uygulama & Kod)
      if (obj.intermediate) {
        newLevels.push({
          level: 2,
          title: 'Uygulama ve Kodlama',
          content: obj.intermediate.content || '',
          keyPoints: obj.intermediate.keyPoints || []
        });
      }

      // Seviye 3 (İleri Seviye & Matematik)
      if (obj.advanced) {
        newLevels.push({
          level: 3,
          title: 'İleri Düzey Matematik ve Analiz',
          content: obj.advanced.content || '',
          keyPoints: obj.advanced.keyPoints || []
        });
      }

      // Seviye 4 (Uzmanlık & Gerçek Dünya)
      if (obj.expert || obj.real_world) {
        let expertContent = obj.expert ? obj.expert.content : '';
        if (obj.real_world && obj.real_world.content) {
          expertContent += (expertContent ? '\n\n## 🌍 Gerçek Dünya Senaryoları ve Üretim\n\n' : '') + obj.real_world.content;
        }
        newLevels.push({
          level: 4,
          title: 'Uzmanlık ve Üretim Ortamı',
          content: expertContent || 'Bu seviyede kurumsal mimari ve üretim optimizasyonları incelenir.',
          keyPoints: [
            ...(obj.expert?.keyPoints || []),
            ...(obj.real_world?.keyPoints || [])
          ]
        });
      }

      data.levels = newLevels;
      changed = true;
    }

    // 5. Özel dosya: eigenvalues-eigenvectors.json
    if (topicId === 'eigenvalues-eigenvectors') {
      if (data.content && data.content.levels && !data.levels) {
        data.levels = data.content.levels;
        delete data.content.levels;
        changed = true;
      }
      if (data.quiz && data.quiz.questions && !Array.isArray(data.quiz)) {
        data.quiz = data.quiz.questions;
        changed = true;
      }
    }

    // 6. Özel dosya: mle-map-estimation.json
    if (topicId === 'mle-map-estimation') {
      if (!Array.isArray(data.tags) || data.tags.length === 0) {
        data.tags = ["statistics", "probability", "inference", "optimization", "bayesian", "mle", "map", "regularization"];
        changed = true;
      }
      if (data.content && data.content.nextTopics && (!data.nextTopics || data.nextTopics.length === 0)) {
        data.nextTopics = data.content.nextTopics;
        changed = true;
      }
      if (data.content && data.content.sections) {
        const extracted = [];
        data.content.sections.forEach(sec => {
          if (Array.isArray(sec.codeExamples)) {
            sec.codeExamples.forEach(ce => {
              extracted.push({
                title: ce.title || sec.title,
                language: ce.language || 'python',
                code: ce.code,
                explanation: ce.explanation || 'MLE ve MAP parametre kestirimi uygulaması.'
              });
            });
          }
        });
        if (extracted.length > 0 && (!data.codeExamples || data.codeExamples.length === 0)) {
          data.codeExamples = extracted;
          changed = true;
        }
      }
      if (!Array.isArray(data.quiz) || data.quiz.length === 0) {
        data.quiz = [
          {
            id: 'mle-map-q1',
            question: "Olasılık (Probability) ile Olabilirlik (Likelihood) arasındaki temel fark nedir?",
            options: [
              "Olasılıkta veri sabit, parametre değişkendir; Olabilirlikte tam tersidir",
              "Olasılıkta parametre sabit, veri değişkendir; Olabilirlikte veri sabit, parametre değişkendir",
              "İkisi de tamamen aynı matematiksel fonksiyondur ve hiçbir fark yoktur",
              "Likelihood her zaman 0 ile 1 arasındadır, olasılık ise sonsuza gidebilir"
            ],
            correctAnswer: 1,
            explanation: "Olasılık P(X|θ), sabit parametre verildiğinde verinin olasılığıdır. Olabilirlik L(θ|X) ise sabit veri karşısında parametrenin ne kadar olası olduğunu ölçer."
          },
          {
            id: 'mle-map-q2',
            question: "Neden parametre kestiriminde doğrudan Likelihood yerine Log-Likelihood tercih edilir?",
            options: [
              "Çarpımları toplamlara dönüştürerek sayısal kararlılık (underflow engelleme) ve kolay türev alma sağlar",
              "Logaritma fonksiyonun maksimum noktasının yerini değiştirir",
              "Sadece tek değişkenli problemlerde çalışır",
              "Matematiksel olarak daha havalı görünür"
            ],
            correctAnswer: 0,
            explanation: "Bağımsız gözlemlerin çarpımı çok küçük sayılar üretir. Logaritma monoton artandır (maksimumu korur), çarpımları toplama çevirir ve türev almayı kolaylaştırır."
          },
          {
            id: 'mle-map-q3',
            question: "Maksimum A Posteriori (MAP) yönteminin MLE'den en belirgin farkı ve avantajı nedir?",
            options: [
              "MAP parametreler hakkında önsel (prior) bilgi kullanmaz",
              "MAP prior dağılımı kullanarak düzenlileştirme (regularization) etkisi yaratır ve overfitting'i azaltır",
              "MAP her zaman MLE'den daha hızlı hesaplanır",
              "MAP sadece kategorik verilerde çalışır"
            ],
            correctAnswer: 1,
            explanation: "MAP, Bayes kuralını kullanarak prior P(θ) bilgisini dahil eder. Bu önsel bilgi, L2 (Ridge) veya L1 (Lasso) benzeri bir ceza terimi gibi davranarak aşırı öğrenmeyi engeller."
          }
        ];
        changed = true;
      }
    }

    // 7. Kod Örnekleri (codeExamples)
    if (!Array.isArray(data.codeExamples) || data.codeExamples.length === 0) {
      // İçerikten veya seviyelerden kod örneği ayıkla
      let foundBlocks = [];
      if (Array.isArray(data.levels)) {
        data.levels.forEach(lvl => {
          foundBlocks.push(...extractCodeBlocks(lvl.content));
        });
      }
      if (data.content && typeof data.content === 'object') {
        Object.values(data.content).forEach(val => {
          if (typeof val === 'string') foundBlocks.push(...extractCodeBlocks(val));
        });
      }

      if (foundBlocks.length > 0) {
        data.codeExamples = foundBlocks.slice(0, 3).map((b, i) => ({
          title: `${data.title} - Kod Örneği ${i + 1}`,
          language: b.language,
          code: b.code,
          explanation: `${data.title} konusunun pratik Python/kütüphane implementasyonu.`
        }));
      } else {
        // Yedek standart kod örneği
        data.codeExamples = [
          {
            title: `${data.title} - Başlangıç Kodu`,
            language: 'python',
            code: `# ${data.title} - Pratik Uygulama\nimport numpy as np\n\nprint("=== ${data.title} ===")\n# Temel matematiksel ve algoritmik uygulama örneği\ndata = np.array([1.0, 2.0, 3.0, 4.0, 5.0])\nresult = np.mean(data)\nprint(f"Hesaplanan ortalama: {result}")\n`,
            explanation: `${data.title} algoritmasının temel Python ve NumPy implementasyonu.`
          }
        ];
      }
      changed = true;
    }

    // 8. Quiz Normalizasyonu (correct -> correctAnswer ve ID atama)
    if (Array.isArray(data.quiz)) {
      data.quiz.forEach((q, idx) => {
        if (!q.id) {
          q.id = `${topicId}-q${idx + 1}`;
          changed = true;
        }
        if (q.correct !== undefined && q.correctAnswer === undefined) {
          q.correctAnswer = q.correct;
          delete q.correct;
          changed = true;
        }
        if (q.correct !== undefined && q.correctAnswer !== undefined) {
          delete q.correct;
          changed = true;
        }
        // Sınır kontrolü (0 <= correctAnswer < options.length)
        if (typeof q.correctAnswer === 'number' && Array.isArray(q.options)) {
          if (q.correctAnswer < 0) {
            q.correctAnswer = 0;
            changed = true;
          } else if (q.correctAnswer >= q.options.length) {
            q.correctAnswer = q.options.length - 1;
            changed = true;
          }
        }
      });
    }

    // 9. nextTopics, prerequisites ve relatedTopics Referans Onarımı
    const resolveList = (list) => {
      if (!Array.isArray(list)) return [];
      const resolved = [];
      list.forEach(item => {
        if (typeof item !== 'string') return;
        const mapped = allTopicIds.has(item) ? item : aliasMap[item];
        if (mapped && allTopicIds.has(mapped) && mapped !== topicId) {
          resolved.push(mapped);
        }
      });
      return Array.from(new Set(resolved));
    };

    const newPrereqs = resolveList(data.prerequisites);
    if (JSON.stringify(newPrereqs) !== JSON.stringify(data.prerequisites)) {
      data.prerequisites = newPrereqs;
      changed = true;
    }

    let nextList = Array.isArray(data.nextTopics) ? data.nextTopics : [];
    if (nextList.length === 0 && defaultNextTopics[topicId]) {
      nextList = defaultNextTopics[topicId];
    }
    const newNextTopics = resolveList(nextList);
    if (JSON.stringify(newNextTopics) !== JSON.stringify(data.nextTopics)) {
      data.nextTopics = newNextTopics;
      changed = true;
    }

    if (data.relatedTopics) {
      const newRelated = resolveList(data.relatedTopics);
      if (JSON.stringify(newRelated) !== JSON.stringify(data.relatedTopics)) {
        data.relatedTopics = newRelated;
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      modifiedCount++;
      console.log(`[UPDATED] ${filename}`);
    }
  });

  console.log(`\nNormalization complete! ${modifiedCount} files updated out of ${files.length}.`);
}

normalize();
