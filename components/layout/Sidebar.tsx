'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORY_INFO } from '@/lib/utils';
import { getTopicsByCategory } from '@/lib/topics';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const topicsByCategory = getTopicsByCategory();
  
  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 h-[calc(100vh-4rem)] overflow-y-auto animate-slide-in-left">
      <div className="p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 px-2">
          Kategoriler
        </h2>
        
        <nav className="space-y-1">
          {Array.from(topicsByCategory.entries()).map(([category, topics]) => {
            const info = CATEGORY_INFO[category];
            if (!info) return null;
            
            return (
              <div key={category} className="mb-4">
                <div className="flex items-center space-x-2 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <span className="text-base">{info.icon}</span>
                  <span className="flex-1 truncate">{info.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    {topics.length}
                  </span>
                </div>
                
                <div className="ml-2 mt-1 space-y-0.5 border-l border-slate-200 dark:border-slate-800 pl-2">
                  {topics.map((topic) => {
                    const isActive = pathname === `/topic/${topic.id}`;
                    
                    return (
                      <Link
                        key={topic.id}
                        href={`/topic/${topic.id}`}
                        className={cn(
                          'flex items-center space-x-2 px-2.5 py-1.5 text-xs rounded-md transition-all duration-200 group font-medium',
                          isActive
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200 hover:translate-x-1'
                        )}
                      >
                        <ChevronRight className={cn(
                          'w-3 h-3 text-slate-400 dark:text-slate-500 transition-transform',
                          isActive && 'transform rotate-90 text-blue-600 dark:text-blue-400'
                        )} />
                        <span className="flex-1 truncate">{topic.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
