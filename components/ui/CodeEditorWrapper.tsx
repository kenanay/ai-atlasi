'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Lazy load CodeEditor (Monaco is 3.9MB!)
const CodeEditor = dynamic(() => import('./CodeEditor').then(mod => ({ default: mod.CodeEditor })), {
  loading: () => (
    <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800" style={{ height: '400px' }}>
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-3" />
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Kod editörü yükleniyor...</p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Monaco Editor • 3.9MB</p>
      </div>
    </div>
  ),
  ssr: false, // Monaco doesn't work with SSR
});

export default CodeEditor;
