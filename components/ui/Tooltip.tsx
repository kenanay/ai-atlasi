'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  className?: string;
}

export function Tooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  delayDuration = 200,
  className
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      setIsMounted(true);
    }, delayDuration);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
    setTimeout(() => setIsMounted(false), 150); // Animation duration
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const sideStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const alignStyles = {
    start: side === 'top' || side === 'bottom' ? 'left-0 translate-x-0' : 'top-0 translate-y-0',
    center: '',
    end: side === 'top' || side === 'bottom' ? 'left-auto right-0 translate-x-0' : 'top-auto bottom-0 translate-y-0'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {isMounted && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-3 py-2 text-xs font-medium rounded-lg shadow-lg pointer-events-none',
            'bg-slate-900 dark:bg-slate-800 text-white border border-slate-700',
            'transition-opacity duration-150',
            isVisible ? 'opacity-100' : 'opacity-0',
            sideStyles[side],
            align !== 'center' && alignStyles[align],
            className
          )}
        >
          {content}
          {/* Arrow */}
          <div
            className={cn(
              'absolute w-2 h-2 bg-slate-900 dark:bg-slate-800 border border-slate-700 rotate-45',
              side === 'top' && 'bottom-[-5px] left-1/2 -translate-x-1/2 border-t-0 border-l-0',
              side === 'bottom' && 'top-[-5px] left-1/2 -translate-x-1/2 border-b-0 border-r-0',
              side === 'left' && 'right-[-5px] top-1/2 -translate-y-1/2 border-l-0 border-b-0',
              side === 'right' && 'left-[-5px] top-1/2 -translate-y-1/2 border-r-0 border-t-0'
            )}
          />
        </div>
      )}
    </div>
  );
}
