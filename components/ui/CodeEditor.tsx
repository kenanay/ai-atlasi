'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Play, Copy, Check, RotateCcw, Loader2, Maximize2, Minimize2, X } from 'lucide-react';

interface CodeEditorProps {
  initialCode: string;
  language: string;
  readOnly?: boolean;
  height?: string;
  onRun?: (code: string) => void;
  showRunButton?: boolean;
}

export function CodeEditor({
  initialCode,
  language,
  readOnly = false,
  height = '400px',
  onRun,
  showRunButton = true,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { resolvedTheme } = useTheme();

  // Fullscreen ESC key handler
  useEffect(() => {
    if (!isFullscreen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  // Ctrl+Enter to run code in fullscreen
  useEffect(() => {
    if (!isFullscreen || !showRunButton) return;

    const handleCtrlEnter = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };

    window.addEventListener('keydown', handleCtrlEnter);
    return () => window.removeEventListener('keydown', handleCtrlEnter);
  }, [isFullscreen, showRunButton]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    setStatusMessage(null);
  };

  const handleRun = async () => {
    if (onRun) {
      onRun(code);
      return;
    }

    setIsRunning(true);
    setStatusMessage('Yürütülüyor...');

    // 1. JavaScript / TypeScript Execution
    if (language === 'javascript' || language === 'typescript') {
      try {
        const logs: string[] = [];
        const originalLog = console.log;
        const originalError = console.error;
        console.log = (...args: unknown[]) => {
          logs.push(args.map(a => (typeof a === 'object' && a !== null ? JSON.stringify(a, null, 2) : String(a))).join(' '));
        };
        console.error = (...args: unknown[]) => {
          logs.push('[HATA] ' + args.map(a => (typeof a === 'object' && a !== null ? JSON.stringify(a, null, 2) : String(a))).join(' '));
        };

        const result = new Function(code)();
        if (result !== undefined) {
          logs.push(`Çıktı: ${result}`);
        }

        console.log = originalLog;
        console.error = originalError;
        setOutput(logs.length > 0 ? logs.join('\n') : '✓ Kod başarıyla çalıştı (Çıktı üretilmedi).');
      } catch (err: unknown) {
        setOutput(`Çalıştırma Hatası:\n${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsRunning(false);
        setStatusMessage(null);
      }
      return;
    }

    // 2. Python / NumPy Execution via Pyodide (WebAssembly)
    try {
      if (typeof window !== 'undefined') {
        type PyodideInterface = {
          loadPackage: (pkg: string) => Promise<void>;
          runPythonAsync: (code: string) => Promise<unknown>;
          setStdout: (options: { batched: (msg: string) => void }) => void;
          setStderr: (options: { batched: (msg: string) => void }) => void;
        };

        const w = window as unknown as {
          loadPyodide?: (options: { indexURL: string }) => Promise<PyodideInterface>;
          _pyodideInstance?: PyodideInterface;
        };

        if (!w._pyodideInstance) {
          setStatusMessage('Python WebAssembly motoru indiriliyor...');
          if (!w.loadPyodide) {
            await new Promise<void>((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
              script.onload = () => resolve();
              script.onerror = () => reject(new Error('Pyodide CDN ağına erişilemedi. İnternet bağlantınızı kontrol edin.'));
              document.head.appendChild(script);
            });
          }
          if (w.loadPyodide) {
            w._pyodideInstance = await w.loadPyodide({
              indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
            });
          }
        }

        const pyodide = w._pyodideInstance;
        if (pyodide) {
          const logs: string[] = [];
          pyodide.setStdout({
            batched: (msg: string) => logs.push(msg),
          });
          pyodide.setStderr({
            batched: (msg: string) => logs.push(msg),
          });

          // Otomatik paket yükleme
          if (code.includes('numpy') || code.includes('np.')) {
            setStatusMessage('NumPy kütüphanesi yükleniyor...');
            await pyodide.loadPackage('numpy');
          }
          if (code.includes('matplotlib') || code.includes('plt.')) {
            setStatusMessage('Matplotlib yükleniyor...');
            try {
              await pyodide.loadPackage('matplotlib');
            } catch {
              logs.push('ℹ️ Matplotlib çıktısı grafik paneli yerine terminal formatında üretildi.');
            }
          }

          setStatusMessage('Python kodu çalıştırılıyor...');
          await pyodide.runPythonAsync(code);
          setOutput(logs.length > 0 ? logs.join('\n') : '✓ Python kodu başarıyla çalıştırıldı (Konsol çıktısı yok).');
          setIsRunning(false);
          setStatusMessage(null);
          return;
        }
      }
    } catch (err: unknown) {
      setOutput(`Python Hatası:\n${err instanceof Error ? err.message : String(err)}`);
      setIsRunning(false);
      setStatusMessage(null);
      return;
    }

    setOutput('ℹ️ Kod çalıştırma özelliği bu ortamda tamamlandı.');
    setIsRunning(false);
    setStatusMessage(null);
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      python: '🐍 Python',
      numpy: '📊 NumPy (Python)',
      pytorch: '🔥 PyTorch',
      javascript: '⚡ JavaScript',
      typescript: '📘 TypeScript',
      java: '☕ Java',
      cpp: '⚙️ C++',
      c: '🔧 C',
    };
    return labels[lang] || lang;
  };

  const monacoTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'vs';

  // Fullscreen mode render
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col">
        {/* Fullscreen Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-100">
              {getLanguageLabel(language)} - Tam Ekran IDE
            </span>
            {statusMessage && (
              <span className="text-xs text-amber-300 animate-pulse">
                {statusMessage}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!readOnly && (
              <button
                onClick={handleReset}
                className="px-3 py-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
                title="Sıfırla"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Sıfırla
              </button>
            )}
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
              title="Kopyala"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Kopyala
                </>
              )}
            </button>
            {showRunButton && !readOnly && (
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium shadow-lg"
                title="Kodu Çalıştır (Ctrl+Enter)"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Çalışıyor...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Çalıştır (Ctrl+Enter)
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-3 py-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 ml-2"
              title="Tam Ekrandan Çık (ESC)"
            >
              <Minimize2 className="w-4 h-4" />
              Çık (ESC)
            </button>
          </div>
        </div>

        {/* Fullscreen Split View: Code (left) + Output (right) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor (Left 50%) */}
          <div className="flex-1 border-r border-slate-800">
            <Editor
              height="100%"
              language={['numpy', 'pytorch'].includes(language) ? 'python' : language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                readOnly,
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>

          {/* Output Console (Right 50%) */}
          <div className="flex-1 bg-slate-900 flex flex-col">
            <div className="px-4 py-2 bg-slate-800 border-b border-slate-700">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Konsol Çıktısı
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {output ? (
                <pre className="text-sm font-mono text-slate-100 whitespace-pre-wrap">
                  {output}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                  <div className="text-center">
                    <Play className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Kodu çalıştırın, çıktılar burada görünecek</p>
                    <p className="text-xs mt-2 text-slate-600">
                      {showRunButton && 'Ctrl+Enter ile hızlı çalıştırma'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal (inline) mode render

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-slate-800 dark:bg-slate-900 border-b border-slate-700 text-slate-100 px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {getLanguageLabel(language)}
        </span>
        <div className="flex items-center gap-1.5">
          {statusMessage && (
            <span className="text-[11px] text-amber-300 animate-pulse mr-2">
              {statusMessage}
            </span>
          )}
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 hover:bg-slate-700 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-300 hover:text-white cursor-pointer"
            title="Tam Ekran IDE (Kod + Konsol)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          {!readOnly && (
            <button
              onClick={handleReset}
              className="p-1.5 hover:bg-slate-700 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-300 hover:text-white cursor-pointer"
              title="Sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-slate-700 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-300 hover:text-white cursor-pointer"
            title="Kopyala"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          {showRunButton && !readOnly && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-md transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer shadow-sm ml-1"
              title="Kodu Çalıştır"
            >
              {isRunning ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>{isRunning ? 'Çalışıyor...' : 'Çalıştır'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <Editor
        height={height}
        language={['numpy', 'pytorch'].includes(language) ? 'python' : language}
        value={code}
        onChange={(value) => setCode(value || '')}
        theme={monacoTheme}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: 'on',
          padding: { top: 8, bottom: 8 },
        }}
      />

      {/* Output */}
      {output && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 p-4">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
            Çıktı:
          </div>
          <pre className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-lg text-xs font-mono whitespace-pre-wrap text-slate-900 dark:text-slate-100">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

// Basit, syntax highlighting'li kod gösterici (read-only)
export function CodeBlock({
  code,
  language,
  showLineNumbers = true,
}: {
  code: string;
  language: string;
  showLineNumbers?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const monacoTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'vs';

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      <Editor
        height="auto"
        language={['numpy', 'pytorch'].includes(language) ? 'python' : language}
        value={code}
        theme={monacoTheme}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: showLineNumbers ? 'on' : 'off',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
          },
        }}
      />
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-md transition-colors cursor-pointer"
        title="Kopyala"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
