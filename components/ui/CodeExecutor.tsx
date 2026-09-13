'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Play, Square, RotateCcw, CheckCircle2, XCircle, Loader2, Code2 } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

interface CodeExecutorProps {
  initialCode?: string;
  title?: string;
  height?: string;
  allowEdit?: boolean;
}

type ExecutionStatus = 'idle' | 'loading' | 'running' | 'success' | 'error';

export function CodeExecutor({
  initialCode = '# Python kodu yazın\nprint("Merhaba, AI Atlası!")',
  title = 'Python Kodu Çalıştır',
  height = '300px',
  allowEdit = true
}: CodeExecutorProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<ExecutionStatus>('idle');
  const [executionTime, setExecutionTime] = useState(0);
  const pyodideRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Pyodide'i yükle
  useEffect(() => {
    let mounted = true;

    async function loadPyodide() {
      if (pyodideRef.current) return;

      setStatus('loading');
      try {
        // @ts-ignore - Pyodide global object
        const pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
        });
        
        if (mounted) {
          pyodideRef.current = pyodide;
          setStatus('idle');
          setOutput('✓ Python runtime hazır! Kodu çalıştırmak için Run düğmesine basın.');
        }
      } catch (error) {
        if (mounted) {
          setStatus('error');
          setOutput('✗ Pyodide yüklenemedi. Lütfen sayfayı yenileyin.');
          console.error('Pyodide load error:', error);
        }
      }
    }

    loadPyodide();

    return () => {
      mounted = false;
    };
  }, []);

  const runCode = async () => {
    if (!pyodideRef.current || status === 'running') return;

    setStatus('running');
    setOutput('');
    const startTime = performance.now();

    try {
      // stdout ve stderr'i yakalama
      const captureOutput: string[] = [];
      pyodideRef.current.setStdout({
        batched: (text: string) => captureOutput.push(text)
      });
      pyodideRef.current.setStderr({
        batched: (text: string) => captureOutput.push(`ERROR: ${text}`)
      });

      // Kodu çalıştır
      await pyodideRef.current.runPythonAsync(code);

      const endTime = performance.now();
      setExecutionTime(endTime - startTime);

      const result = captureOutput.join('\n') || '(kod çıktı üretmedi)';
      setOutput(result);
      setStatus('success');
    } catch (error: any) {
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);

      setOutput(`✗ Hata:\n${error.message || error.toString()}`);
      setStatus('error');
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
    setStatus('idle');
    setExecutionTime(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab desteği
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      
      // Cursor pozisyonunu ayarla
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }

    // Ctrl/Cmd + Enter ile çalıştır
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return 'bg-blue-500';
      case 'running': return 'bg-amber-500 animate-pulse';
      case 'success': return 'bg-emerald-500';
      case 'error': return 'bg-rose-500';
      default: return 'bg-slate-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading': return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
      case 'running': return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
      case 'success': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'error': return <XCircle className="w-3.5 h-3.5" />;
      default: return <Code2 className="w-3.5 h-3.5" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'loading': return 'Yükleniyor...';
      case 'running': return 'Çalışıyor...';
      case 'success': return `Başarılı (${executionTime.toFixed(0)}ms)`;
      case 'error': return 'Hata';
      default: return 'Hazır';
    }
  };

  return (
    <Card>
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {title}
          </CardTitle>
          <Badge 
            variant={status === 'success' ? 'success' : status === 'error' ? 'danger' : 'default'}
            className="text-[10px] flex items-center gap-1"
          >
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-3">
        {/* Kontroller */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={runCode}
            disabled={status === 'running' || status === 'loading'}
            className="gap-1.5 text-xs h-8 px-3 flex-1"
            variant="primary"
          >
            {status === 'running' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Çalışıyor...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Run (Ctrl+Enter)
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={resetCode}
            disabled={status === 'running'}
            className="gap-1.5 text-xs h-8 px-3"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Sıfırla
          </Button>

          {status === 'running' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Pyodide'de çalışan kodu durduramayız, sadece UI'ı güncelle
                setStatus('error');
                setOutput('✗ Çalıştırma kullanıcı tarafından iptal edildi.');
              }}
              className="gap-1.5 text-xs h-8 px-2.5 text-rose-600 border-rose-300 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950"
            >
              <Square className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        {/* Kod Editörü */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Python Kodu
            </label>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {code.split('\n').length} satır
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!allowEdit || status === 'running'}
            className={`
              w-full px-3 py-2.5 rounded-lg border-2 font-mono text-[13px] leading-relaxed
              transition-colors resize-none
              ${isDark 
                ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${!allowEdit || status === 'running' ? 'opacity-60 cursor-not-allowed' : ''}
            `}
            style={{ height }}
            spellCheck={false}
            placeholder="# Python kodu buraya yazın..."
          />
          <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
            💡 İpucu: Tab ile girinti, Ctrl+Enter ile çalıştır
          </p>
        </div>

        {/* Çıktı Alanı */}
        {output && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              Çıktı
              {executionTime > 0 && (
                <span className="text-[10px] font-mono font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  {executionTime.toFixed(0)}ms
                </span>
              )}
            </label>
            <pre className={`
              px-3 py-2.5 rounded-lg border-2 font-mono text-xs leading-relaxed
              overflow-x-auto max-h-64 overflow-y-auto
              ${status === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/30 dark:border-rose-900/40 dark:text-rose-200'
                : 'bg-slate-50 border-slate-300 text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100'
              }
            `}>
              {output}
            </pre>
          </div>
        )}

        {/* Bilgi */}
        {status === 'idle' && !output && (
          <div className="text-xs bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 p-3 rounded-xl">
            <p className="font-bold text-blue-900 dark:text-blue-300 mb-1">
              🐍 Python Sanal Ortamı
            </p>
            <p className="text-blue-950 dark:text-blue-200/90 leading-relaxed">
              Bu kod editöründe Python kodu yazıp tarayıcınızda çalıştırabilirsiniz. 
              NumPy, Pandas gibi bilimsel kütüphaneler kullanılabilir.
            </p>
          </div>
        )}

        {/* Örnek Kodlar */}
        {status === 'idle' && !output && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCode('import numpy as np\n\n# NumPy array oluştur\narr = np.array([1, 2, 3, 4, 5])\nprint(f"Array: {arr}")\nprint(f"Ortalama: {arr.mean()}")\nprint(f"Standart sapma: {arr.std()}")')}
              className="text-[10px] px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              NumPy Örneği
            </button>
            <button
              onClick={() => setCode('# Basit makine öğrenmesi örneği\nimport numpy as np\n\n# Veri\nX = np.array([1, 2, 3, 4, 5])\ny = np.array([2, 4, 6, 8, 10])\n\n# Linear regression (y = 2x)\nw = np.sum(X * y) / np.sum(X * X)\nprint(f"Öğrenilen ağırlık: {w}")\nprint(f"Tahmin (x=6): {w * 6}")')}
              className="text-[10px] px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              ML Örneği
            </button>
            <button
              onClick={() => setCode('# Gradient descent simülasyonu\nimport numpy as np\n\ndef f(x):\n    return x**2\n\ndef gradient(x):\n    return 2*x\n\nx = 10  # Başlangıç\nlr = 0.1  # Öğrenme oranı\n\nfor i in range(10):\n    grad = gradient(x)\n    x = x - lr * grad\n    print(f"Adım {i+1}: x={x:.4f}, f(x)={f(x):.4f}")')}
              className="text-[10px] px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              GD Örneği
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
