'use client';

import katex from 'katex';
import { useEffect, useRef } from 'react';

interface MathFormulaProps {
  formula: string;
  display?: boolean; // true for block display, false for inline
  className?: string;
}

export function MathFormula({ formula, display = true, className = '' }: MathFormulaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && formula) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode: display,
          throwOnError: false,
          errorColor: '#cc0000',
          strict: false,
          trust: false,
        });
      } catch (error) {
        console.error('KaTeX render error:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<span class="text-red-600">Formül render hatası: ${formula}</span>`;
        }
      }
    }
  }, [formula, display]);

  return (
    <div
      ref={containerRef}
      className={`${display ? 'katex-display' : 'katex-inline'} ${className}`}
    />
  );
}

interface MathFormulaListProps {
  formulas: string[];
  className?: string;
}

export function MathFormulaList({ formulas, className = '' }: MathFormulaListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {formulas.map((formula, index) => (
        <div
          key={index}
          className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs transition-colors"
        >
          <MathFormula formula={formula} display={true} />
        </div>
      ))}
    </div>
  );
}
