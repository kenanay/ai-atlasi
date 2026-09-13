'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface KMeansAnimatorProps {
  title?: string;
}

interface Point {
  x: number;
  y: number;
  cluster: number;
}

export function KMeansAnimator({
  title = 'K-Means Clustering Animasyonu'
}: KMeansAnimatorProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [k, setK] = useState(3);
  const [numPoints, setNumPoints] = useState(150);
  const [data, setData] = useState<Point[]>([]);
  const [centroids, setCentroids] = useState<Point[]>([]);
  const [history, setHistory] = useState<{ data: Point[], centroids: Point[] }[]>([]);
  const [converged, setConverged] = useState(false);

  useEffect(() => {
    initializeData();
  }, [k, numPoints]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && !converged) {
      interval = setInterval(() => {
        runKMeansStep();
      }, 800);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, data, centroids, converged]);

  const initializeData = () => {
    // Generate clustered data
    const points: Point[] = [];
    const clusterCenters = [
      { x: -3, y: -3 },
      { x: 3, y: -3 },
      { x: 0, y: 3 },
      { x: -4, y: 2 },
      { x: 4, y: 2 }
    ];

    for (let i = 0; i < numPoints; i++) {
      const centerIdx = Math.floor(Math.random() * Math.min(k, 5));
      const center = clusterCenters[centerIdx];
      points.push({
        x: center.x + (Math.random() - 0.5) * 2,
        y: center.y + (Math.random() - 0.5) * 2,
        cluster: -1
      });
    }

    // Random initial centroids
    const initialCentroids: Point[] = [];
    for (let i = 0; i < k; i++) {
      initialCentroids.push({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
        cluster: i
      });
    }

    setData(points);
    setCentroids(initialCentroids);
    setHistory([{ data: points, centroids: initialCentroids }]);
    setStep(0);
    setConverged(false);
    setIsPlaying(false);
  };

  const distance = (p1: Point, p2: Point) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  };

  const runKMeansStep = () => {
    // Assignment step
    const newData = data.map(point => {
      let minDist = Infinity;
      let closestCluster = 0;
      
      centroids.forEach((centroid, i) => {
        const dist = distance(point, centroid);
        if (dist < minDist) {
          minDist = dist;
          closestCluster = i;
        }
      });
      
      return { ...point, cluster: closestCluster };
    });

    // Update step
    const newCentroids = centroids.map((_, i) => {
      const clusterPoints = newData.filter(p => p.cluster === i);
      if (clusterPoints.length === 0) return centroids[i];
      
      const sumX = clusterPoints.reduce((sum, p) => sum + p.x, 0);
      const sumY = clusterPoints.reduce((sum, p) => sum + p.y, 0);
      
      return {
        x: sumX / clusterPoints.length,
        y: sumY / clusterPoints.length,
        cluster: i
      };
    });

    // Check convergence
    const centroidMoved = newCentroids.some((c, i) => 
      distance(c, centroids[i]) > 0.01
    );

    setData(newData);
    setCentroids(newCentroids);
    setHistory(prev => [...prev, { data: newData, centroids: newCentroids }]);
    setStep(prev => prev + 1);

    if (!centroidMoved) {
      setConverged(true);
      setIsPlaying(false);
    }
  };

  const reset = () => {
    initializeData();
  };

  const nextStep = () => {
    if (!converged) {
      runKMeansStep();
    }
  };

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Data points traces
  const dataTraces = Array.from({ length: k }, (_, i) => ({
    type: 'scatter' as const,
    mode: 'markers' as const,
    x: data.filter(p => p.cluster === i).map(p => p.x),
    y: data.filter(p => p.cluster === i).map(p => p.y),
    marker: {
      size: 8,
      color: colors[i % colors.length],
      opacity: 0.6
    },
    name: `Cluster ${i + 1}`,
    showlegend: true
  }));

  // Unassigned points
  if (step === 0) {
    dataTraces.push({
      type: 'scatter' as const,
      mode: 'markers' as const,
      x: data.map(p => p.x),
      y: data.map(p => p.y),
      marker: {
        size: 8,
        color: '#94a3b8',
        opacity: 0.6
      },
      name: 'Unassigned',
      showlegend: true
    });
  }

  // Centroids trace
  const centroidsTrace = {
    type: 'scatter' as const,
    mode: 'markers' as const,
    x: centroids.map(c => c.x),
    y: centroids.map(c => c.y),
    marker: {
      size: 20,
      color: centroids.map((_, i) => colors[i % colors.length]),
      symbol: 'x',
      line: {
        color: '#000000',
        width: 3
      }
    },
    name: 'Centroids',
    showlegend: true
  };

  const layout = {
    xaxis: {
      range: [-7, 7],
      gridcolor: isDark ? '#334155' : '#e2e8f0',
      zerolinecolor: isDark ? '#475569' : '#94a3b8',
      tickfont: { color: isDark ? '#94a3b8' : '#64748b' }
    },
    yaxis: {
      range: [-7, 7],
      gridcolor: isDark ? '#334155' : '#e2e8f0',
      zerolinecolor: isDark ? '#475569' : '#94a3b8',
      tickfont: { color: isDark ? '#94a3b8' : '#64748b' }
    },
    plot_bgcolor: isDark ? '#090d16' : '#F9FAFB',
    paper_bgcolor: isDark ? '#0f172a' : '#ffffff',
    margin: { l: 50, r: 20, t: 10, b: 45 },
    font: { color: isDark ? '#f1f5f9' : '#0f172a' },
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1,
      bgcolor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      bordercolor: isDark ? '#334155' : '#cbd5e1',
      borderwidth: 1,
      font: { size: 10 }
    }
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {title}
          </CardTitle>
          <Badge 
            variant={converged ? 'success' : isPlaying ? 'warning' : 'default'}
            className="text-[10px]"
          >
            {converged ? '✓ Converged' : `Step ${step}`}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-3">
          {/* K selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                K (Cluster Sayısı)
              </label>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded">
                {k}
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="5"
              step="1"
              value={k}
              onChange={(e) => {
                setK(parseInt(e.target.value));
                setIsPlaying(false);
              }}
              disabled={isPlaying}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>

          {/* Number of points */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Veri Noktası
              </label>
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded">
                {numPoints}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="300"
              step="50"
              value={numPoints}
              onChange={(e) => {
                setNumPoints(parseInt(e.target.value));
                setIsPlaying(false);
              }}
              disabled={isPlaying}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={converged}
              className="flex-1 gap-1.5"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Duraklat
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {step === 0 ? 'Başlat' : 'Devam'}
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={nextStep}
              disabled={isPlaying || converged}
              className="gap-1.5"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={reset}
              className="gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Plot */}
        <div className="rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg" style={{ height: '450px' }}>
          <Plot
            data={[...dataTraces, centroidsTrace]}
            layout={layout}
            config={config}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
          />
        </div>

        {/* Algorithm Info */}
        <div className="text-xs bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-900/40 p-3 rounded-xl">
          <p className="font-bold text-emerald-900 dark:text-emerald-300 mb-1.5">
            {step === 0 ? '🎯 Algoritma Başlatıldı' : 
             converged ? '✅ Algoritma Converge Oldu!' : 
             `⚡ Adım ${step}: ${step % 2 === 1 ? 'Assignment' : 'Update'}`}
          </p>
          <p className="text-emerald-950 dark:text-emerald-200/90 leading-relaxed">
            {step === 0 ? 'K-Means: Rastgele centroid\'ler başlatıldı. Başlat\'a tıklayın.' :
             step % 2 === 1 ? 'Her nokta en yakın centroid\'e atandı.' :
             converged ? 'Centroid\'ler artık hareket etmiyor. Clustering tamamlandı!' :
             'Centroid\'ler cluster ortalamasına güncellendi.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
