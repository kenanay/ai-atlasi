'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Play, RotateCcw, ChevronRight, Share2, Zap, Info, Copy, Check } from 'lucide-react';

interface AttentionVisualizerProps {
  title?: string;
}

const EXAMPLES = [
  {
    name: 'Türkçe Basit',
    tokens: ['Ben', 'okulu', 'seviyorum'],
    Q: [[0.8, 0.2, 0.3, 0.1], [0.3, 0.9, 0.2, 0.4], [0.2, 0.3, 0.8, 0.6]],
    K: [[0.7, 0.3, 0.2, 0.1], [0.4, 0.8, 0.3, 0.2], [0.3, 0.2, 0.9, 0.5]],
    V: [[1.0, 0.5, 0.2, 0.3], [0.4, 1.0, 0.6, 0.2], [0.3, 0.4, 1.0, 0.8]],
  },
  {
    name: 'İngilizce',
    tokens: ['I', 'love', 'AI'],
    Q: [[0.9, 0.1, 0.4, 0.2], [0.2, 0.8, 0.3, 0.5], [0.4, 0.3, 0.9, 0.7]],
    K: [[0.8, 0.2, 0.3, 0.1], [0.3, 0.9, 0.4, 0.3], [0.5, 0.4, 0.8, 0.6]],
    V: [[0.9, 0.6, 0.3, 0.4], [0.5, 0.9, 0.7, 0.3], [0.4, 0.5, 0.9, 0.9]],
  },
  {
    name: 'Uzun Cümle',
    tokens: ['Yapay', 'zeka', 'harika'],
    Q: [[0.7, 0.3, 0.2, 0.4], [0.4, 0.7, 0.5, 0.3], [0.3, 0.4, 0.7, 0.8]],
    K: [[0.6, 0.4, 0.3, 0.2], [0.5, 0.6, 0.4, 0.4], [0.4, 0.3, 0.8, 0.7]],
    V: [[0.8, 0.4, 0.3, 0.5], [0.6, 0.8, 0.5, 0.4], [0.5, 0.6, 0.8, 0.7]],
  },
];

export function AttentionVisualizer({ title = 'Attention Mechanism' }: AttentionVisualizerProps) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exampleIdx, setExampleIdx] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const example = EXAMPLES[exampleIdx];
  const { tokens, Q, K, V } = example;
  const d_k = 4;

  // Load speed from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('simulator-speed');
    if (saved) setSpeed(parseFloat(saved));
  }, []);

  // Save speed to localStorage
  useEffect(() => {
    localStorage.setItem('simulator-speed', speed.toString());
  }, [speed]);

  const computeScores = () => {
    const scores: number[][] = [];
    for (let i = 0; i < 3; i++) {
      scores[i] = [];
      for (let j = 0; j < 3; j++) {
        let sum = 0;
        for (let k = 0; k < d_k; k++) {
          sum += Q[i][k] * K[j][k];
        }
        scores[i][j] = sum / Math.sqrt(d_k);
      }
    }
    return scores;
  };

  const softmax = (arr: number[]) => {
    const max = Math.max(...arr);
    const exps = arr.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
  };

  const scores = computeScores();
  const attentionWeights = scores.map(row => softmax(row));

  const computeOutput = () => {
    const output: number[][] = [];
    for (let i = 0; i < 3; i++) {
      output[i] = [];
      for (let k = 0; k < d_k; k++) {
        let sum = 0;
        for (let j = 0; j < 3; j++) {
          sum += attentionWeights[i][j] * V[j][k];
        }
        output[i][k] = sum;
      }
    }
    return output;
  };

  const output = computeOutput();

  const steps = [
    { 
      title: 'Başlangıç', 
      desc: 'Girdi tokenleri',
      tooltip: 'Cümle kelimelere (token) ayrılır. Her token bir vektör olarak temsil edilir.'
    },
    { 
      title: 'Q, K, V', 
      desc: 'Query, Key, Value hesapla',
      tooltip: 'Her token için 3 farklı projeksiyon yapılır: Query (soru), Key (anahtar), Value (değer)'
    },
    { 
      title: 'QK^T', 
      desc: 'Attention Scores',
      tooltip: 'Query ve Key matrisleri çarpılır. Her token diğer tokenlerle ne kadar ilişkili?'
    },
    { 
      title: 'Softmax', 
      desc: 'Olasılık dağılımı',
      tooltip: 'Skorlar normalize edilir (0-1 arası, toplamları 1). Bu attention ağırlıklarıdır.'
    },
    { 
      title: 'Attention × V', 
      desc: 'Çıktı hesapla',
      tooltip: 'Attention ağırlıkları ile Value matrisi çarpılır. Her token diğerlerinden bilgi toplar.'
    },
  ];

  const handlePlay = () => {
    setIsPlaying(true);
    let currentStep = step;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setIsPlaying(false);
        currentStep = steps.length - 1;
      }
      setStep(currentStep);
    }, 2000 / speed);
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('attention-step', step.toString());
    url.searchParams.set('attention-example', exampleIdx.toString());
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getColorIntensity = (value: number, max: number = 1) => {
    const intensity = Math.min(Math.abs(value) / max, 1);
    return value >= 0
      ? `rgba(59, 130, 246, ${intensity})`
      : `rgba(239, 68, 68, ${intensity})`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-lg sm:text-xl">{title}</span>
          <div className="flex flex-wrap items-center gap-2">
            {/* Example Selector */}
            <select
              value={exampleIdx}
              onChange={(e) => {
                setExampleIdx(parseInt(e.target.value));
                setStep(0);
              }}
              className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              {EXAMPLES.map((ex, idx) => (
                <option key={idx} value={idx}>{ex.name}</option>
              ))}
            </select>

            {/* Speed Control */}
            <div className="flex items-center gap-1 text-xs">
              <Zap className="w-3 h-3" />
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded ${
                    speed === s
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <Button size="sm" onClick={handlePlay} disabled={isPlaying || step === steps.length - 1}>
              <Play className="w-4 h-4 mr-1" />
              Oynat
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleShare}>
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Progress */}
        <div className="flex items-center gap-1 sm:gap-2">
          {steps.map((s, idx) => (
            <React.Fragment key={idx}>
              <div
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  idx <= step ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
              {idx < steps.length - 1 && (
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <h3 className="font-bold text-base sm:text-lg">{steps[step].title}</h3>
            <button
              onMouseEnter={() => setShowTooltip(`step-${step}`)}
              onMouseLeave={() => setShowTooltip(null)}
              className="relative"
            >
              <Info className="w-4 h-4 text-gray-400 hover:text-blue-500" />
              {showTooltip === `step-${step}` && (
                <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-black text-white text-xs rounded shadow-lg">
                  {steps[step].tooltip}
                </div>
              )}
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {steps[step].desc}
          </p>
        </div>

        {/* Visualization */}
        <div className="space-y-4">
          {/* Step 0: Tokens */}
          {step >= 0 && (
            <div>
              <h4 className="text-xs font-semibold mb-2 text-gray-500">Girdi Tokenleri</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {tokens.map((token, idx) => (
                  <div
                    key={idx}
                    className="px-3 sm:px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg font-medium text-sm sm:text-base"
                  >
                    {token}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Q, K, V Matrices */}
          {step >= 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Query (Q)', data: Q, color: 'blue' },
                { name: 'Key (K)', data: K, color: 'green' },
                { name: 'Value (V)', data: V, color: 'purple' },
              ].map(({ name, data }) => (
                <div key={name}>
                  <h4 className="text-xs font-semibold mb-2 text-gray-500">{name}</h4>
                  <div className="grid grid-cols-4 gap-0.5 sm:gap-1">
                    {data.flat().map((val, idx) => (
                      <div
                        key={idx}
                        className="aspect-square flex items-center justify-center text-[10px] sm:text-xs font-mono rounded"
                        style={{
                          backgroundColor: getColorIntensity(val),
                          color: Math.abs(val) > 0.5 ? 'white' : 'black',
                        }}
                      >
                        {val.toFixed(1)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Attention Scores */}
          {step >= 2 && (
            <div>
              <h4 className="text-xs font-semibold mb-2 text-gray-500">
                Attention Scores (QK^T / √d_k)
              </h4>
              <div className="max-w-xs mx-auto">
                <div className="grid grid-cols-3 gap-1">
                  {scores.flat().map((score, idx) => (
                    <div
                      key={idx}
                      className="aspect-square flex items-center justify-center text-xs sm:text-sm font-mono rounded"
                      style={{
                        backgroundColor: getColorIntensity(score, 2),
                        color: Math.abs(score) > 1 ? 'white' : 'black',
                      }}
                    >
                      {score.toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Softmax */}
          {step >= 3 && (
            <div>
              <h4 className="text-xs font-semibold mb-2 text-gray-500">
                Attention Weights (Softmax)
              </h4>
              <div className="space-y-2">
                {attentionWeights.map((weights, rowIdx) => (
                  <div key={rowIdx} className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-medium w-16 sm:w-20">
                      {tokens[rowIdx]}:
                    </span>
                    <div className="flex-1 flex gap-1">
                      {weights.map((weight, colIdx) => (
                        <div
                          key={colIdx}
                          className="flex-1 h-6 sm:h-8 rounded flex items-center justify-center text-[10px] sm:text-xs font-bold text-white transition-all"
                          style={{
                            backgroundColor: `rgba(59, 130, 246, ${weight})`,
                            minWidth: `${weight * 100}%`,
                          }}
                        >
                          {(weight * 100).toFixed(0)}%
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Output */}
          {step >= 4 && (
            <div>
              <h4 className="text-xs font-semibold mb-2 text-gray-500">
                Çıktı (Attention × V)
              </h4>
              <div className="max-w-xs mx-auto">
                <div className="grid grid-cols-4 gap-0.5 sm:gap-1">
                  {output.flat().map((val, idx) => (
                    <div
                      key={idx}
                      className="aspect-square flex items-center justify-center text-[10px] sm:text-xs font-mono rounded"
                      style={{
                        backgroundColor: getColorIntensity(val),
                        color: Math.abs(val) > 0.5 ? 'white' : 'black',
                      }}
                    >
                      {val.toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-center mt-2 text-gray-600 dark:text-gray-400">
                Her token diğer tokenlere ağırlıklı olarak "dikkat etti"
              </p>
            </div>
          )}
        </div>

        {/* Formula */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg text-xs sm:text-sm overflow-x-auto">
          <p className="font-mono text-center whitespace-nowrap">
            Attention(Q, K, V) = softmax(QK^T / √d_k) × V
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
