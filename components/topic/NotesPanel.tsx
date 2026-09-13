'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useProgress } from '@/lib/use-progress';
import { updateNotes } from '@/lib/progress';
import { Save, Edit, Eye } from 'lucide-react';

interface NotesPanelProps {
  topicId: string;
}

export function NotesPanel({ topicId }: NotesPanelProps) {
  const savedNotes = useProgress().find(p => p.topicId === topicId)?.notes ?? '';
  const [draft, setNotes] = useState<string | null>(null);
  const notes = draft ?? savedNotes;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleSave = () => {
    setIsSaving(true);
    try { updateNotes(topicId, notes); } catch {
      setIsSaving(false);
      alert('Not kaydedilemedi. Tarayıcı depolama alanını kontrol edin.');
      return;
    }
    setNotes(null);
    setLastSaved(new Date());
    setIsEditing(false);
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleCancel = () => {
    setNotes(null);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Kişisel Notlarım</CardTitle>
          {!isEditing ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="gap-1.5 text-xs"
            >
              <Edit className="w-3.5 h-3.5" />
              Notu Düzenle
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="text-xs"
              >
                İptal
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="gap-1.5 text-xs font-medium"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Bu konu hakkında önemli bulduğunuz detayları, formülleri ve ipuçlarını buraya not alabilirsiniz..."
            className="w-full h-64 p-3.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-sans resize-none leading-relaxed"
          />
        ) : (
          <div className="min-h-[200px]">
            {notes ? (
              <div className="p-4 bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
                <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
                  {notes}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <Eye className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-3">Bu konu için henüz bir not almadınız.</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="gap-1.5 text-xs"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Not Yaz
                </Button>
              </div>
            )}
          </div>
        )}
        
        {lastSaved && !isEditing && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3">
            Son kaydedilme: {lastSaved.toLocaleString('tr-TR')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
