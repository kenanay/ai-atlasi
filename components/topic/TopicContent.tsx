'use client';

import { useState } from 'react';
import { Topic, TopicLevel } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MathFormulaList } from '@/components/ui/MathFormula';
import { NotesPanel } from './NotesPanel';
import { QuizPanel } from '@/components/quiz/QuizPanel';
import { FlashcardPanel } from '@/components/quiz/FlashcardPanel';
import { 
  Lightbulb, 
  AlertTriangle, 
  BookOpen, 
  Calculator,
  Code2,
  ExternalLink,
  FileText,
  Info,
  Brain,
  Layers
} from 'lucide-react';
import { LEVEL_INFO } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

interface TopicContentProps {
  topic: Topic;
  level: TopicLevel;
}

export function TopicContent({ topic, level }: TopicContentProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'notes' | 'quiz' | 'flashcards'>('content');
  const levelInfo = LEVEL_INFO[level];
  
  // Seviyeye göre içerik seç
  const getContentForLevel = () => {
    switch (level) {
      case 0: return topic.content?.level0_basic;
      case 1: return topic.content?.level1_beginner;
      case 2: return topic.content?.level2_application;
      case 3: return topic.content?.level3_advanced;
      case 4: return topic.content?.level4_expert;
      default: return topic.content?.level0_basic;
    }
  };
  
  const content = topic.levels?.find(item => item.level === level)?.content ?? getContentForLevel();

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 transition-colors">
      {/* Tabs */}
      <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-10 transition-colors">
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('content')}
              className={cn(
                'flex items-center gap-2 px-3 py-3 border-b-2 font-medium text-xs md:text-sm transition-colors cursor-pointer',
                activeTab === 'content'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <Info className="w-4 h-4" />
              İçerik
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={cn(
                'flex items-center gap-2 px-3 py-3 border-b-2 font-medium text-xs md:text-sm transition-colors cursor-pointer',
                activeTab === 'notes'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <FileText className="w-4 h-4" />
              Notlarım
            </button>
            {topic.quiz && topic.quiz.length > 0 && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={cn(
                  'flex items-center gap-2 px-3 py-3 border-b-2 font-medium text-xs md:text-sm transition-colors cursor-pointer',
                  activeTab === 'quiz'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                <Brain className="w-4 h-4" />
                Quiz
                <Badge variant="primary" className="text-[10px] px-1.5 py-0">{topic.quiz.length}</Badge>
              </button>
            )}
            {topic.flashcards && topic.flashcards.length > 0 && (
              <button
                onClick={() => setActiveTab('flashcards')}
                className={cn(
                  'flex items-center gap-2 px-3 py-3 border-b-2 font-medium text-xs md:text-sm transition-colors cursor-pointer',
                  activeTab === 'flashcards'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                <Layers className="w-4 h-4" />
                Flashcards
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{topic.flashcards.length}</Badge>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8 space-y-6">
        {activeTab === 'content' ? (
          <>
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge 
                  variant={level >= 3 ? 'danger' : level >= 2 ? 'warning' : 'primary'}
                >
                  {levelInfo.name}
                </Badge>
                <span className="text-xs text-slate-500 dark:text-slate-400">{levelInfo.description}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">{topic.title}</h1>
              <MarkdownRenderer content={content ?? 'Bu seviye için içerik henüz eklenmedi.'} />
            </div>

            {/* What Is It */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Bu Konu Nedir?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{topic.whatIsIt}</p>
              </CardContent>
            </Card>

            {/* Why Needed */}
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                  <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Neden Gerekli?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{topic.whyNeeded}</p>
              </CardContent>
            </Card>

            {/* Real World Analogy */}
            <Card className="border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-amber-900 dark:text-amber-200">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Günlük Hayattan Benzetme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-950 dark:text-amber-200/90 leading-relaxed italic text-sm">
                  &ldquo;{topic.realWorldAnalogy}&rdquo;
                </p>
              </CardContent>
            </Card>

            {/* Mathematics (Level 2+) */}
            {level >= 2 && topic.mathematics && topic.mathematics.formulas.length > 0 && (
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                    <Calculator className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Matematiksel Formüller
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MathFormulaList formulas={topic.mathematics.formulas} />
                </CardContent>
              </Card>
            )}

            {/* Algorithm (Level 2+) */}
            {level >= 2 && topic.algorithm && (
              <Card className="border-l-4 border-l-indigo-500">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                    <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Algoritma ve Mantık
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topic.algorithm.stepByStep && (
                    <div>
                      <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Adım Adım:</h4>
                      <ol className="space-y-2">
                        {topic.algorithm.stepByStep.map((step, index) => (
                          <li key={index} className="flex gap-3 items-start">
                            <span className="shrink-0 w-6 h-6 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                  
                  {topic.algorithm.complexity && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                      <span className="font-semibold text-slate-900 dark:text-slate-200">Zaman ve Alan Karmaşıklığı: </span>
                      <span className="text-blue-600 dark:text-blue-400 font-mono font-medium">{topic.algorithm.complexity}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Common Mistakes */}
            {topic.commonMistakes && topic.commonMistakes.length > 0 && (
              <Card className="border-l-4 border-l-rose-500 bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-rose-900 dark:text-rose-200">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    Sık Yapılan Hatalar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {topic.commonMistakes.map((mistake, index) => (
                      <li key={index} className="flex gap-2.5 items-start text-rose-950 dark:text-rose-200/90 text-sm">
                        <span className="text-rose-500 shrink-0">⚠️</span>
                        <span className="leading-relaxed">{typeof mistake === 'string' ? mistake : `${mistake.mistake} — ${mistake.why} Çözüm: ${mistake.fix}`}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* References */}
            {topic.references && topic.references.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                    <ExternalLink className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    Referanslar ve Kaynaklar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {topic.references.map((ref, index) => (
                      <li key={index}>
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs md:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 group"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          <span className="group-hover:underline underline-offset-2">{ref.title}</span>
                          <Badge variant="default" className="text-[10px] px-1.5 py-0">
                            {ref.type}
                          </Badge>
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-200 dark:border-slate-800">
              {topic.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </>
        ) : activeTab === 'notes' ? (
          <NotesPanel topicId={topic.id} />
        ) : activeTab === 'quiz' ? (
          <QuizPanel topic={topic} />
        ) : (
          <FlashcardPanel topic={topic} />
        )}
      </div>
    </div>
  );
}
