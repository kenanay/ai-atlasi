import Link from 'next/link';
import { Search, Home, BookOpen, Map } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            404
          </h1>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-4">
            Sayfa Bulunamadı
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
        </p>

        {/* Search Suggestion */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-700 mb-8">
          <div className="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 mb-4">
            <Search className="w-5 h-5" />
            <span className="font-medium">Bir konu mu arıyorsunuz?</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            80+ yapay zeka konusuna arama sayfasından veya öğrenme haritasından ulaşabilirsiniz.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/">
            <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Ana Sayfa
            </Button>
          </Link>

          <Link href="/topics">
            <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              Tüm Konular
            </Button>
          </Link>

          <Link href="/learning-map">
            <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
              <Map className="w-4 h-4" />
              Öğrenme Haritası
            </Button>
          </Link>
        </div>

        {/* Popular Topics */}
        <div className="mt-12">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
            Popüler Konular:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'neural-networks', name: 'Neural Networks' },
              { id: 'transformers-attention', name: 'Transformers' },
              { id: 'reinforcement-learning-basics', name: 'RL Basics' },
              { id: 'gradient-descent', name: 'Gradient Descent' },
            ].map((topic) => (
              <Link key={topic.id} href={`/topic/${topic.id}`}>
                <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                  {topic.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
