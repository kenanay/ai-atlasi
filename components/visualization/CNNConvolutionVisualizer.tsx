'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Play, RotateCcw, ChevronRight, Share2, Zap, Info, Check } from 'lucide-react';

interface CNNConvolutionVisualizerProps {
  title?: string;
}

const KERNELS = [
  {
    name: 'Edge Detection',
    kernel: [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]],
    description: 'Kenarları tespit eder',
  },
  {
    name: 'Sharpen',
    kernel: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]],
    description: 'Görüntüyü keskinleştirir',
  },
  {
    name: 'Blur',
    kernel: [[1/9, 1/9, 1/9], [1/9, 1/9, 1/9], [1/9, 1/9, 1/9]],
    description: 'Görüntüyü bulanıklaştırır',
  },
];

export function CNNConvolutionVisualizer({ title = 'CNN Convolution' }: CNNConvolutionVisualizerProps) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [kernelIdx, setKernelIdx] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stride] = useState(1);

  const selectedKernel = KERNELS[kernelIdx];
  const kernel = selectedKernel.kernel;
  const kernelSize = 3;

  useEffect(() => {
    const saved = localStorage.getItem('simulator-speed');
    if (saved) setSpeed(parseFloat(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('simulator-speed', speed.toString());
  }, [speed]);

  // 5x5 input image
  const inputImage = [
    [0.1, 0.2, 0.3, 0.8, 0.9],
    [0.2, 0.3, 0.4, 0.9, 1.0],
    [0.1, 0.2, 0.5, 0.7, 0.8],
    [0.0, 0.1, 0.4, 0.6, 0.7],
    [0.1, 0.2, 0.3, 0.5, 0.6],
  ];

  const outputSize = Math.floor((5 - kernelSize) / stride) + 1;

  const computeConvolution = (row: number, col: number): number => {
    let sum = 0;
    for (let i = 0; i < kernelSize; i++) {
      for (let j = 0; j < kernelSize; j++) {
        sum += inputImage[row + i][col + j] * kernel[i][j];
      }
    }
    return sum;
  };

  const featureMap: number[][] = [];
  for (let i = 0; i < outputSize; i++) {
    featureMap[i] = [];
    for (let j = 0; j < outputSize; j++) {
      featureMap[i][j] = computeConvolution(i * stride, j * stride);
    }
  }

  const maxSteps = outputSize * outputSize;
  const currentRow = Math.floor(step / outputSize);
  const currentCol = step % outputSize;
  const kernelRow = currentRow * stride;
  const kernelCol = currentCol * stride;

  useEffect(() => {
    if (isPlaying && step < maxSteps - 1) {
      const timer = setTimeout(() => setStep(step + 1), 800 / speed);
      return () => clearTimeout(timer);
    } else if (step >= maxSteps - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, step, maxSteps, speed]);

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

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('cnn-step', step.toString());
    url.searchParams.set('cnn-kernel', kernelIdx.toString());
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPixelColor = (value: number, isInput: boolean = true) => {
    if (isInput) {
      const intensity = Math.min(Math.max(value, 0), 1);
      const gray = Math.floor(intensity * 255);
      return `rgb(${gray}, ${gray}, ${gray})`;
    } else {
      const normalized = (value + 8) / 16;
      const clamped = Math.min(Math.max(normalized, 0), 1);
      if (clamped > 0.5) {
        const intensity = (clamped - 0.5) * 2;
        return `rgba(239, 68, 68, ${intensity})`;
      } else {
        const intensity = (0.5 - clamped) * 2;
        return `rgba(59, 130, 246, ${intensity})`;
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

  const tooltips = [
    'Kernel sol üst köşeden başlar',
    'Her pozisyonda element-wise çarpım yapılır',
    'Çarpımlar toplanarak tek değer elde edilir',
    'Kernel bir adım sağa kayar (stride=1)',
    'İşlem tüm pozisyonlar için tekrarlanır',
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-lg sm:text-xl">{title}</span>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={kernelIdx}
              onChange={(e) => {
                setKernelIdx(parseInt(e.target.value));
                setStep(0);
              }}
              className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              {KERNELS.map((k, idx) => (
                <option key={idx} value={idx}>{k.name}</option>
              ))}
            </select>

            <div className="flex items-center gap-1 text-xs">
              <Zap className="w-3 h-3" />
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded ${
                    speed === s ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <Button size="sm" onClick={handlePlay} disabled={isPlaying}>
              <Play className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{step >= maxSteps - 1 ? 'Tekrar' : 'Oynat'}</span>
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
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span>İlerleme: {step + 1} / {maxSteps}</span>
              <button
                onMouseEnter={() => setShowTooltip('progress')}
                onMouseLeave={() => setShowTooltip(null)}
                className="relative"
              >
                <Info className="w-3 h-3 text-gray-400 hover:text-blue-500" />
                {showTooltip === 'progress' && (
                  <div className="absolute z-50 bottom-full left-0 mb-2 w-56 p-2 bg-black text-white text-xs rounded shadow-lg">
                    {tooltips[Math.min(step, tooltips.length - 1)]}
                  </div>
                )}
              </button>
            </div>
            <span className="text-gray-500">Pozisyon: ({currentRow}, {currentCol})</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / maxSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Input Image */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold mb-2 text-center">
              Girdi Görüntüsü (5×5)
            </h4>
            <div className="inline-grid grid-cols-5 gap-0.5 border-2 border-gray-300 dark:border-gray-600 p-1 rounded mx-auto">
              {inputImage.flat().map((val, idx) => {
                const i = Math.floor(idx / 5);
                const j = idx % 5;
                const inRegion = isInKernelRegion(i, j);
                const kernelVal = getKernelValue(i, j);

                return (
                  <div
                    key={idx}
                    className={`w-8 h-8 sm:w-12 sm:h-12 flex flex-col items-center justify-center text-[10px] sm:text-xs font-mono rounded transition-all relative ${
                      inRegion ? 'ring-2 ring-yellow-400 scale-110 z-10' : ''
                    }`}
                    style={{
                      backgroundColor: getPixelColor(val, true),
                      color: val > 0.5 ? 'white' : 'black',
                    }}
                  >
                    <span>{val.toFixed(1)}</span>
                    {inRegion && kernelVal !== null && (
                      <span className="text-[8px] sm:text-[10px] text-yellow-400 font-bold">
                        ×{kernelVal.toFixed(1)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kernel */}
          <div className="flex flex-col items-center justify-center">
            <h4 className="text-xs sm:text-sm font-semibold mb-2">{selectedKernel.name}</h4>
            <div className="inline-grid grid-cols-3 gap-1 border-2 border-blue-500 p-2 rounded">
              {kernel.flat().map((val, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-[10px] sm:text-sm font-mono rounded font-bold"
                  style={{
                    backgroundColor: val > 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                    border: Math.abs(val) > 1 ? '2px solid green' : '1px solid gray',
                  }}
                >
                  {val.toFixed(2)}
                </div>
              ))}
            </div>
            <div className="mt-2 text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400">
              {selectedKernel.description}
            </div>
            <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-xs">
              <div className="font-mono text-center">
                Sonuç: <span className="font-bold">{computeCurrentSum().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Output Feature Map */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold mb-2 text-center">
              Feature Map (3×3)
            </h4>
            <div className="inline-grid grid-cols-3 gap-1 border-2 border-purple-500 p-2 rounded mx-auto">
              {featureMap.flat().map((val, idx) => {
                const i = Math.floor(idx / outputSize);
                const j = idx % outputSize;
                const isCurrent = i === currentRow && j === currentCol;
                const isComputed = idx <= step;

                return (
                  <div
                    key={idx}
                    className={`w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-[10px] sm:text-xs font-mono rounded transition-all ${
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
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-blue-500" />
            <span className="font-semibold">Evrişim Adımları:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-[10px] sm:text-xs ml-2">
            <li>Kernel, girdi görüntüsü üzerinde kaydırılır (stride={stride})</li>
            <li>Her pozisyonda element-wise çarpım yapılır</li>
            <li>Çarpımlar toplanarak tek bir değer elde edilir</li>
            <li>Bu değer feature map'te ilgili pozisyona yazılır</li>
          </ol>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-yellow-400 ring-2 ring-yellow-400"></div>
            <span>Aktif Bölge</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.6)' }}></div>
            <span>Yüksek</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.6)' }}></div>
            <span>Düşük</span>
          </div>
        </div>

        {/* Formula */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-2 sm:p-3 rounded-lg text-xs sm:text-sm overflow-x-auto">
          <p className="font-mono text-center whitespace-nowrap">
            Output[i,j] = Σ Σ Input[i+m, j+n] × Kernel[m,n]
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
