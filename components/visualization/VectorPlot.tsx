'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RotateCcw } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

// Plotly'yi dinamik olarak yükle (SSR için)
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface Vector2D {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

interface VectorPlotProps {
  vectors?: Vector2D[];
  title?: string;
  showGrid?: boolean;
  range?: { x: [number, number]; y: [number, number] };
}

export function VectorPlot({
  vectors = [],
  title = '2D Vektör Görselleştirmesi',
  showGrid = true,
  range = { x: [-5, 5], y: [-5, 5] }
}: VectorPlotProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [localVectors, setLocalVectors] = useState<Vector2D[]>(vectors.length > 0 ? vectors : [
    { x: 3, y: 4, label: 'v', color: '#3B82F6' },
    { x: 1, y: 2, label: 'u', color: '#EF4444' },
  ]);

  const handleReset = () => {
    setLocalVectors([
      { x: 3, y: 4, label: 'v', color: '#3B82F6' },
      { x: 1, y: 2, label: 'u', color: '#EF4444' },
    ]);
  };

  // Vektör verilerini Plotly formatına dönüştür
  const traces: import('plotly.js').Data[] = localVectors.map((vector, index) => ({
    type: 'scatter' as const,
    mode: 'lines+markers+text' as const,
    x: [0, vector.x],
    y: [0, vector.y],
    line: {
      color: vector.color || '#3B82F6',
      width: 3,
    },
    marker: {
      size: [0, 10],
      color: vector.color || '#3B82F6',
    },
    text: ['', vector.label || `v${index + 1}`],
    textposition: 'top center' as const,
    textfont: {
      size: 13,
      color: vector.color || '#3B82F6',
    },
    name: vector.label || `Vektör ${index + 1}`,
    showlegend: true,
  }));

  // Vektör toplamını göster (ilk iki vektör varsa)
  if (localVectors.length >= 2) {
    const sum = {
      x: localVectors[0].x + localVectors[1].x,
      y: localVectors[0].y + localVectors[1].y,
    };
    
    traces.push({
      type: 'scatter' as const,
      mode: 'lines+markers+text' as const,
      x: [0, sum.x],
      y: [0, sum.y],
      line: {
        color: '#10B981',
        width: 3,
        dash: 'dash',
      },
      marker: {
        size: [0, 10],
        color: '#10B981',
      },
      text: ['', 'v + u'],
      textposition: 'top center' as const,
      textfont: {
        size: 13,
        color: '#10B981',
      },
      name: 'Toplam',
      showlegend: true,
    });
  }

  const layout = {
    title: {
      text: title,
      font: { size: 14, color: isDark ? '#f1f5f9' : '#0f172a' }
    },
    xaxis: {
      range: range.x,
      showgrid: showGrid,
      gridcolor: isDark ? '#1e293b' : '#e2e8f0',
      zeroline: true,
      zerolinewidth: 2,
      zerolinecolor: isDark ? '#475569' : '#94a3b8',
      tickfont: { color: isDark ? '#94a3b8' : '#64748b', size: 11 },
      title: { text: 'x', font: { color: isDark ? '#94a3b8' : '#64748b' } },
    },
    yaxis: {
      range: range.y,
      showgrid: showGrid,
      gridcolor: isDark ? '#1e293b' : '#e2e8f0',
      zeroline: true,
      zerolinewidth: 2,
      zerolinecolor: isDark ? '#475569' : '#94a3b8',
      tickfont: { color: isDark ? '#94a3b8' : '#64748b', size: 11 },
      title: { text: 'y', font: { color: isDark ? '#94a3b8' : '#64748b' } },
      scaleanchor: 'x',
    },
    plot_bgcolor: isDark ? '#090d16' : '#F9FAFB',
    paper_bgcolor: isDark ? '#0f172a' : '#FFFFFF',
    margin: { l: 40, r: 40, t: 40, b: 40 },
    hovermode: 'closest' as const,
    legend: {
      x: 0,
      y: 1,
      bgcolor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      font: { color: isDark ? '#f1f5f9' : '#0f172a', size: 11 }
    },
  };

  const config: Partial<import('plotly.js').Config> = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'autoScale2d'],
    responsive: true,
  };

  return (
    <Card>
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">{title}</CardTitle>
          <Button size="sm" variant="ghost" onClick={handleReset} title="Sıfırla" className="h-7 w-7 p-0">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800" style={{ height: '320px' }}>
          <Plot
            data={traces}
            layout={layout}
            config={config}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
