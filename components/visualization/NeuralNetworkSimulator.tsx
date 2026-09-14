'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Play, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';

interface NeuralNetworkSimulatorProps {
  title?: string;
}

export function NeuralNetworkSimulator({ title = 'Neural Network Simulator' }: NeuralNetworkSimulatorProps) {
  const [mode, setMode] = useState<'forward' | 'backward'>('forward');
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Network architecture: 2 input -> 3 hidden -> 1 output
  const [weights1] = useState([
    [0.5, -0.3, 0.8],
    [0.2, 0.6, -0.4],
  ]); // 2x3

  const [weights2] = useState([[0.7], [-0.5], [0.9]]); // 3x1
  const [bias1] = useState([0.1, -0.2, 0.3]);
  const [bias2] = useState([0.2]);

  // Training example
  const input = [0.8, 0.3];
  const target = 0.9;
  const learningRate = 0.1;

  // Forward pass calculations
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const sigmoidDerivative = (x: number) => {
    const s = sigmoid(x);
    return s * (1 - s);
  };

  // Hidden layer
  const z1 = weights1[0].map((_, j) =>
    input.reduce((sum, inp, i) => sum + inp * weights1[i][j], 0) + bias1[j]
  );
  const a1 = z1.map(sigmoid);

  // Output layer
  const z2 = weights2.reduce((sum, w, i) => sum + a1[i] * w[0], 0) + bias2[0];
  const output = sigmoid(z2);

  // Loss
  const loss = Math.pow(target - output, 2) / 2;

  // Backward pass
  const dL_dOutput = output - target;
  const dOutput_dZ2 = sigmoidDerivative(z2);
  const dZ2_dW2 = a1;
  const dZ2_dA1 = weights2.map(w => w[0]);

  const dL_dZ2 = dL_dOutput * dOutput_dZ2;
  const dL_dW2 = dZ2_dW2.map(a => a * dL_dZ2);
  const dL_dB2 = dL_dZ2;

  const dL_dA1 = dZ2_dA1.map(w => w * dL_dZ2);
  const dA1_dZ1 = z1.map(sigmoidDerivative);
  const dL_dZ1 = dL_dA1.map((dA, i) => dA * dA1_dZ1[i]);

  const dL_dW1 = weights1.map((row, i) =>
    row.map((_, j) => input[i] * dL_dZ1[j])
  );
  const dL_dB1 = dL_dZ1;

  const maxSteps = mode === 'forward' ? 4 : 5;

  useEffect(() => {
    setStep(0);
  }, [mode]);

  const handlePlay = () => {
    setIsPlaying(true);
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= maxSteps) {
        clearInterval(interval);
        setIsPlaying(false);
      }
      setStep(currentStep);
    }, 1500);
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const getWeightColor = (weight: number, isGradient: boolean = false) => {
    const absWeight = Math.abs(weight);
    const maxAbs = isGradient ? 0.3 : 1;
    const intensity = Math.min(absWeight / maxAbs, 1);
    
    if (isGradient) {
      return weight < 0
        ? `rgba(34, 197, 94, ${intensity})` // Green for negative gradient (good update)
        : `rgba(239, 68, 68, ${intensity})`; // Red for positive gradient
    }
    
    return weight >= 0
      ? `rgba(59, 130, 246, ${intensity})` // Blue for positive
      : `rgba(239, 68, 68, ${intensity})`; // Red for negative
  };

  const getActivationColor = (activation: number) => {
    const intensity = Math.min(activation, 1);
    return `rgba(168, 85, 247, ${intensity})`; // Purple
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <span>{title}</span>
          <div className="flex gap-2">
            <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
              <button
                onClick={() => setMode('forward')}
                className={`px-3 py-1 text-sm flex items-center gap-1 ${
                  mode === 'forward'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
                Forward
              </button>
              <button
                onClick={() => setMode('backward')}
                className={`px-3 py-1 text-sm flex items-center gap-1 ${
                  mode === 'backward'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Backward
              </button>
            </div>
            <Button size="sm" onClick={handlePlay} disabled={isPlaying || step === maxSteps}>
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
        {/* Architecture: 2-3-1 Network */}
        <div className="flex items-center justify-center gap-8">
          {/* Input Layer */}
          <div className="flex flex-col gap-4">
            <div className="text-xs font-semibold text-center text-gray-500">Input</div>
            {input.map((val, idx) => (
              <div
                key={idx}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                  step >= 0 && mode === 'forward'
                    ? 'border-purple-500 scale-110'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{
                  backgroundColor: step >= 0 && mode === 'forward' ? getActivationColor(val) : 'white',
                  color: step >= 0 && mode === 'forward' && val > 0.5 ? 'white' : 'black',
                }}
              >
                {val.toFixed(1)}
              </div>
            ))}
          </div>

          {/* Weights 1 */}
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-center text-gray-500">
              {mode === 'forward' ? 'W1' : 'dW1'}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(mode === 'forward' ? weights1.flat() : dL_dW1.flat()).map((w, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 rounded flex items-center justify-center text-xs font-mono transition-all ${
                    (mode === 'forward' && step >= 1) || (mode === 'backward' && step >= 4)
                      ? 'scale-110 border-2 border-yellow-400'
                      : ''
                  }`}
                  style={{
                    backgroundColor: getWeightColor(w, mode === 'backward'),
                    color: Math.abs(w) > 0.4 ? 'white' : 'black',
                  }}
                >
                  {w.toFixed(2)}
                </div>
              ))}
            </div>
          </div>

          {/* Hidden Layer */}
          <div className="flex flex-col gap-4">
            <div className="text-xs font-semibold text-center text-gray-500">Hidden</div>
            {a1.map((val, idx) => (
              <div
                key={idx}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                  (mode === 'forward' && step >= 2) || (mode === 'backward' && step >= 3)
                    ? 'border-purple-500 scale-110'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{
                  backgroundColor:
                    (mode === 'forward' && step >= 2) || (mode === 'backward' && step >= 3)
                      ? getActivationColor(val)
                      : 'white',
                  color:
                    ((mode === 'forward' && step >= 2) || (mode === 'backward' && step >= 3)) && val > 0.5
                      ? 'white'
                      : 'black',
                }}
              >
                {val.toFixed(2)}
              </div>
            ))}
          </div>

          {/* Weights 2 */}
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-center text-gray-500">
              {mode === 'forward' ? 'W2' : 'dW2'}
            </div>
            <div className="flex flex-col gap-1">
              {(mode === 'forward' ? weights2.flat() : dL_dW2).map((w, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 rounded flex items-center justify-center text-xs font-mono transition-all ${
                    (mode === 'forward' && step >= 3) || (mode === 'backward' && step >= 2)
                      ? 'scale-110 border-2 border-yellow-400'
                      : ''
                  }`}
                  style={{
                    backgroundColor: getWeightColor(w, mode === 'backward'),
                    color: Math.abs(w) > 0.4 ? 'white' : 'black',
                  }}
                >
                  {w.toFixed(2)}
                </div>
              ))}
            </div>
          </div>

          {/* Output Layer */}
          <div className="flex flex-col gap-4">
            <div className="text-xs font-semibold text-center text-gray-500">Output</div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                (mode === 'forward' && step >= 4) || (mode === 'backward' && step >= 1)
                  ? 'border-purple-500 scale-110'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              style={{
                backgroundColor:
                  (mode === 'forward' && step >= 4) || (mode === 'backward' && step >= 1)
                    ? getActivationColor(output)
                    : 'white',
                color:
                  ((mode === 'forward' && step >= 4) || (mode === 'backward' && step >= 1)) && output > 0.5
                    ? 'white'
                    : 'black',
              }}
            >
              {output.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-2">
          {mode === 'forward' ? (
            <>
              <div className="flex justify-between text-sm">
                <span>Hedef:</span>
                <span className="font-mono font-bold">{target.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Çıktı:</span>
                <span className="font-mono font-bold">{output.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Kayıp (MSE):</span>
                <span className="font-mono font-bold text-red-600">{loss.toFixed(4)}</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm mb-2">
                <span className="font-semibold">Gradyanlar:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>∂L/∂W2: {dL_dW2[0].toFixed(3)}</div>
                <div>∂L/∂b2: {dL_dB2.toFixed(3)}</div>
                <div>∂L/∂W1: {dL_dW1[0][0].toFixed(3)}</div>
                <div>∂L/∂b1: {dL_dB1[0].toFixed(3)}</div>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Yeşil = Ağırlık azalacak (iyi), Kırmızı = Ağırlık artacak
              </div>
            </>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.7)' }}></div>
            <span>Pozitif</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.7)' }}></div>
            <span>Negatif</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(168, 85, 247, 0.7)' }}></div>
            <span>Aktivasyon</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
