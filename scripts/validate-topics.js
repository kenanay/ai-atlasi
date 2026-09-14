const fs = require('fs');
const path = require('path');
const { z } = require('zod');

const TOPICS_DIR = path.join(__dirname, '..', 'data', 'topics');

// 1. Zod Şeması Tanımları
const TopicCategoryEnum = z.enum([
  'linear-algebra',
  'calculus',
  'probability',
  'statistics',
  'optimization',
  'data-preparation',
  'classical-ml',
  'supervised-learning',
  'unsupervised-learning',
  'reinforcement-learning',
  'neural-networks',
  'deep-learning',
  'cnn',
  'rnn',
  'transformer',
  'generative-models',
  'generative-ai',
  'computer-vision',
  'nlp',
  'natural-language-processing',
  'llm',
  'mlops',
  'hardware',
  'advanced',
  'applications',
  'fundamentals',
  'math',
  'matematik',
  'computer-science',
  'python',
]);

const TopicLevelSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

const CodeExampleSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  language: z.string().min(1, 'Dil belirtilmelidir'),
  code: z.string().min(5, 'Kod en az 5 karakter olmalıdır'),
  explanation: z.string().min(3, 'Açıklama en az 3 karakter olmalıdır'),
  runnable: z.boolean().optional(),
});

const QuizQuestionSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(5, 'Soru metni en az 5 karakter olmalıdır'),
  type: z.enum(['multiple-choice', 'true-false', 'code-completion', 'mathematical']).optional(),
  options: z.array(z.string()).min(2, 'En az 2 seçenek olmalıdır'),
  correctAnswer: z.union([z.number().int().min(0), z.string()]),
  explanation: z.string(),
  difficulty: TopicLevelSchema.optional(),
}).refine((q) => {
  return !('correct' in q);
}, {
  message: "'correct' alanı yerine 'correctAnswer' kullanılmalıdır.",
}).refine((q) => {
  if (typeof q.correctAnswer === 'number') {
    return q.correctAnswer >= 0 && q.correctAnswer < q.options.length;
  }
  return true;
}, {
  message: 'correctAnswer seçenekler (options) indeks sınırları içinde olmalıdır.',
});

const LevelItemSchema = z.object({
  level: TopicLevelSchema,
  title: z.string(),
  content: z.string().min(10, 'Seviye içeriği en az 10 karakter olmalıdır'),
  keyPoints: z.array(z.string()).optional(),
});

const ContentLevelsSchema = z.object({
  level0_basic: z.string().optional(),
  level1_beginner: z.string().optional(),
  level2_application: z.string().optional(),
  level3_advanced: z.string().optional(),
  level4_expert: z.string().optional(),
  overview: z.string().optional(),
  introduction: z.string().optional(),
}).catchall(z.unknown());

const VisualizationSchema = z.object({
  id: z.string().optional(),
  type: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  component: z.string().optional(),
  params: z.record(z.string(), z.unknown()).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

const TopicSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'ID sadece küçük harf, rakam ve tire içermelidir'),
  title: z.string().min(2, 'Başlık en az 2 karakter olmalıdır'),
  shortTitle: z.string().optional(),
  category: TopicCategoryEnum,
  level: TopicLevelSchema,
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  estimatedTime: z.number().int().positive('Tahmini süre pozitif tamsayı olmalıdır'),
  description: z.string().optional(),
  subcategory: z.string().optional(),

  // Seviyeler ve içerik
  levels: z.array(LevelItemSchema).optional(),
  content: ContentLevelsSchema.optional(),

  // Çekirdek alanlar (Zorunlu diziler)
  tags: z.array(z.string()).min(1, 'En az bir etiket tanımlanmalıdır'),
  prerequisites: z.array(z.string()),
  nextTopics: z.array(z.string()),
  codeExamples: z.array(CodeExampleSchema),
  quiz: z.array(QuizQuestionSchema),

  // Açıklamalar ve kavramsal içerik
  whatIsIt: z.string().optional(),
  whyNeeded: z.string().optional(),
  realWorldAnalogy: z.string().optional(),
  commonMistakes: z.union([
    z.array(z.object({
      mistake: z.string(),
      why: z.string(),
      fix: z.string(),
    })),
    z.array(z.string()),
  ]).optional(),

  // Matematiksel içerik
  mathematics: z.object({
    formulas: z.array(z.string()).optional(),
    proofs: z.array(z.string()).optional(),
    derivations: z.array(z.string()).optional(),
  }).passthrough().optional(),

  formulas: z.array(z.object({
    title: z.string(),
    latex: z.string(),
    explanation: z.string(),
  })).optional(),

  // Algoritmik içerik
  algorithm: z.object({
    pseudocode: z.string().optional(),
    stepByStep: z.array(z.string()).optional(),
    complexity: z.string().optional(),
  }).passthrough().optional(),

  // Görselleştirmeler ve öğrenme materyalleri
  visualizations: z.array(VisualizationSchema).optional(),
  flashcards: z.array(z.object({
    front: z.string(),
    back: z.string(),
  })).optional(),
  learningObjectives: z.array(z.string()).optional(),
  glossary: z.array(z.object({
    term: z.string(),
    definition: z.string(),
  })).optional(),

  // Referanslar & Ek Metadata
  references: z.array(z.object({
    title: z.string(),
    url: z.string().optional(),
    author: z.string().optional(),
    year: z.number().optional(),
    type: z.string().optional(),
    description: z.string().optional(),
  }).passthrough()).optional(),

  relatedTopics: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough().refine((data) => {
  const hasContent = !!data.content && Object.keys(data.content).length > 0;
  const hasLevels = Array.isArray(data.levels) && data.levels.length > 0;
  const hasWhatIsIt = !!data.whatIsIt;
  return hasContent || hasLevels || hasWhatIsIt;
}, {
  message: "Konu içeriği bulunamadı: 'content', 'levels' veya 'whatIsIt' alanlarından en az biri tanımlı olmalıdır.",
});

// 2. Doğrulama Motoru
function validateAllTopics() {
  console.log('='.repeat(70));
  console.log('🔍 AI Atlası - Zod Konu Doğrulama ve Bütünlük Denetimi');
  console.log('='.repeat(70));

  if (!fs.existsSync(TOPICS_DIR)) {
    console.error(`❌ HATA: Konu dizini bulunamadı: ${TOPICS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(TOPICS_DIR).filter(f => f.endsWith('.json'));
  const allTopicIds = new Set(files.map(f => f.replace('.json', '')));
  console.log(`📁 Toplam taranacak konu sayısı: ${files.length}\n`);

  const errors = [];
  let passedCount = 0;

  files.forEach(filename => {
    const filePath = path.join(TOPICS_DIR, filename);
    const expectedId = filename.replace('.json', '');
    let fileErrors = [];

    // JSON Parse Kontrolü
    let rawContent;
    let data;
    try {
      rawContent = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(rawContent);
    } catch (parseErr) {
      errors.push({
        file: filename,
        message: `JSON ayrıştırma hatası: ${parseErr.message}`
      });
      return;
    }

    // Dosya adı ile ID eşleşme kontrolü
    if (data.id !== expectedId) {
      fileErrors.push(`Dosya adı (${filename}) ile konu ID'si ('${data.id}') uyuşmuyor.`);
    }

    // Zod Şema Doğrulaması
    const result = TopicSchema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach(issue => {
        const fieldPath = issue.path.length > 0 ? issue.path.join('.') : 'root';
        fileErrors.push(`[${fieldPath}] ${issue.message}`);
      });
    }

    // Referans Bütünlüğü Kontrolleri (prerequisites, nextTopics, relatedTopics)
    const checkRefs = (field, list) => {
      if (Array.isArray(list)) {
        list.forEach((refId) => {
          if (!allTopicIds.has(refId)) {
            fileErrors.push(`[${field}] Geçersiz/kırık konu referansı: '${refId}'`);
          }
          if (refId === expectedId) {
            fileErrors.push(`[${field}] Konu kendine referans veremez: '${refId}'`);
          }
        });
      }
    };

    checkRefs('prerequisites', data.prerequisites);
    checkRefs('nextTopics', data.nextTopics);
    checkRefs('relatedTopics', data.relatedTopics);

    if (fileErrors.length > 0) {
      errors.push({
        file: filename,
        messages: fileErrors
      });
    } else {
      passedCount++;
    }
  });

  // Sonuç Raporu
  console.log('-'.repeat(70));
  if (errors.length === 0) {
    console.log(`✅ BAŞARILI: Tüm ${passedCount} konu dosyası Zod şemasına ve referans bütünlüğü kurallarına tam olarak uygundur!`);
    console.log('='.repeat(70));
    process.exit(0);
  } else {
    console.error(`❌ DOĞRULAMA HATASI: ${errors.length} dosyada hata tespit edildi:\n`);
    errors.forEach(err => {
      console.error(`📄 Dosya: ${err.file}`);
      if (err.message) {
        console.error(`   ⚠️ ${err.message}`);
      }
      if (err.messages) {
        err.messages.forEach(msg => console.error(`   ⚠️ ${msg}`));
      }
      console.error('');
    });
    console.error('='.repeat(70));
    console.error('Lütfen derlemeden önce yukarıdaki şema ve referans hatalarını giderin.');
    process.exit(1);
  }
}

validateAllTopics();
