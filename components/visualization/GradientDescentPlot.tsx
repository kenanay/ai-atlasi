'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Play, Pause, RotateCcw, SkipForward, ChevronRight } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface GradientDescentPlotProps {
  title?: string;
}

type FunctionType = 'quadratic' | 'cubic' | 'rastrigin';

export function GradientDescentPlot({
  title = 'Gradient Descent Simülasyonu'
}: GradientDescentPlotProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [learningRate, setLearningRate] = useState(0.1);
  const [startX, setStartX] = useState(4);
  const [functionType, setFunctionType] = useState<FunctionType>('quadratic');
  const [stepByStep, setStepByStep] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(200);
  const [history, setHistory] = useState<{ x: number; y: number }[]>([{ x: 4, y: 16 }]);

  // Fonksiyon tanımları
  const functions = {
    quadratic: {
      f: (x: number) => x * x,
      gradient: (x: number) => 2 * x,
      range: [-5, 5] as [number, number],
      yRange: [-1, 26] as [number, number],
      name: 'f(x) = x²',
      description: 'Basit konveks fonksiyon - tek minimum'
    },
    cubic: {
      f: (x: number) => x * x * x - 3 * x,
      gradient: (x: number) => 3 * x * x - 3,
      range: [-3, 3] as [number, number],
      yRange: [-3, 3] as [number, number],
      name: 'f(x) = x³ - 3x',
      description: 'Non-konveks fonksiyon - lokal minimumlar'
    },
    rastrigin: {
      f: (x: number) => 10 + x * x - 10 * Math.cos(2 * Math.PI * x),
      gradient: (x: number) => 2 * x + 20 * Math.PI * Math.sin(2 * Math.PI * x),
      range: [-5, 5] as [number, number],
      yRange: [-1, 30] as [number, number],
      name: 'Rastrigin (1D)',
      description: 'Çok sayıda lokal minimum - zor optimizasyon'
    }
  };

  const currentFunction = functions[functionType];
  const { f, gradient } = currentFunction;

  // X değerleri için fonksiyon değerleri
  const xRange = Array.from({ length: 200 }, (_, i) => 
    currentFunction.range[0] + i * (currentFunction.range[1] - currentFunction.range[0]) / 199
  );
  const yRange = xRange.map(f);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && history.length > 0 && step < 100) {
      interval = setInterval(() => {
        const lastPoint = history[history.length - 1];
        const grad = gradient(lastPoint.x);
        const newX = lastPoint.x - learningRate * grad;
        
        // Sınırları kontrol et
        if (newX < currentFunction.range[0] || newX > currentFunction.range[1]) {
          setIsPlaying(false);
          return;
        }
        
        const newY = f(newX);
        
        setHistory(prev => [...prev, { x: newX, y: newY }]);
        setStep(prev => prev + 1);
        
        // Konverjans kontrolü
        if (Math.abs(grad) < 0.001 || Math.abs(newX - lastPoint.x) < 0.0001) {
          setIsPlaying(false);
        }
        
        // Step-by-step modda otomatik duraklat
        if (stepByStep) {
          setIsPlaying(false);
        }
      }, animationSpeed);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, history, learningRate, step, f, gradient, stepByStep, animationSpeed, currentFunction.range]);

  const handleReset = () => {
    setIsPlaying(false);
    setStep(0);
    const initialY = f(startX);
    setHistory([{ x: startX, y: initialY }]);
  };

  const handlePlayPause = () => {
    if (step >= 100) {
      handleReset();
      setTimeout(() => setIsPlaying(true), 100);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNextStep = () => {
    if (step < 100 && history.length > 0) {
      const lastPoint = history[history.length - 1];
      const grad = gradient(lastPoint.x);
      const newX = lastPoint.x - learningRate * grad;
      
      if (newX >= currentFunction.range[0] && newX <= currentFunction.range[1]) {
        const newY = f(newX);
        setHistory(prev => [...prev, { x: newX, y: newY }]);
        setStep(prev => prev + 1);
      }
    }
  };

  const handleFunctionChange = (newFunc: FunctionType) => {
    setFunctionType(newFunc);
    setIsPlaying(false);
    setStep(0);
    
    // Yeni fonksiyon için uygun başlangıç noktası
    const newStart = newFunc === 'cubic' ? 2 : newFunc === 'rastrigin' ? 4.5 : 4;
    setStartX(newStart);
    setHistory([{ x: newStart, y: functions[newFunc].f(newStart) }]);
    
    // Öğrenme oranını ayarla
    if (newFunc === 'rastrigin') {
      setLearningRate(0.01);
    } else if (newFunc === 'cubic') {
      setLearningRate(0.05);
    } else {
      setLearningRate(0.1);
    }
  };

  // Plotly traces
  const traces = [
    // Fonksiyon eğrisi
    {
      type: 'scatter' as const,
      mode: 'lines' as const,
      x: xRange,
      y: yRange,
      line: {
        color: functionType === 'rastrigin' ? '#8B5CF6' : functionType === 'cubic' ? '#EC4899' : '#3B82F6',
        width: 3,
      },
      name: currentFunction.name,
    },
    // Gradient descent yolu
    {
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      x: history.map(p => p.x),
      y: history.map(p => p.y),
      line: {
        color: '#EF4444',
        width: 2,
        dash: 'dot' as const,
      },
      marker: {
        size: 6,
        color: '#EF4444',
        line: {
          color: isDark ? '#1e293b' : '#ffffff',
          width: 1
        }
      },
      name: 'GD Yolu',
    },
    // Başlangıç noktası
    {
      type: 'scatter' as const,
      mode: 'markers+text' as const,
      x: [history[0].x],
      y: [history[0].y],
      marker: {
        size: 12,
        color: '#F59E0B',
        symbol: 'circle',
        line: {
          color: '#ffffff',
          width: 2
        }
      },
      text: ['Başlangıç'],
      textposition: 'top center' as const,
      textfont: {
        size: 10,
        color: isDark ? '#f1f5f9' : '#0f172a',
        family: 'monospace'
      },
      name: 'Başlangıç',
      showlegend: false
    },
    // Mevcut nokta
    {
      type: 'scatter' as const,
      mode: 'markers+text' as const,
      x: [history[history.length - 1].x],
      y: [history[history.length - 1].y],
      marker: {
        size: 16,
        color: '#10B981',
        symbol: 'star',
        line: {
          color: '#ffffff',
          width: 2
        }
      },
      text: [`Adım ${step}`],
      textposition: 'bottom center' as const,
      textfont: {
        size: 11,
        color: isDark ? '#f1f5f9' : '#0f172a',
        family: 'monospace',
        weight: 'bold' as const
      },
      name: 'Mevcut',
      showlegend: false
    },
  ];

  const layout = {
    title: {
      text: '',
      font: { size: 14, color: isDark ? '#f1f5f9' : '#0f172a' }
    },
    xaxis: {
      range: currentFunction.range,
      title: { text: 'x', font: { color: isDark ? '#94a3b8' : '#64748b', size: 12 } },
      showgrid: true,
      gridcolor: isDark ? '#1e293b' : '#e2e8f0',
      zeroline: true,
      zerolinewidth: 2,
      zerolinecolor: isDark ? '#475569' : '#94a3b8',
      tickfont: { color: isDark ? '#94a3b8' : '#64748b', size: 10 },
    },
    yaxis: {
      range: currentFunction.yRange,
      title: { text: 'f(x)', font: { color: isDark ? '#94a3b8' : '#64748b', size: 12 } },
      showgrid: true,
      gridcolor: isDark ? '#1e293b' : '#e2e8f0',
      zeroline: true,
      zerolinewidth: 2,
      zerolinecolor: isDark ? '#475569' : '#94a3b8',
      tickfont: { color: isDark ? '#94a3b8' : '#64748b', size: 10 },
    },
    plot_bgcolor: isDark ? '#090d16' : '#F9FAFB',
    paper_bgcolor: isDark ? '#0f172a' : '#FFFFFF',
    margin: { l: 50, r: 20, t: 10, b: 45 },
    hovermode: 'closest' as const,
    legend: {
      x: 0.02,
      y: 0.98,
      xanchor: 'left' as const,
      yanchor: 'top' as const,
      bgcolor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      bordercolor: isDark ? '#334155' : '#cbd5e1',
      borderwidth: 1,
      font: { color: isDark ? '#f1f5f9' : '#0f172a', size: 10 }
    },
  };

  const config = {
    displayModeBar: false,
    responsive: true,
  };

  return (
    <Card>
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</CardTitle>
          <Badge variant={step >= 100 ? 'warning' : isPlaying ? 'success' : 'default'} className="text-[10px]">
            {step >= 100 ? 'Tamamlandı' : isPlaying ? 'Çalışıyor' : 'Durakladı'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-3">
          {/* Fonksiyon Seçimi */}
          <div className="flex gap-2">
            {(['quadratic', 'cubic', 'rastrigin'] as FunctionType[]).map((func) => (
              <button
                key={func}
                onClick={() => handleFunctionChange(func)}
                disabled={isPlaying}
                className={`
                  flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                  ${functionType === func
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }
                  ${isPlaying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {functions[func].name.split('=')[0].trim()}
              </button>
            ))}
          </div>

          {/* Fonksiyon Açıklaması */}
          <div className="text-[11px] text-center bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-2 rounded-lg">
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
              {currentFunction.name}
            </span>
            <span className="text-slate-500 dark:text-slate-400 mx-2">•</span>
            <span className="text-slate-600 dark:text-slate-300">
              {currentFunction.description}
            </span>
          </div>

          {/* Kontrol Paneli */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl space-y-2.5">
            {/* Ana Kontroller */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handlePlayPause}
                className="gap-1.5 text-xs h-8 px-3 flex-1"
                variant="primary"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    Duraklat
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {step >= 100 ? 'Yeniden' : 'Başlat'}
                  </>
                )}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleNextStep}
                disabled={isPlaying || step >= 100}
                className="gap-1.5 text-xs h-8 px-3"
                title="Tek adım ilerle"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                className="gap-1.5 text-xs h-8 px-2.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>

              <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={stepByStep}
                  onChange={(e) => setStepByStep(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-blue-600 cursor-pointer"
                />
                <span className="whitespace-nowrap font-medium">Adım Adım</span>
              </label>
            </div>

            {/* Öğrenme Oranı */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Öğrenme Oranı (η)
                </label>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded">
                  {learningRate.toFixed(3)}
                </span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.5"
                step="0.001"
                value={learningRate}
                onChange={(e) => {
                  setLearningRate(parseFloat(e.target.value));
                  if (!isPlaying) handleReset();
                }}
                className="w-full accent-blue-600 cursor-pointer h-2"
                disabled={isPlaying}
              />
            </div>

            {/* Başlangıç Noktası */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Başlangıç Noktası (x₀)
                </label>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded">
                  {startX.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={currentFunction.range[0]}
                max={currentFunction.range[1]}
                step="0.1"
                value={startX}
                onChange={(e) => {
                  const newStart = parseFloat(e.target.value);
                  setStartX(newStart);
                  if (!isPlaying) {
                    setStep(0);
                    setHistory([{ x: newStart, y: f(newStart) }]);
                  }
                }}
                className="w-full accent-amber-600 cursor-pointer h-2"
                disabled={isPlaying}
              />
            </div>

            {/* Animasyon Hızı */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Animasyon Hızı
                </label>
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded">
                  {animationSpeed}ms
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2"
              />
            </div>
          </div>

          {/* Grafik */}
          <div className="w-full rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg" style={{ height: '360px' }}>
            <Plot
              data={traces}
              layout={layout}
              config={config}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler
            />
          </div>

          {/* İstatistikler */}
          {history.length > 0 && (
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-900/40 p-2.5 rounded-xl text-center">
                <span className="text-blue-600 dark:text-blue-400 block text-[10px] uppercase font-bold tracking-wide">Adım</span>
                <span className="font-mono font-bold text-lg text-blue-900 dark:text-blue-100">{step}</span>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-900/40 p-2.5 rounded-xl text-center">
                <span className="text-emerald-600 dark:text-emerald-400 block text-[10px] uppercase font-bold tracking-wide">x</span>
                <span className="font-mono font-bold text-lg text-emerald-900 dark:text-emerald-100">{history[history.length - 1].x.toFixed(3)}</span>
              </div>
              <div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/30 dark:to-violet-900/20 border border-violet-200 dark:border-violet-900/40 p-2.5 rounded-xl text-center">
                <span className="text-violet-600 dark:text-violet-400 block text-[10px] uppercase font-bold tracking-wide">f(x)</span>
                <span className="font-mono font-bold text-lg text-violet-900 dark:text-violet-100">{history[history.length - 1].y.toFixed(3)}</span>
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/30 dark:to-rose-900/20 border border-rose-200 dark:border-rose-900/40 p-2.5 rounded-xl text-center">
                <span className="text-rose-600 dark:text-rose-400 block text-[10px] uppercase font-bold tracking-wide">∇f(x)</span>
                <span className="font-mono font-bold text-lg text-rose-900 dark:text-rose-100">{gradient(history[history.length - 1].x).toFixed(3)}</span>
              </div>
            </div>
          )}

          {/* Açıklama */}
          <div className="text-xs bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/60 dark:border-blue-900/40 p-3 rounded-xl">
            <p className="font-bold text-blue-900 dark:text-blue-300 mb-1.5 flex items-center gap-1.5">
              <SkipForward className="w-3.5 h-3.5" />
              Güncelleme Kuralı
            </p>
            <p className="text-blue-950 dark:text-blue-200/90 leading-relaxed font-mono text-[11px] bg-white/50 dark:bg-slate-900/50 p-2 rounded border border-blue-200/40 dark:border-blue-800/40">
              x<sub>yeni</sub> = x<sub>eski</sub> - η × ∇f(x<sub>eski</sub>)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
