'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console (production'da error tracking service'e gönderilebilir)
    console.error('Global Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Error Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-red-200 dark:border-red-900/50">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-4 text-slate-900 dark:text-slate-100">
            Bir Hata Oluştu
          </h1>

          {/* Description */}
          <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
            Üzgünüz, beklenmeyen bir hata ile karşılaştık. Lütfen sayfayı yenilemeyi deneyin.
          </p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6 border border-red-200 dark:border-red-800">
              <p className="text-sm font-mono text-red-800 dark:text-red-300 break-words">
                <strong>Hata:</strong> {error.message}
              </p>
              {error.digest && (
                <p className="text-xs font-mono text-red-600 dark:text-red-400 mt-2">
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              className="flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Sayfayı Yenile
            </Button>

            <Button
              onClick={() => window.location.href = '/'}
              variant="secondary"
              className="flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Ana Sayfaya Dön
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Sorun devam ederse, lütfen tarayıcı önbelleğinizi temizleyin veya farklı bir tarayıcı deneyin.
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Bu hatayı bildirmek isterseniz:{' '}
            <a
              href={`mailto:support@example.com?subject=AI Atlası Hata Raporu&body=${encodeURIComponent(`Hata: ${error.message}\nSayfa: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}`)}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Destek ekibine ulaşın
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
