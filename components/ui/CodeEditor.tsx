'use client';

import { useState, useEffect, useRef } from 'react';
import Editor, { OnMount, BeforeMount } from '@monaco-editor/react';
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
  const [plotImages, setPlotImages] = useState<string[]>([]); // Matplotlib base64 images
  const [selectedPlotIndex, setSelectedPlotIndex] = useState<number | null>(null); // Zoom modal
  const { resolvedTheme } = useTheme();

  // Monaco Editor loader konfigürasyonu (CDN uyarılarını önler)
  const handleEditorWillMount: BeforeMount = (monaco) => {
    // Monaco'nun internal source map yüklemelerini devre dışı bırak
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
    
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  };

  // Fullscreen ESC key handler
  useEffect(() => {
    if (!isFullscreen && selectedPlotIndex === null) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (selectedPlotIndex !== null) {
          setSelectedPlotIndex(null);
        } else {
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen, selectedPlotIndex]);

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
    setPlotImages([]);
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
              
              // Matplotlib backend'i agg'ye ayarla (PNG export için)
              await pyodide.runPythonAsync(`
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
              `);
            } catch {
              logs.push('ℹ️ Matplotlib yüklenemedi. Terminal çıktısı kullanılacak.');
            }
          }

          setStatusMessage('Python kodu çalıştırılıyor...');
          await pyodide.runPythonAsync(code);
          
          // Matplotlib plot'ları yakala (eğer varsa)
          if (code.includes('matplotlib') || code.includes('plt.')) {
            try {
              const plotsData = await pyodide.runPythonAsync(`
import matplotlib.pyplot as plt
import io
import base64

def capture_plots():
    """Tüm açık matplotlib figure'ları base64 PNG olarak yakala"""
    plots = []
    figures = [plt.figure(n) for n in plt.get_fignums()]
    
    for fig in figures:
        buf = io.BytesIO()
        fig.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='white')
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        plots.append(img_base64)
        buf.close()
    
    # Figure'ları temizle (memory leak önleme)
    plt.close('all')
    
    return plots

capture_plots()
              `) as string[];
              
              if (plotsData && plotsData.length > 0) {
                setPlotImages(plotsData);
                logs.push(`\n📊 ${plotsData.length} adet grafik oluşturuldu.`);
              }
            } catch (plotErr) {
              console.warn('Plot yakalamada hata:', plotErr);
              logs.push('ℹ️ Grafik yakalanırken hata oluştu. plt.show() kullanmayı deneyin.');
            }
          }
          
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
              beforeMount={handleEditorWillMount}
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
            {/* Tab Header: Console vs Plots */}
            <div className="flex border-b border-slate-700">
              <button
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:bg-slate-800 transition-colors border-b-2 border-emerald-500"
              >
                📊 Grafikler {plotImages.length > 0 && `(${plotImages.length})`}
              </button>
              <button
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:bg-slate-800 transition-colors"
              >
                📝 Konsol
              </button>
            </div>

            {/* Plot Canvas Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {plotImages.length > 0 ? (
                <div className="space-y-6">
                  {plotImages.map((imgBase64, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-400">
                          Grafik {index + 1} / {plotImages.length}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPlotIndex(index)}
                            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                            title="Tam Ekran Görüntüle"
                          >
                            <Maximize2 className="w-3 h-3" />
                            Büyüt
                          </button>
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = `data:image/png;base64,${imgBase64}`;
                              link.download = `plot-${index + 1}.png`;
                              link.click();
                            }}
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            İndir
                          </button>
                        </div>
                      </div>
                      <img
                        src={`data:image/png;base64,${imgBase64}`}
                        alt={`Matplotlib plot ${index + 1}`}
                        className="w-full h-auto rounded shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedPlotIndex(index)}
                      />
                    </div>
                  ))}
                </div>
              ) : output ? (
                <div className="space-y-4">
                  <pre className="text-sm font-mono text-slate-100 whitespace-pre-wrap">
                    {output}
                  </pre>
                  {(code.includes('matplotlib') || code.includes('plt.')) && (
                    <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-3 text-xs text-amber-300">
                      💡 <strong>İpucu:</strong> plt.plot() veya plt.scatter() kullanıyorsanız, grafikler otomatik olarak yukarıda görünecektir.
                    </div>
                  )}
                </div>
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
        beforeMount={handleEditorWillMount}
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

      {/* Plot Canvas (if matplotlib plots exist) */}
      {plotImages.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide flex items-center justify-between">
            <span>📊 Grafikler ({plotImages.length})</span>
          </div>
          <div className="space-y-4">
            {plotImages.map((imgBase64, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Grafik {index + 1} / {plotImages.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPlotIndex(index)}
                      className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                      title="Tam Ekran Görüntüle"
                    >
                      <Maximize2 className="w-3 h-3" />
                      Büyüt
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `data:image/png;base64,${imgBase64}`;
                        link.download = `plot-${index + 1}.png`;
                        link.click();
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      PNG olarak indir
                    </button>
                  </div>
                </div>
                <img
                  src={`data:image/png;base64,${imgBase64}`}
                  alt={`Matplotlib plot ${index + 1}`}
                  className="w-full h-auto rounded border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedPlotIndex(index)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Text Output */}
      {output && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 p-4">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
            📝 Konsol Çıktısı:
          </div>
          <pre className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-lg text-xs font-mono whitespace-pre-wrap text-slate-900 dark:text-slate-100">
            {output}
          </pre>
        </div>
      )}

      {/* Plot Zoom Modal */}
      {selectedPlotIndex !== null && (
        <div 
          className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPlotIndex(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full">
            {/* Close button */}
            <button
              onClick={() => setSelectedPlotIndex(null)}
              className="absolute -top-12 right-0 text-white hover:text-slate-300 flex items-center gap-2 text-sm"
            >
              <X className="w-5 h-5" />
              Kapat (ESC)
            </button>
            
            {/* Navigation */}
            {plotImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlotIndex((selectedPlotIndex - 1 + plotImages.length) % plotImages.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-sm transition-colors"
                  title="Önceki Grafik"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlotIndex((selectedPlotIndex + 1) % plotImages.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-sm transition-colors"
                  title="Sonraki Grafik"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Image */}
            <img
              src={`data:image/png;base64,${plotImages[selectedPlotIndex]}`}
              alt={`Matplotlib plot ${selectedPlotIndex + 1}`}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Info bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              Grafik {selectedPlotIndex + 1} / {plotImages.length}
            </div>
          </div>
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
