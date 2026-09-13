'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Minus, X as Multiply, RotateCcw } from 'lucide-react';

type Matrix = number[][];

interface MatrixVisualizerProps {
  title?: string;
  initialMatrixA?: Matrix;
  initialMatrixB?: Matrix;
}

export function MatrixVisualizer({
  title = 'Matris Operatör Laboratuvarı',
  initialMatrixA = [[1, 2], [3, 4]],
  initialMatrixB = [[5, 6], [7, 8]],
}: MatrixVisualizerProps) {
  const [matrixA, setMatrixA] = useState<Matrix>(initialMatrixA);
  const [matrixB, setMatrixB] = useState<Matrix>(initialMatrixB);
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply'>('add');

  const handleReset = () => {
    setMatrixA([[1, 2], [3, 4]]);
    setMatrixB([[5, 6], [7, 8]]);
  };

  const updateCell = (matrix: 'A' | 'B', row: number, col: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const setter = matrix === 'A' ? setMatrixA : setMatrixB;
    const current = matrix === 'A' ? matrixA : matrixB;
    
    const newMatrix = current.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? numValue : c)) : r
    );
    setter(newMatrix);
  };

  const calculateResult = (): Matrix | null => {
    try {
      if (operation === 'add') {
        if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
          return null;
        }
        return matrixA.map((row, i) =>
          row.map((val, j) => val + matrixB[i][j])
        );
      } else if (operation === 'subtract') {
        if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
          return null;
        }
        return matrixA.map((row, i) =>
          row.map((val, j) => val - matrixB[i][j])
        );
      } else if (operation === 'multiply') {
        if (matrixA[0].length !== matrixB.length) {
          return null;
        }
        const result: Matrix = [];
        for (let i = 0; i < matrixA.length; i++) {
          result[i] = [];
          for (let j = 0; j < matrixB[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < matrixA[0].length; k++) {
              sum += matrixA[i][k] * matrixB[k][j];
            }
            result[i][j] = sum;
          }
        }
        return result;
      }
    } catch {
      return null;
    }
    return null;
  };

  const result = calculateResult();

  const renderMatrix = (
    matrix: Matrix,
    label: string,
    editable: boolean = true,
    matrixType?: 'A' | 'B'
  ) => (
    <div className="flex flex-col items-center">
      <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">{label}</div>
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex flex-col gap-1.5">
          {matrix.map((row, i) => (
            <div key={i} className="flex gap-1.5">
              {row.map((val, j) => (
                <input
                  key={j}
                  type="number"
                  value={val}
                  onChange={(e) => matrixType && updateCell(matrixType, i, j, e.target.value)}
                  disabled={!editable}
                  className={`w-12 h-9 text-center border rounded-lg font-mono text-xs transition-colors ${
                    editable
                      ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-bold'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1">
        {matrix.length} × {matrix[0].length}
      </div>
    </div>
  );

  const getOperationSymbol = () => {
    switch (operation) {
      case 'add': return '+';
      case 'subtract': return '−';
      case 'multiply': return '×';
    }
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
        <div className="space-y-4">
          {/* İşlem Seçici */}
          <div className="flex justify-center gap-1.5">
            <Button
              size="sm"
              variant={operation === 'add' ? 'primary' : 'outline'}
              onClick={() => setOperation('add')}
              className="gap-1 text-xs h-7 px-2.5"
            >
              <Plus className="w-3 h-3" />
              Toplama
            </Button>
            <Button
              size="sm"
              variant={operation === 'subtract' ? 'primary' : 'outline'}
              onClick={() => setOperation('subtract')}
              className="gap-1 text-xs h-7 px-2.5"
            >
              <Minus className="w-3 h-3" />
              Çıkarma
            </Button>
            <Button
              size="sm"
              variant={operation === 'multiply' ? 'primary' : 'outline'}
              onClick={() => setOperation('multiply')}
              className="gap-1 text-xs h-7 px-2.5"
            >
              <Multiply className="w-3 h-3" />
              Çarpma
            </Button>
          </div>

          {/* Matrisler */}
          <div className="flex items-center justify-center gap-3 flex-wrap py-2">
            {renderMatrix(matrixA, 'Matris A', true, 'A')}
            
            <div className="text-xl font-bold text-slate-400 dark:text-slate-500">
              {getOperationSymbol()}
            </div>
            
            {renderMatrix(matrixB, 'Matris B', true, 'B')}
            
            <div className="text-xl font-bold text-slate-400 dark:text-slate-500">=</div>
            
            {result ? (
              renderMatrix(result, 'Sonuç', false)
            ) : (
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Sonuç</div>
                <div className="border border-rose-200 dark:border-rose-900/60 rounded-xl p-3 bg-rose-50/60 dark:bg-rose-950/30">
                  <p className="text-xs text-rose-600 dark:text-rose-400 text-center font-medium">
                    Boyutlar uyumsuz!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Açıklama */}
          <div className="text-xs bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 p-3 rounded-xl">
            <p className="font-bold text-blue-900 dark:text-blue-300 mb-1">
              {operation === 'add' && 'Matris Toplama'}
              {operation === 'subtract' && 'Matris Çıkarma'}
              {operation === 'multiply' && 'Matris Çarpma'}
            </p>
            <p className="text-blue-950 dark:text-blue-200/90 leading-relaxed">
              {operation === 'add' && 'Aynı boyuttaki matrislerin karşılık gelen elemanları toplanır.'}
              {operation === 'subtract' && 'Aynı boyuttaki matrislerin karşılık gelen elemanları çıkarılır.'}
              {operation === 'multiply' && 'A\'nın sütun sayısı B\'nin satır sayısına eşit olmalıdır. Sonuç: (m×n) × (n×p) = (m×p)'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
