'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Play, RotateCcw, ChevronRight } from 'lucide-react';

interface CNNConvolutionVisualizerProps {
  title?: string;
}

export function CNNConvolutionVisualizer({ title = 'CNN Convolution' }: CNNConvolutionVisualizerProps) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stride] = useState(1);

  // 5x5 input image (grayscale values 0-1)
  const inputImage = [
    [0.1, 0.2, 0.3, 0.8, 0.9],
    [0.2, 0.3, 0.4, 0.9, 1.0],
    [0.1, 0.2, 0.5, 0.7, 0.8],
    [0.0, 0.1, 0.4, 0.6, 0.7],
    [0.1, 0.2, 0.3, 0.5, 0.6],
  ];

  // 3x3 Edge detection kernel
  const kernel = [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1],
  ];

  const kernelSize = 3;
  const outputSize = Math.floor((5 - kernelSize) / stride) + 1; // 3x3 output

  // Compute convolution
  const computeConvolution = (row: number, col: number): number => {
    let sum = 0;
    for (let i = 0; i < kernelSize; i++) {
      for (let j = 0; j < kernelSize; j++) {
        sum += inputImage[row + i][col + j] * kernel[i][j];
      }
    }
    return sum;
  };

  // Generate output feature map
  const featureMap: number[][] = [];
  for (let i = 0; i < outputSize; i++) {
    featureMap[i] = [];
    for (let j = 0; j < outputSize; j++) {
      featureMap[i][j] = computeConvolution(i * stride, j * stride);
    }
  }

  const maxSteps = outputSize * outputSize; // 9 positions
  const currentRow = Math.floor(step / outputSize);
  const currentCol = step % outputSize;
  const kernelRow = currentRow * stride;
  const kernelCol = currentCol * stride;

  useEffect(() => {
    if (isPlaying && step < maxSteps - 1) {
      const timer = setTimeout(() => setStep(step + 1), 800);
      return () => clearTimeout(timer);
    } else if (step >= maxSteps - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, step, maxSteps]);

  const handlePlay = () => {
    if (step >= maxSteps - 1) {
      setStep(0);
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const getPixelColor = (value: number, isInput: boolean = true) => {
    if (isInput) {
      const intensity = Math.min(Math.max(value, 0), 1);
      const gray = Math.floor(intensity * 255);
      return `rgb(${gray}, ${gray}, ${gray})`;
    } else {
      // Feature map: use blue-red gradient
      const normalized = (value + 8) / 16; // Normalize to 0-1
      const clamped = Math.min(Math.max(normalized, 0), 1);
      if (clamped > 0.5) {
        const intensity = (clamped - 0.5) * 2;
        return `rgba(239, 68, 68, ${intensity})`; // Red for high values
      } else {
        const intensity = (0.5 - clamped) * 2;
        return `rgba(59, 130, 246, ${intensity})`; // Blue for low values
      }
    }
  };

  const isInKernelRegion = (i: number, j: number): boolean => {
    return (
      i >= kernelRow &&
      i < kernelRow + kernelSize &&
      j >= kernelCol &&
      j < kernelCol + kernelSize
    );
  };

  const getKernelValue = (i: number, j: number): number | null => {
    if (!isInKernelRegion(i, j)) return null;
    return kernel[i - kernelRow][j - kernelCol];
  };

  const computeCurrentSum = (): number => {
    let sum = 0;
    for (let i = 0; i < kernelSize; i++) {
      for (let j = 0; j < kernelSize; j++) {
        const imgVal = inputImage[kernelRow + i][kernelCol + j];
        const kernelVal = kernel[i][j];
        sum += imgVal * kernelVal;
      }
    }
    return sum;
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
              disabled={isPlaying}
            >
              <Play className="w-4 h-4 mr-1" />
              {step >= maxSteps - 1 ? 'Tekrar' : 'Oynat'}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>İlerleme: {step + 1} / {maxSteps}</span>
            <span className="text-gray-500">Pozisyon: ({currentRow}, {currentCol})</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / maxSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Image */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-center">
              Girdi Görüntüsü (5×5)
            </h4>
            <div className="inline-grid grid-cols-5 gap-0.5 border-2 border-gray-300 dark:border-gray-600 p-1 rounded">
              {inputImage.flat().map((val, idx) => {
                const i = Math.floor(idx / 5);
                const j = idx % 5;
                const inRegion = isInKernelRegion(i, j);
                const kernelVal = getKernelValue(i, j);

                return (
                  <div
                    key={idx}
                    className={`w-12 h-12 flex flex-col items-center justify-center text-xs font-mono rounded transition-all relative ${
                      inRegion ? 'ring-2 ring-yellow-400 scale-110 z-10' : ''
                    }`}
                    style={{
                      backgroundColor: getPixelColor(val, true),
                      color: val > 0.5 ? 'white' : 'black',
                    }}
                  >
                    <span>{val.toFixed(1)}</span>
                    {inRegion && kernelVal !== null && (
                      <span className="text-[10px] text-yellow-400 font-bold">
                        ×{kernelVal}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kernel */}
          <div className="flex flex-col items-center justify-center">
            <h4 className="text-sm font-semibold mb-2">Filtre/Kernel (3×3)</h4>
            <div className="inline-grid grid-cols-3 gap-1 border-2 border-blue-500 p-2 rounded">
              {kernel.flat().map((val, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 flex items-center justify-center text-sm font-mono rounded font-bold"
                  style={{
                    backgroundColor: val > 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                    border: val === 8 ? '2px solid green' : '1px solid gray',
                  }}
                >
                  {val}
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-center text-gray-600 dark:text-gray-400">
              Edge Detection Filter
            </div>
            <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-xs">
              <div className="font-mono text-center">
                Sonuç: <span className="font-bold">{computeCurrentSum().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Output Feature Map */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-center">
              Feature Map (3×3)
            </h4>
            <div className="inline-grid grid-cols-3 gap-1 border-2 border-purple-500 p-2 rounded">
              {featureMap.flat().map((val, idx) => {
                const i = Math.floor(idx / outputSize);
                const j = idx % outputSize;
                const isCurrent = i === currentRow && j === currentCol;
                const isComputed = idx <= step;

                return (
                  <div
                    key={idx}
                    className={`w-14 h-14 flex items-center justify-center text-xs font-mono rounded transition-all ${
                      isCurrent ? 'ring-2 ring-yellow-400 scale-110' : ''
                    } ${!isComputed ? 'opacity-30' : ''}`}
                    style={{
                      backgroundColor: isComputed ? getPixelColor(val, false) : '#e5e7eb',
                      color: isComputed && Math.abs(val) > 2 ? 'white' : 'black',
                    }}
                  >
                    {isComputed ? val.toFixed(1) : '?'}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-blue-500" />
            <span className="font-semibold">Evrişim Adımları:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-xs ml-2">
            <li>Kernel, girdi görüntüsü üzerinde kaydırılır (stride={stride})</li>
            <li>Her pozisyonda element-wise çarpım yapılır</li>
            <li>Çarpımlar toplanarak tek bir değer elde edilir</li>
            <li>Bu değer feature map'te ilgili pozisyona yazılır</li>
          </ol>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-yellow-400 ring-2 ring-yellow-400"></div>
            <span>Aktif Bölge</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.6)' }}></div>
            <span>Yüksek Aktivasyon</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.6)' }}></div>
            <span>Düşük Aktivasyon</span>
          </div>
        </div>

        {/* Formula */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg text-sm">
          <p className="font-mono text-center text-xs">
            Output[i,j] = Σ Σ Input[i+m, j+n] × Kernel[m,n]
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
