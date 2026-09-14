'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Search, BookOpen, Settings, Home, TrendingUp, Code, Award, Map, Sparkles, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on ESC key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);
  
  const navItems = [
    { href: '/', label: 'Ana Sayfa', icon: Home },
    { href: '/topics', label: 'Konular', icon: BookOpen },
    { href: '/learning-map', label: 'Öğrenme Haritası', icon: Map },
    { href: '/simulators', label: 'Simülasyonlar', icon: Sparkles },
    { href: '/analytics', label: 'Analitik', icon: TrendingUp },
    { href: '/badges', label: 'Rozetler', icon: Award },
    { href: '/code-lab', label: 'Kod Lab', icon: Code },
    { href: '/search', label: 'Ara', icon: Search },
    { href: '/settings', label: 'Ayarlar', icon: Settings },
  ];
  
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-all duration-300 animate-slide-in-left">
        <div className="container mx-auto flex h-16 items-center px-4">
          {/* Mobile Menu Button (Left Side) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden mr-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            aria-label={mobileMenuOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 mr-4 md:mr-8 group">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-sm group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-base leading-none text-slate-900 dark:text-slate-100 tracking-tight">AI Atlası</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Yapay Zeka Laboratuvarı</span>
            </div>
          </Link>
          
          {/* Desktop Navigation (hidden on mobile) */}
          <nav className="hidden md:flex items-center space-x-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:border dark:border-blue-800/50 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 hover:scale-105'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* User Section */}
          <div className="flex items-center space-x-2 md:space-x-3 ml-auto">
            <ThemeToggle />
            <button
              onClick={() => {
                const event = new CustomEvent('show-shortcuts-modal');
                window.dispatchEvent(event);
              }}
              className="hidden sm:block p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 hover:scale-105"
              title="Klavye Kısayolları (?)"
            >
              <kbd className="text-xs font-bold">?</kbd>
            </button>
            <div className="hidden sm:flex items-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              <span>Kişisel Mod</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay & Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto"
            >
            {/* Drawer Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-br from-blue-600 to-indigo-600 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-white">AI Atlası</h2>
                    <p className="text-xs text-blue-100">Yapay Zeka Laboratuvarı</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                  aria-label="Menüyü Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* User Status */}
              <div className="flex items-center px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                <span className="text-sm text-white font-medium">Kişisel Mod Aktif</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200',
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-sm border-l-4 border-blue-600'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                        Aktif
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  const event = new CustomEvent('show-shortcuts-modal');
                  window.dispatchEvent(event);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                <kbd className="px-2 py-1 text-xs font-bold bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-600">?</kbd>
                <span>Klavye Kısayolları</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </>
  );
}
