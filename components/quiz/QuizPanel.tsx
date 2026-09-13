'use client';

import { useState } from 'react';
import { Topic } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { addQuizScore } from '@/lib/progress';
import { calculateQuizScore } from '@/lib/utils';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Trophy,
  RotateCcw,
  Play
} from 'lucide-react';

interface QuizPanelProps {
  topic: Topic;
}

export function QuizPanel({ topic }: QuizPanelProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = topic.quiz;

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400 text-sm">Bu konu için henüz quiz eklenmemiş.</p>
        </CardContent>
      </Card>
    );
  }

  const handleStart = () => {
    setIsStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setUserAnswers([]);
    setIsCompleted(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswered) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isAnswered) return;
    
    setIsAnswered(true);
    setUserAnswers([...userAnswers, selectedAnswer]);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Quiz tamamlandı
      setIsCompleted(true);
      const correctCount = userAnswers.filter(
        (answer, index) => answer === questions[index].correctAnswer
      ).length;
      
      // Skoru kaydet
      addQuizScore(topic.id, correctCount, questions.length);
    }
  };

  const currentQ = questions[currentQuestion];
  const correctCount = userAnswers.filter(
    (answer, index) => answer === questions[index].correctAnswer
  ).length;
  
  const result = isCompleted ? calculateQuizScore(correctCount, questions.length) : null;

  // Başlangıç ekranı
  if (!isStarted) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Konu Değerlendirme Testi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
              {topic.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs mb-6 max-w-sm mx-auto">
              Öğrendiklerinizi pekiştirmek için {questions.length} soruluk testi çözün.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-6 max-w-sm mx-auto">
              <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 p-3 rounded-xl">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{questions.length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Soru</p>
              </div>
              <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 p-3 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ~{Math.ceil(questions.length * 1.5)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Tahmini Dakika</p>
              </div>
            </div>
            
            <Button size="lg" onClick={handleStart} className="gap-2 font-semibold">
              <Play className="w-4 h-4 fill-current" />
              Teste Başla
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sonuç ekranı
  if (isCompleted && result) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Quiz Tamamlandı!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-4">
            <div className={`w-20 h-20 mx-auto mb-3 rounded-2xl flex items-center justify-center font-extrabold text-3xl border ${
              result.score >= 80 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' 
                : result.score >= 60 
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400' 
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
            }`}>
              {result.grade}
            </div>
            
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
              %{result.score}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs mb-3">
              {correctCount} / {questions.length} doğru cevap
            </p>
            <Badge 
              variant={result.score >= 80 ? 'success' : result.score >= 60 ? 'warning' : 'danger'}
              className="text-xs px-3 py-1"
            >
              {result.message}
            </Badge>
          </div>

          {/* Soru detayları */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Soru Detayları:</h4>
            {questions.map((q, index) => {
              const userAnswer = index < userAnswers.length ? userAnswers[index] : selectedAnswer;
              const isCorrect = userAnswer === q.correctAnswer;
              
              return (
                <div
                  key={index}
                  className={`p-3 rounded-xl border ${
                    isCorrect 
                      ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20' 
                      : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Soru {index + 1}</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">{q.question}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleStart} className="flex-1 gap-2 text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              Tekrar Dene
            </Button>
            <Button variant="outline" onClick={() => setIsStarted(false)} className="flex-1 text-xs">
              Testi Kapat
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Soru ekranı
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
            Soru {currentQuestion + 1} / {questions.length}
          </CardTitle>
          <Badge variant="default" className="text-[10px]">
            Zorluk: Seviye {currentQ.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* İlerleme Çubuğu */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Soru */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
          <p className="text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">{currentQ.question}</p>
        </div>

        {/* Cevaplar */}
        <div className="space-y-2.5">
          {currentQ.options?.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQ.correctAnswer;
            const showResult = isAnswered;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs md:text-sm cursor-pointer ${
                  showResult
                    ? isCorrect
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200'
                      : isSelected
                      ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 opacity-60'
                    : isSelected
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-xs font-semibold ${
                      showResult
                        ? isCorrect
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : isSelected
                          ? 'border-rose-500 bg-rose-500 text-white'
                          : 'border-slate-300 dark:border-slate-700 text-slate-500'
                        : isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {showResult && isCorrect ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : showResult && isSelected && !isCorrect ? (
                      <XCircle className="w-3.5 h-3.5" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Açıklama */}
        {isAnswered && (
          <div className="bg-blue-50/70 dark:bg-blue-950/30 border-l-4 border-blue-500 dark:border-blue-400 border border-blue-200/60 dark:border-blue-900/40 p-4 rounded-r-xl">
            <p className="font-bold text-xs uppercase tracking-wider text-blue-900 dark:text-blue-300 mb-1">Açıklama</p>
            <p className="text-xs md:text-sm text-blue-950 dark:text-blue-200/90 leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex gap-3 pt-2">
          {!isAnswered ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="flex-1 text-xs"
            >
              Cevabı Kontrol Et
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="flex-1 text-xs">
              {currentQuestion < questions.length - 1 ? 'Sonraki Soruya Geç' : 'Sonuçları Görüntüle'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
