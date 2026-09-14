'use client';

import { useState } from 'react';
import { Topic, TopicLevel } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { VectorPlot, GradientDescentPlot, FunctionPlot, MatrixVisualizer, PCAVisualizer, KMeansAnimator } from '@/components/visualization';
import { AttentionVisualizer } from '@/components/visualization/AttentionVisualizer';
import { CNNConvolutionVisualizer } from '@/components/visualization/CNNConvolutionVisualizer';
import { NeuralNetworkSimulator } from '@/components/visualization/NeuralNetworkSimulator';
import { QLearningGridWorld } from '@/components/visualization/QLearningGridWorld';
import { 
  Code2, 
  ChevronDown, 
  ChevronRight,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

interface TopicRightPanelProps {
  topic: Topic;
  level: TopicLevel;
}

export function TopicRightPanel({ topic, level }: TopicRightPanelProps) {
  const [expandedCode, setExpandedCode] = useState<number>(0);

  // Seviyeye göre kod örneklerini filtrele (codeExamples undefined olabilir)
  const relevantCodeExamples = topic.codeExamples ? topic.codeExamples.filter((example) => {
    if (level === 0 || level === 1) return false; // Temel ve başlangıç seviyesinde kod yok
    if (level === 2) return example.language === 'python' || example.language === 'numpy';
    if (level === 3) return example.language === 'numpy' || example.language === 'pytorch';
    return true; // Seviye 4'te hepsini göster
  }) : [];

  return (
    <aside className="w-96 border-l border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 h-[calc(100vh-4rem)] overflow-y-auto shrink-0 transition-colors">
      <div className="p-4 space-y-4">
        {/* Code Examples */}
        {level >= 2 && relevantCodeExamples.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2 px-1">
              <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Kod Laboratuvarı
            </h3>
            
            {relevantCodeExamples.map((example, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader 
                  className="p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors select-none" 
                  onClick={() => setExpandedCode(expandedCode === index ? -1 : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {expandedCode === index ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {example.language === 'python' && '🐍 Python'}
                        {example.language === 'numpy' && '📊 NumPy'}
                        {example.language === 'pytorch' && '🔥 PyTorch'}
                        {example.language === 'javascript' && '⚡ JavaScript'}
                      </CardTitle>
                    </div>
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">
                      Örnek {index + 1}
                    </Badge>
                  </div>
                </CardHeader>
                
                {expandedCode === index && (
                  <CardContent className="p-3 pt-0 space-y-3">
                    {/* Explanation */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-2">
                      {example.explanation}
                    </p>
                    
                    {/* Code Editor */}
                    <CodeEditor
                      key={`${topic.id}-${example.code}`}
                      initialCode={example.code}
                      language={example.language}
                      readOnly={false}
                      height="320px"
                      showRunButton={example.runnable !== false}
                    />
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Visualizations */}
        {topic.visualizations && topic.visualizations.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2 px-1">
              <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              İnteraktif Görselleştirme
            </h3>
            
            {topic.visualizations.map((viz) => {
              if (viz.component === 'VectorPlot') {
                return <VectorPlot key={viz.id} title={viz.title} />;
              } else if (viz.component === 'GradientDescentPlot') {
                return <GradientDescentPlot key={viz.id} title={viz.title} />;
              } else if (viz.component === 'FunctionPlot') {
                if (topic.id === 'activation-functions') {
                  return (
                    <FunctionPlot
                      key={viz.id}
                      title={viz.title}
                      xRange={[-5, 5]}
                      functions={[
                        { fn: (x: number) => 1 / (1 + Math.exp(-x)), label: 'Sigmoid σ(x)', color: '#3B82F6' },
                        { fn: (x: number) => Math.max(0, x), label: 'ReLU(x)', color: '#10B981' },
                        { fn: (x: number) => Math.tanh(x), label: 'Tanh(x)', color: '#F59E0B' },
                        { fn: (x: number) => (x > 0 ? x : 0.1 * x), label: 'Leaky ReLU(x)', color: '#8B5CF6' },
                      ]}
                    />
                  );
                }
                if (topic.id === 'derivative') {
                  return (
                    <FunctionPlot
                      key={viz.id}
                      title={viz.title}
                      xRange={[-4, 4]}
                      functions={[
                        { fn: (x: number) => x * x, label: 'f(x) = x²', color: '#3B82F6' },
                        { fn: (x: number) => 2 * x, label: "Türev f'(x) = 2x", color: '#EF4444' },
                      ]}
                    />
                  );
                }
                if (topic.id === 'linear-regression') {
                  return (
                    <FunctionPlot
                      key={viz.id}
                      title={viz.title}
                      xRange={[-2, 6]}
                      functions={[
                        { fn: (x: number) => 2 * x + 1, label: 'Regresyon: ŷ = 2x + 1', color: '#3B82F6' },
                      ]}
                    />
                  );
                }
                return <FunctionPlot key={viz.id} title={viz.title} />;
              } else if (viz.component === 'MatrixVisualizer') {
                return <MatrixVisualizer key={viz.id} title={viz.title} />;
              } else if (viz.component === 'PCAVisualizer' || topic.id === 'pca-dimensionality-reduction') {
                return <PCAVisualizer key={viz.id} title={viz.title} />;
              } else if (viz.component === 'KMeansAnimator' || topic.id === 'kmeans-clustering') {
                return <KMeansAnimator key={viz.id} title={viz.title} />;
              } else if (viz.component === 'AttentionVisualizer' || topic.id === 'transformers-attention') {
                return <AttentionVisualizer key={viz.id} title={viz.title} />;
              } else if (viz.component === 'CNNConvolutionVisualizer' || topic.id === 'convolutional-neural-networks') {
                return <CNNConvolutionVisualizer key={viz.id} title={viz.title} />;
              } else if (viz.component === 'NeuralNetworkSimulator' || topic.id === 'neural-networks') {
                return <NeuralNetworkSimulator key={viz.id} title={viz.title} />;
              } else if (viz.component === 'QLearningGridWorld' || topic.id === 'q-learning-dqn' || topic.id === 'reinforcement-learning-basics') {
                return <QLearningGridWorld key={viz.id} title={viz.title} />;
              }
              
              // Varsayılan placeholder
              return (
                <Card key={viz.id}>
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">{viz.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 space-y-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400">{viz.description}</p>
                    
                    <div className="aspect-video bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-700">
                      <div className="text-center p-4">
                        <Sparkles className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-1.5" />
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {viz.type === 'plot' && '📊 Dinamik Grafik'}
                          {viz.type === 'interactive' && '🎮 İnteraktif Simülasyon'}
                          {viz.type === 'animation' && '🎬 Canlı Animasyon'}
                          {viz.type === 'matrix' && '📐 Matris Operatörü'}
                          {viz.type === 'graph' && '🕸️ Ağ Modeli'}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Bu görselleştirme henüz hazırlanmadı.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State for levels 0 and 1 */}
        {level < 2 && (
          <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-900/40">
            <CardContent className="py-8 px-4 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-3">
                <Code2 className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Kod Örnekleri Seviye 2&apos;de Başlar
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Önce temel kavramları kavrayın, ardından Seviye 2&apos;ye geçerek kod örneklerini inceleyin.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </aside>
  );
}
