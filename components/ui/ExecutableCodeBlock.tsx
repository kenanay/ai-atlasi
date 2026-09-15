'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Play, Copy, Check, Loader2 } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

interface ExecutableCodeBlockProps {
  code: string;
  language: string;
}

export function ExecutableCodeBlock({ code, language }: ExecutableCodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const pyodideRef = useRef<any>(null);

  // Python mu kontrol et
  const isPython = language === 'python' || language === 'py';

  useEffect(() => {
    if (!isPython) return;

    let mounted = true;

    async function loadPyodide() {
      if (pyodideRef.current) return;

      try {
        // @ts-ignore
        if (typeof window !== 'undefined' && window.loadPyodide) {
          // @ts-ignore
          const pyodide = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
          });
          
          if (mounted) {
            pyodideRef.current = pyodide;
          }
        }
      } catch (error) {
        console.error('Pyodide load error:', error);
      }
    }

    loadPyodide();

    return () => {
      mounted = false;
    };
  }, [isPython]);

  const runCode = async () => {
    if (!pyodideRef.current || isRunning) return;

    setIsRunning(true);
    setOutput('');
    const startTime = performance.now();

    try {
      const captureOutput: string[] = [];
      pyodideRef.current.setStdout({
        batched: (text: string) => captureOutput.push(text)
      });
      pyodideRef.current.setStderr({
        batched: (text: string) => captureOutput.push(`ERROR: ${text}`)
      });

      await pyodideRef.current.runPythonAsync(code);

      const endTime = performance.now();
      setExecutionTime(endTime - startTime);

      const result = captureOutput.join('\n') || '✓ Kod başarıyla çalıştırıldı (çıktı yok)';
      setOutput(result);
    } catch (error: any) {
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setOutput(`✗ Hata:\n${error.message || error.toString()}`);
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase">
            {language}
          </span>
          {executionTime > 0 && (
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              {executionTime.toFixed(0)}ms
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={copyCode}
            className="h-7 px-2 gap-1.5"
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3" />
                <span className="text-xs">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-xs">Kopyala</span>
              </>
            )}
          </Button>
          
          {isPython && (
            <Button
              size="sm"
              onClick={runCode}
              disabled={isRunning || !pyodideRef.current}
              className="h-7 px-3 gap-1.5"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="text-xs">Çalışıyor...</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span className="text-xs">Çalıştır</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Code */}
      <pre className={`
        p-4 overflow-x-auto text-sm font-mono leading-relaxed
        ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}
      `}>
        <code>{code}</code>
      </pre>

      {/* Output */}
      {output && (
        <div className="border-t border-slate-200 dark:border-slate-700">
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
              Çıktı
            </span>
          </div>
          <pre className={`
            p-4 text-xs font-mono leading-relaxed overflow-x-auto
            ${output.includes('✗ Hata') 
              ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200' 
              : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200'
            }
          `}>
            {output}
          </pre>
        </div>
      )}

      {/* Hint */}
      {isPython && !pyodideRef.current && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/20 border-t border-blue-200 dark:border-blue-900/40">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 Python runtime yükleniyor... Birkaç saniye bekleyin.
          </p>
        </div>
      )}
    </div>
  );
}
