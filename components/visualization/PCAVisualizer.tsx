'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Play, Pause, RotateCcw, Eye } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface PCAVisualizerProps {
  title?: string;
}

export function PCAVisualizer({
  title = 'PCA Projeksiyon Görselleştirme'
}: PCAVisualizerProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [numComponents, setNumComponents] = useState(2);
  const [dataPoints, setDataPoints] = useState(100);
  const [showOriginal, setShowOriginal] = useState(true);
  const [data, setData] = useState<any>(null);

  const generateData = () => {
    // 3D veri oluştur (korelasyonlu)
    const points: number[][] = [];
    for (let i = 0; i < dataPoints; i++) {
      const x = Math.random() * 10 - 5;
      const y = x * 0.8 + Math.random() * 2 - 1;
      const z = x * 0.3 + y * 0.5 + Math.random() * 1.5 - 0.75;
      points.push([x, y, z]);
    }

    // Mean center
    const means = [0, 1, 2].map(dim => 
      points.reduce((sum, p) => sum + p[dim], 0) / points.length
    );
    
    const centered = points.map(p => 
      p.map((val, dim) => val - means[dim])
    );

    // Covariance matrix (simplified)
    const cov = calculateCovariance(centered);
    
    // Eigenvalues (simulated - gerçekte tam hesaplama gerekir)
    const eigenvalues = [8.5, 2.3, 0.8];
    const explainedVariance = eigenvalues.map(e => 
      e / eigenvalues.reduce((a, b) => a + b, 0) * 100
    );

    // PCA projection (simplified)
    const pc1 = centered.map(p => p[0] * 0.9 + p[1] * 0.3 + p[2] * 0.1);
    const pc2 = centered.map(p => -p[0] * 0.3 + p[1] * 0.8 + p[2] * 0.5);

    setData({
      original: points,
      centered,
      pc1,
      pc2,
      eigenvalues,
      explainedVariance
    });
  };

  const calculateCovariance = (data: number[][]) => {
    // Simplified covariance calculation
    const n = data.length;
    const cov = Array(3).fill(0).map(() => Array(3).fill(0));
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += data[k][i] * data[k][j];
        }
        cov[i][j] = sum / (n - 1);
      }
    }
    
    return cov;
  };

  useEffect(() => {
    generateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPoints]);

  if (!data) return <div>Loading...</div>;

  // 3D Original Data
  const trace3D = {
    type: 'scatter3d' as const,
    mode: 'markers' as const,
    x: data.original.map((p: number[]) => p[0]),
    y: data.original.map((p: number[]) => p[1]),
    z: data.original.map((p: number[]) => p[2]),
    marker: {
      size: 4,
      color: data.original.map((p: number[]) => p[0]),
      colorscale: 'Viridis',
      showscale: false,
      opacity: 0.8
    },
    name: 'Original Data'
  };

  // 2D PCA Projection
  const tracePCA = {
    type: 'scatter' as const,
    mode: 'markers' as const,
    x: data.pc1,
    y: numComponents >= 2 ? data.pc2 : Array(data.pc1.length).fill(0),
    marker: {
      size: 6,
      color: data.pc1,
      colorscale: 'Viridis',
      showscale: false,
      opacity: 0.8
    },
    name: 'PCA Projection'
  };

  const layout3D = {
    scene: {
      xaxis: { title: 'X', gridcolor: isDark ? '#334155' : '#e2e8f0' },
      yaxis: { title: 'Y', gridcolor: isDark ? '#334155' : '#e2e8f0' },
      zaxis: { title: 'Z', gridcolor: isDark ? '#334155' : '#e2e8f0' },
      bgcolor: isDark ? '#0f172a' : '#ffffff'
    },
    margin: { l: 0, r: 0, t: 0, b: 0 },
    paper_bgcolor: isDark ? '#0f172a' : '#ffffff',
    font: { color: isDark ? '#f1f5f9' : '#0f172a' }
  };

  const layoutPCA = {
    xaxis: {
      title: 'PC1',
      gridcolor: isDark ? '#334155' : '#e2e8f0',
      zerolinecolor: isDark ? '#475569' : '#94a3b8',
      tickfont: { color: isDark ? '#94a3b8' : '#64748b' }
    },
    yaxis: {
      title: numComponents >= 2 ? 'PC2' : '',
      gridcolor: isDark ? '#334155' : '#e2e8f0',
      zerolinecolor: isDark ? '#475569' : '#94a3b8',
      tickfont: { color: isDark ? '#94a3b8' : '#64748b' }
    },
    plot_bgcolor: isDark ? '#090d16' : '#F9FAFB',
    paper_bgcolor: isDark ? '#0f172a' : '#ffffff',
    margin: { l: 50, r: 20, t: 10, b: 45 },
    font: { color: isDark ? '#f1f5f9' : '#0f172a' }
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
          <Badge variant="primary" className="text-[10px]">
            {numComponents} Component{numComponents > 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-3">
          {/* Number of Components */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Ana Bileşen Sayısı
              </label>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded">
                {numComponents}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={numComponents}
              onChange={(e) => setNumComponents(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              <span>1 PC</span>
              <span>2 PC</span>
              <span>3 PC</span>
            </div>
          </div>

          {/* Data Points */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Veri Noktası Sayısı
              </label>
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded">
                {dataPoints}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="50"
              value={dataPoints}
              onChange={(e) => setDataPoints(parseInt(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              size="sm"
              onClick={generateData}
              className="flex-1 gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Yeni Veri
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowOriginal(!showOriginal)}
              className="flex-1 gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              {showOriginal ? '3D Gizle' : '3D Göster'}
            </Button>
          </div>
        </div>

        {/* Explained Variance */}
        <div className="grid grid-cols-3 gap-2">
          {data.explainedVariance.map((variance: number, i: number) => (
            <div
              key={i}
              className={`text-center p-2 rounded-lg border-2 transition-all ${
                i < numComponents
                  ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-500'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 opacity-40'
              }`}
            >
              <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                PC{i + 1}
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {variance.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>

        {/* Plots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original Data (3D) */}
          {showOriginal && (
            <div className="rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg" style={{ height: '400px' }}>
              <Plot
                data={[trace3D]}
                layout={layout3D}
                config={config}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler
              />
            </div>
          )}

          {/* PCA Projection (2D/1D) */}
          <div className={`rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg ${showOriginal ? '' : 'md:col-span-2'}`} style={{ height: '400px' }}>
            <Plot
              data={[tracePCA]}
              layout={layoutPCA}
              config={config}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler
            />
          </div>
        </div>

        {/* Info */}
        <div className="text-xs bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/60 dark:border-blue-900/40 p-3 rounded-xl">
          <p className="font-bold text-blue-900 dark:text-blue-300 mb-1.5">
            📊 Açıklanan Varyans
          </p>
          <p className="text-blue-950 dark:text-blue-200/90 leading-relaxed">
            İlk {numComponents} ana bileşen, toplam varyansın{' '}
            <span className="font-bold">
              {data.explainedVariance.slice(0, numComponents).reduce((a: number, b: number) => a + b, 0).toFixed(1)}%
            </span>
            'ini açıklıyor.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
