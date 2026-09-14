'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Play, RotateCcw, ChevronRight } from 'lucide-react';

interface AttentionVisualizerProps {
  title?: string;
}

export function AttentionVisualizer({ title = 'Attention Mechanism' }: AttentionVisualizerProps) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Örnek cümle ve kelimeler
  const tokens = ['Ben', 'okulu', 'seviyorum'];
  const d_k = 4; // Key/Query dimension

  // Basitleştirilmiş Q, K, V matrisleri (3 token × 4 dim)
  const Q = [
    [0.8, 0.2, 0.3, 0.1],
    [0.3, 0.9, 0.2, 0.4],
    [0.2, 0.3, 0.8, 0.6],
  ];

  const K = [
    [0.7, 0.3, 0.2, 0.1],
    [0.4, 0.8, 0.3, 0.2],
    [0.3, 0.2, 0.9, 0.5],
  ];

  const V = [
    [1.0, 0.5, 0.2, 0.3],
    [0.4, 1.0, 0.6, 0.2],
    [0.3, 0.4, 1.0, 0.8],
  ];

  // QK^T hesapla (attention scores)
  const computeScores = () => {
    const scores: number[][] = [];
    for (let i = 0; i < 3; i++) {
      scores[i] = [];
      for (let j = 0; j < 3; j++) {
        let sum = 0;
        for (let k = 0; k < d_k; k++) {
          sum += Q[i][k] * K[j][k];
        }
        scores[i][j] = sum / Math.sqrt(d_k); // Scaled
      }
    }
    return scores;
  };

  // Softmax uygula
  const softmax = (arr: number[]) => {
    const max = Math.max(...arr);
    const exps = arr.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
  };

  const scores = computeScores();
  const attentionWeights = scores.map(row => softmax(row));

  // Weighted sum (Attention × V)
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
    { title: 'Başlangıç', desc: 'Girdi tokenleri' },
    { title: 'Q, K, V', desc: 'Query, Key, Value hesapla' },
    { title: 'QK^T', desc: 'Attention Scores' },
    { title: 'Softmax', desc: 'Olasılık dağılımı' },
    { title: 'Attention × V', desc: 'Çıktı hesapla' },
  ];

  const handlePlay = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const getColorIntensity = (value: number, max: number = 1) => {
    const intensity = Math.min(Math.abs(value) / max, 1);
    return value >= 0
      ? `rgba(59, 130, 246, ${intensity})` // Blue
      : `rgba(239, 68, 68, ${intensity})`; // Red
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handlePlay}
              disabled={isPlaying || step === steps.length - 1}
            >
              <Play className="w-4 h-4 mr-1" />
              Oynat
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {steps.map((s, idx) => (
            <React.Fragment key={idx}>
              <div
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  idx <= step ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
              {idx < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="text-center">
          <h3 className="font-bold text-lg">{steps[step].title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {steps[step].desc}
          </p>
        </div>

        {/* Visualization */}
        <div className="space-y-4">
          {/* Step 0: Tokens */}
          {step >= 0 && (
            <div>
              <h4 className="text-xs font-semibold mb-2 text-gray-500">
                Girdi Tokenleri
              </h4>
              <div className="flex justify-center gap-2">
                {tokens.map((token, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg font-medium"
                  >
                    {token}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Q, K, V Matrices */}
          {step >= 1 && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Query (Q)', data: Q, color: 'blue' },
                { name: 'Key (K)', data: K, color: 'green' },
                { name: 'Value (V)', data: V, color: 'purple' },
              ].map(({ name, data, color }) => (
                <div key={name}>
                  <h4 className="text-xs font-semibold mb-2 text-gray-500">
                    {name}
                  </h4>
                  <div className="grid grid-cols-4 gap-0.5">
                    {data.flat().map((val, idx) => (
                      <div
                        key={idx}
                        className="aspect-square flex items-center justify-center text-xs font-mono rounded"
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
                      className="aspect-square flex items-center justify-center text-sm font-mono rounded"
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

          {/* Step 3: Softmax (Attention Weights) */}
          {step >= 3 && (
            <div>
              <h4 className="text-xs font-semibold mb-2 text-gray-500">
                Attention Weights (Softmax)
              </h4>
              <div className="space-y-2">
                {attentionWeights.map((weights, rowIdx) => (
                  <div key={rowIdx} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-20">
                      {tokens[rowIdx]}:
                    </span>
                    <div className="flex-1 flex gap-1">
                      {weights.map((weight, colIdx) => (
                        <div
                          key={colIdx}
                          className="flex-1 h-8 rounded flex items-center justify-center text-xs font-bold text-white transition-all"
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
                <div className="grid grid-cols-4 gap-0.5">
                  {output.flat().map((val, idx) => (
                    <div
                      key={idx}
                      className="aspect-square flex items-center justify-center text-xs font-mono rounded"
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
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg text-sm">
          <p className="font-mono text-center">
            Attention(Q, K, V) = softmax(QK^T / √d_k) × V
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
