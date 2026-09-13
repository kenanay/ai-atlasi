import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.97] hover:scale-[1.02]';
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 shadow-md focus-visible:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 dark:hover:shadow-blue-500/40 dark:focus-visible:ring-offset-slate-900',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 hover:shadow-md dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700/80 focus-visible:ring-slate-400 dark:focus-visible:ring-offset-slate-900',
      outline: 'border-2 border-slate-300 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-400 dark:hover:border-slate-600 focus-visible:ring-slate-400 dark:focus-visible:ring-offset-slate-900',
      ghost: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 focus-visible:ring-slate-400 dark:focus-visible:ring-offset-slate-900',
      danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30 shadow-md focus-visible:ring-red-600 dark:bg-red-600 dark:hover:bg-red-500 dark:hover:shadow-red-500/40 dark:focus-visible:ring-offset-slate-900',
    };
    
    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-11 px-6 text-base gap-2.5',
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
