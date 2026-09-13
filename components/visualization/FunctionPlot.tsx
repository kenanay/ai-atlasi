'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useTheme } from '@/components/theme/ThemeProvider';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface FunctionPlotProps {
  title?: string;
  functions?: {
    fn: (x: number) => number;
    label: string;
    color?: string;
  }[];
  xRange?: [number, number];
}

export function FunctionPlot({
  title = 'Fonksiyon Grafiği',
  functions = [
    {
      fn: (x: number) => x * x,
      label: 'f(x) = x²',
      color: '#3B82F6'
    }
  ],
  xRange = [-5, 5]
}: FunctionPlotProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [selectedFunctions, setSelectedFunctions] = useState<string[]>(
    functions.map(f => f.label)
  );

  // X değerleri oluştur
  const numPoints = 200;
  const xValues = Array.from(
    { length: numPoints },
    (_, i) => xRange[0] + (i / (numPoints - 1)) * (xRange[1] - xRange[0])
  );

  // Fonksiyon trace'lerini oluştur
  const traces = functions
    .filter(f => selectedFunctions.includes(f.label))
    .map(({ fn, label, color }) => ({
      type: 'scatter' as const,
      mode: 'lines' as const,
      x: xValues,
      y: xValues.map(fn),
      line: {
        color: color || '#3B82F6',
        width: 3,
      },
      name: label,
    }));

  const layout = {
    title: {
      text: title,
      font: { size: 14, color: isDark ? '#f1f5f9' : '#0f172a' }
    },
    xaxis: {
      title: { text: 'x', font: { color: isDark ? '#94a3b8' : '#64748b' } },
      showgrid: true,
      gridcolor: isDark ? '#1e293b' : '#e2e8f0',
      zeroline: true,
      zerolinewidth: 2,
      zerolinecolor: isDark ? '#475569' : '#94a3b8',
      tickfont: { color: isDark ? '#94a3b8' : '#64748b', size: 11 },
    },
    yaxis: {
      title: { text: 'y', font: { color: isDark ? '#94a3b8' : '#64748b' } },
      showgrid: true,
      gridcolor: isDark ? '#1e293b' : '#e2e8f0',
      zeroline: true,
      zerolinewidth: 2,
      zerolinecolor: isDark ? '#475569' : '#94a3b8',
      tickfont: { color: isDark ? '#94a3b8' : '#64748b', size: 11 },
    },
    plot_bgcolor: isDark ? '#090d16' : '#F9FAFB',
    paper_bgcolor: isDark ? '#0f172a' : '#FFFFFF',
    margin: { l: 45, r: 40, t: 40, b: 40 },
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
    modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d'],
    responsive: true,
  };

  return (
    <Card>
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-3">
          {/* Fonksiyon seçici */}
          {functions.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {functions.map(({ label, color }) => (
                <button
                  key={label}
                  onClick={() => {
                    setSelectedFunctions(prev =>
                      prev.includes(label)
                        ? prev.filter(l => l !== label)
                        : [...prev, label]
                    );
                  }}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                    selectedFunctions.includes(label)
                      ? 'border-blue-500 bg-blue-50/70 text-blue-950 dark:bg-blue-950/40 dark:text-blue-200 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                  style={{
                    borderColor: selectedFunctions.includes(label) ? color : undefined,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Grafik */}
          <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800" style={{ height: '320px' }}>
            <Plot
              data={traces}
              layout={layout}
              config={config}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
