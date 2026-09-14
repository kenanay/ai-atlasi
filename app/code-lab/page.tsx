'use client';

import { useState } from 'react';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Play, Code, BookOpen } from 'lucide-react';
import { usePyodidePreload } from '@/hooks/usePyodidePreload';

interface CodeCell {
  id: string;
  code: string;
  language: string;
}

const initialCells: CodeCell[] = [
  {
    id: '1',
    code: `# Merhaba Dünya
print("Merhaba, AI Atlası!")

# Basit hesaplama
x = 10
y = 20
print(f"{x} + {y} = {x + y}")`,
    language: 'python'
  },
  {
    id: '2',
    code: `import numpy as np

# Vektörler oluştur
v1 = np.array([1, 2, 3])
v2 = np.array([4, 5, 6])

print("v1:", v1)
print("v2:", v2)
print("v1 + v2:", v1 + v2)
print("Nokta çarpım:", np.dot(v1, v2))`,
    language: 'python'
  }
];

export default function CodeLabPage() {
  const [cells, setCells] = useState<CodeCell[]>(initialCells);

  // Preload Pyodide in background (Python WebAssembly)
  usePyodidePreload(true);

  const addCell = () => {
    const newCell: CodeCell = {
      id: Date.now().toString(),
      code: '# Yeni kod hücresi\nprint("Hello World")',
      language: 'python'
    };
    setCells([...cells, newCell]);
  };

  const deleteCell = (id: string) => {
    if (cells.length === 1) {
      alert('En az bir hücre olmalıdır!');
      return;
    }
    setCells(cells.filter(cell => cell.id !== id));
  };

  const updateCell = (id: string, newCode: string) => {
    setCells(cells.map(cell => 
      cell.id === id ? { ...cell, code: newCode } : cell
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Mobile Warning Banner */}
        <div className="md:hidden mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center">
              <span className="text-lg">💻</span>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                Masaüstü Görünümü Önerilir
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Kod editörü ve interaktif çalıştırma özellikleri mobil cihazlarda sınırlıdır. 
                Daha iyi bir deneyim için lütfen masaüstü veya tablet kullanın.
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <Code className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                Python Kod Laboratuvarı
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Jupyter-style interaktif Python scratchpad. NumPy, kodu çalıştırın, hücre ekleyin/silin.
              </p>
            </div>
            
            <Button
              onClick={addCell}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Yeni Hücre
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{cells.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Kod Hücresi</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Play className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Pyodide</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">WebAssembly</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">NumPy</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Hazır</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <span>💡</span>
            Nasıl Kullanılır?
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• <strong>Kod yazın</strong> → Monaco editörde Python kodu yazın</li>
            <li>• <strong>Çalıştır</strong> → Yeşil "Çalıştır" butonuna basın (Pyodide WebAssembly ile çalışır)</li>
            <li>• <strong>Yeni hücre</strong> → Sağ üstteki "+ Yeni Hücre" ile ekleyin</li>
            <li>• <strong>Tam ekran</strong> → Herhangi bir hücrede Maximize iconuna tıklayın</li>
            <li>• <strong>NumPy/Matplotlib</strong> → Otomatik olarak yüklenir</li>
          </ul>
        </div>

        {/* Code Cells */}
        <div className="space-y-6">
          {cells.map((cell, index) => (
            <div key={cell.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Cell Header */}
              <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Hücre {index + 1}
                </span>
                <button
                  onClick={() => deleteCell(cell.id)}
                  className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors text-red-600 dark:text-red-400"
                  title="Hücreyi Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Code Editor */}
              <div className="p-4">
                <CodeEditor
                  initialCode={cell.code}
                  language={cell.language}
                  height="300px"
                  showRunButton={true}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Help */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            💡 <strong>İpucu:</strong> Her hücre bağımsız çalışır. Değişkenler hücreler arasında paylaşılmaz.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Powered by Pyodide WebAssembly • Python 3.11 • NumPy • Matplotlib
          </p>
        </div>
      </div>
    </div>
  );
}
