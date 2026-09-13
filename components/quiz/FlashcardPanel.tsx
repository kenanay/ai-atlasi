'use client';

import { useState, useEffect } from 'react';
import { Topic } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Shuffle, 
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Trophy
} from 'lucide-react';

interface FlashcardPanelProps {
  topic: Topic;
}

type CardStatus = 'learning' | 'known' | 'review';

interface CardProgress {
  cardIndex: number;
  status: CardStatus;
  reviewCount: number;
  lastReviewed?: Date;
}

export function FlashcardPanel({ topic }: FlashcardPanelProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState(topic.flashcards || []);
  const [progress, setProgress] = useState<CardProgress[]>(
    cards.map((_, index) => ({
      cardIndex: index,
      status: 'learning',
      reviewCount: 0,
    }))
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === '1' && isFlipped) {
        e.preventDefault();
        handleKnown(false);
      } else if (e.key === '2' && isFlipped) {
        e.preventDefault();
        handleKnown(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipped, currentCard]);

  if (!topic.flashcards || topic.flashcards.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400 text-sm">Bu konu için henüz flashcard hazırlanmamış.</p>
        </CardContent>
      </Card>
    );
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleKnown = (known: boolean) => {
    const newProgress = [...progress];
    newProgress[currentCard] = {
      ...newProgress[currentCard],
      status: known ? 'known' : 'review',
      reviewCount: newProgress[currentCard].reviewCount + 1,
      lastReviewed: new Date(),
    };
    setProgress(newProgress);
    
    // Auto advance to next card
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentCard(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setCards(topic.flashcards || []);
    setCurrentCard(0);
    setIsFlipped(false);
    setProgress(
      cards.map((_, index) => ({
        cardIndex: index,
        status: 'learning',
        reviewCount: 0,
      }))
    );
  };

  const card = cards[currentCard];
  const knownCount = progress.filter((p) => p.status === 'known').length;
  const reviewCount = progress.filter((p) => p.status === 'review').length;
  const learningCount = progress.filter((p) => p.status === 'learning').length;

  return (
    <div className="space-y-4">
      {/* Stats Card */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/40">
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{knownCount}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Bilinen</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/40">
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{reviewCount}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Tekrar</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/70 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-900/40">
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{learningCount}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Öğreniliyor</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                Flashcard {currentCard + 1} / {cards.length}
              </CardTitle>
              {progress[currentCard].status !== 'learning' && (
                <Badge 
                  variant={progress[currentCard].status === 'known' ? 'success' : 'warning'}
                  className="text-[10px]"
                >
                  {progress[currentCard].status === 'known' ? '✓ Biliniyor' : '↻ Tekrar'}
                </Badge>
              )}
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" variant="ghost" onClick={handleShuffle} title="Karıştır (S)" className="h-8 w-8 p-0">
                <Shuffle className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleReset} title="Sıfırla (R)" className="h-8 w-8 p-0">
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* İlerleme */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentCard + 1) / cards.length) * 100}%` }}
            />
          </div>

          {/* Kart - 3D Flip Animation */}
          <div
            onClick={handleFlip}
            className="relative cursor-pointer select-none min-h-[280px]"
            style={{ perspective: '1500px' }}
          >
            <div
              className="relative w-full h-full transition-all duration-700 ease-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Ön yüz */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 min-h-[280px] flex items-center justify-center rounded-2xl shadow-2xl hover:shadow-blue-500/30 transition-shadow"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-blue-200/90 mb-3 font-bold uppercase tracking-widest">KAVRAM / SORU</p>
                  <p className="text-xl md:text-2xl font-bold leading-relaxed max-w-md mx-auto">
                    {card.front}
                  </p>
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <p className="text-xs text-blue-200/70 font-medium">
                      💡 Cevabı görmek için tıklayın veya <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-[10px]">Space</kbd>
                    </p>
                  </div>
                </div>
              </div>

              {/* Arka yüz */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-8 min-h-[280px] flex items-center justify-center rounded-2xl shadow-2xl hover:shadow-emerald-500/30 transition-shadow"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✓</span>
                  </div>
                  <p className="text-xs text-emerald-200/90 mb-3 font-bold uppercase tracking-widest">AÇIKLAMA / CEVAP</p>
                  <p className="text-base md:text-lg font-medium leading-relaxed max-w-md mx-auto">
                    {card.back}
                  </p>
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <p className="text-xs text-emerald-200/70 font-medium">
                      🔄 Tekrar tıklayın veya kartı değerlendirin 👇
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biliyorum / Bilmiyorum Butonları (sadece flipped'de) */}
          {isFlipped && (
            <div className="grid grid-cols-2 gap-3 animate-fade-in">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleKnown(false)}
                className="gap-2 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <ThumbsDown className="w-4 h-4" />
                <span>Tekrar İncele <kbd className="ml-1 px-1.5 py-0.5 bg-rose-100 dark:bg-rose-900/40 rounded text-[10px]">1</kbd></span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleKnown(true)}
                className="gap-2 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Biliyorum <kbd className="ml-1 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 rounded text-[10px]">2</kbd></span>
              </Button>
            </div>
          )}

          {/* Navigasyon */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={cards.length === 1}
              className="gap-1 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Önceki</span>
              <kbd className="ml-1 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] hidden sm:inline">←</kbd>
            </Button>

            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isFlipped ? '🔄 Cevap' : '❓ Soru'}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={cards.length === 1}
              className="gap-1 text-xs"
            >
              <span className="hidden sm:inline">Sonraki</span>
              <kbd className="ml-1 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] hidden sm:inline">→</kbd>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* İpuçları */}
      <Card className="bg-purple-50/60 dark:bg-purple-950/20 border-purple-200/60 dark:border-purple-900/40">
        <CardContent className="py-3.5 px-4">
          <div className="flex items-start gap-2.5">
            <Trophy className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div className="text-xs text-purple-950 dark:text-purple-200">
              <p className="font-bold mb-1.5">Flashcard Kullanım İpuçları:</p>
              <ul className="space-y-1 text-purple-900/80 dark:text-purple-300/80">
                <li>• <kbd className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 rounded text-[10px]">Space</kbd> veya <kbd className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 rounded text-[10px]">Enter</kbd>: Kartı çevir</li>
                <li>• <kbd className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 rounded text-[10px]">←</kbd> <kbd className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 rounded text-[10px]">→</kbd>: Önceki/Sonraki kart</li>
                <li>• <kbd className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 rounded text-[10px]">1</kbd> <kbd className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 rounded text-[10px]">2</kbd>: Kartı değerlendir</li>
                <li>• Aralıklı tekrar (spaced repetition) ile kalıcı öğrenme!</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
