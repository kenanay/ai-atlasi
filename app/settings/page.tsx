'use client';

import { useProgress } from '@/lib/use-progress';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getProgressStats, exportProgress, importProgress, resetAllProgress } from '@/lib/progress';
import { Download, Upload, Trash2, BarChart, Info } from 'lucide-react';

export default function SettingsPage() {
  const allProgress = useProgress();
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const stats = getProgressStats(allProgress);

  const handleExport = () => {
    const data = exportProgress();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-atlasi-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setMessage({ type: 'success', text: 'İlerleme başarıyla dışa aktarıldı!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImport = () => {
    if (!importText.trim()) {
      setMessage({ type: 'error', text: 'Lütfen içe aktarılacak JSON verisini girin' });
      return;
    }
    
    const success = importProgress(importText);
    if (success) {
      setMessage({ type: 'success', text: 'İlerleme başarıyla içe aktarıldı!' });
      setImportText('');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setMessage({ type: 'error', text: 'Geçersiz JSON formatı' });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  const handleReset = () => {
    if (confirm('Tüm ilerleme verileriniz silinecek. Bu işlem geri alınamaz. Emin misiniz?')) {
      resetAllProgress();
      setMessage({ type: 'success', text: 'Tüm ilerleme sıfırlandı' });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-2">
            Ayarlar
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            İlerleme verilerinizi yönetin, yedekleyin veya sıfırlayın.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium transition-all ${
            message.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60' 
              : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Statistics */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                İlerleme İstatistikleri
              </CardTitle>
              <CardDescription className="text-xs">
                Öğrenme sürecinizin genel özeti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalTopics}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Başlanan Konu</p>
                </div>
                <div className="text-center p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completedCount}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Tamamlanan</p>
                </div>
                <div className="text-center p-4 bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalTimeSpent}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Toplam Dakika</p>
                </div>
                <div className="text-center p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-xl">
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.totalQuizzes}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Quiz Çözüldü</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Progress */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                İlerlemeyi Dışa Aktar (Yedekle)
              </CardTitle>
              <CardDescription className="text-xs">
                Tüm ilerleme verilerinizi JSON dosyası olarak indirin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                İlerleme verilerinizi yedeklemek veya başka bir cihaza/tarayıcıya aktarmak için dışa aktarın.
              </p>
              <Button onClick={handleExport} className="gap-2">
                <Download className="w-4 h-4" />
                Dışa Aktar
              </Button>
            </CardContent>
          </Card>

          {/* Import Progress */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                İlerlemeyi İçe Aktar
              </CardTitle>
              <CardDescription className="text-xs">
                Daha önce dışa aktardığınız JSON yedek verisini yapıştırın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                <strong className="text-rose-600 dark:text-rose-400">Uyarı:</strong> Mevcut ilerleme verileriniz silinecek ve içe aktarılan yedek ile güncellenecektir.
              </p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='{"topicId": "...", "status": "...", ...}'
                className="w-full h-28 p-3 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <Button onClick={handleImport} variant="secondary" className="gap-2">
                <Upload className="w-4 h-4" />
                İçe Aktar
              </Button>
            </CardContent>
          </Card>

          {/* Reset Progress */}
          <Card className="border-rose-200 dark:border-rose-900/40">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <Trash2 className="w-4 h-4" />
                Tüm İlerlemeyi Sıfırla
              </CardTitle>
              <CardDescription className="text-xs text-rose-600/80 dark:text-rose-400/80">
                Dikkat: Bu işlem geri alınamaz!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Tüm konu ilerlemeleri, kişisel notlar, quiz sonuçları ve çalışma süresi kayıtları yerel depolama alanından kalıcı olarak silinecektir.
              </p>
              <Button onClick={handleReset} variant="danger" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Tümünü Sıfırla
              </Button>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                AI Atlası Hakkında
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">Versiyon:</strong> 1.0.0 (Gelişmiş Laboratuvar Sürümü)
                </p>
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">Açıklama:</strong> Yapay zeka öğrenme ve deney laboratuvarı.
                  Matematikten donanıma, algoritmalardan büyük dil modellerine kadar yapay zeka alanını seviye seviye öğrenin.
                </p>
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">Veri Gizliliği:</strong> Tüm ilerleme verileri yalnızca tarayıcınızın
                  localStorage alanında tutulur. Hiçbir kişisel veri harici sunucuya iletilmez.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
