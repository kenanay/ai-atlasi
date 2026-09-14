'use client';

import { useEffect, useRef } from 'react';

type PyodideInterface = {
  loadPackage: (pkg: string) => Promise<void>;
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched: (msg: string) => void }) => void;
  setStderr: (options: { batched: (msg: string) => void }) => void;
};

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<PyodideInterface>;
    _pyodideInstance?: PyodideInterface;
    _pyodideLoading?: Promise<void>;
  }
}

/**
 * Pyodide WebAssembly motorunu arka planda sessizce ön yükler.
 * Level 2-4 sayfalarda kullanılır, böylece "Çalıştır" dendiğinde
 * motor zaten hazırdır (~25MB indirme 5-8sn yerine anında çalışır).
 * 
 * @param shouldPreload - Yükleme yapılsın mı (default: true)
 */
export function usePyodidePreload(shouldPreload = true) {
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (!shouldPreload || typeof window === 'undefined') return;
    if (window._pyodideInstance || isLoadingRef.current) return;

    isLoadingRef.current = true;

    // Eğer başka bir component zaten yüklüyorsa bekle
    if (window._pyodideLoading) {
      window._pyodideLoading.catch(() => {
        // Silent fail
      });
      return;
    }

    // Arka planda Pyodide'yi yükle
    const loadPyodideInBackground = async () => {
      try {
        console.log('[Pyodide Preload] 🚀 WebAssembly motoru arka planda yükleniyor...');

        // 1. Pyodide CDN script'i yükle
        if (!window.loadPyodide) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Pyodide CDN erişilemedi'));
            document.head.appendChild(script);
          });
        }

        // 2. Pyodide instance'ı oluştur
        if (window.loadPyodide) {
          const pyodide = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
          });

          // 3. NumPy'ı ön yükle (opsiyonel ama önerilen)
          await pyodide.loadPackage('numpy');

          // 4. Global cache'e kaydet
          window._pyodideInstance = pyodide;

          console.log('[Pyodide Preload] ✅ Hazır! NumPy yüklendi.');
        }
      } catch (error) {
        console.warn('[Pyodide Preload] ⚠️ Ön yükleme başarısız (kullanıcı çalıştırdığında tekrar denenecek):', error);
      } finally {
        isLoadingRef.current = false;
        window._pyodideLoading = undefined;
      }
    };

    window._pyodideLoading = loadPyodideInBackground();

    // Cleanup: İptal etme gerekmiyor (arka plan işlemi)
  }, [shouldPreload]);
}
