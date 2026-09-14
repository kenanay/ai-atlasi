'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Brain, Eye, Network, TrendingDown, Layers, Maximize2, Gamepad2, Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Lazy load all simulators (each is heavy with animations/canvas)
const SimulatorLoading = () => (
  <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-12">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-3" />
      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Simülatör yükleniyor...</p>
    </div>
  </div>
);

const AttentionVisualizer = dynamic(
  () => import('@/components/visualization').then(mod => ({ default: mod.AttentionVisualizer })),
  { loading: SimulatorLoading, ssr: false }
);

const NeuralNetworkSimulator = dynamic(
  () => import('@/components/visualization').then(mod => ({ default: mod.NeuralNetworkSimulator })),
  { loading: SimulatorLoading, ssr: false }
);

const CNNConvolutionVisualizer = dynamic(
  () => import('@/components/visualization').then(mod => ({ default: mod.CNNConvolutionVisualizer })),
  { loading: SimulatorLoading, ssr: false }
);

const GradientDescentPlot = dynamic(
  () => import('@/components/visualization').then(mod => ({ default: mod.GradientDescentPlot })),
  { loading: SimulatorLoading, ssr: false }
);

const KMeansAnimator = dynamic(
  () => import('@/components/visualization').then(mod => ({ default: mod.KMeansAnimator })),
  { loading: SimulatorLoading, ssr: false }
);

const PCAVisualizer = dynamic(
  () => import('@/components/visualization').then(mod => ({ default: mod.PCAVisualizer })),
  { loading: SimulatorLoading, ssr: false }
);

const QLearningGridWorld = dynamic(
  () => import('@/components/visualization').then(mod => ({ default: mod.QLearningGridWorld })),
  { loading: SimulatorLoading, ssr: false }
);

export default function SimulatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Mobile Warning Banner */}
        <div className="md:hidden mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center">
              <span className="text-lg">🎮</span>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                Masaüstü Görünümü Önerilir
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                İnteraktif simülasyonlar, animasyonlar ve parametre kontrolleri mobil cihazlarda 
                sınırlıdır. En iyi deneyim için lütfen masaüstü veya tablet kullanın.
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gelişmiş Simülasyon Kütüphanesi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Derin öğrenme algoritmalarının çalışma prensiplerini interaktif olarak keşfedin.
            Her simülasyon adım adım görselleştirme sunar.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Simülasyon</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">Adım Adım</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Görselleştirme</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <Network className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">Interaktif</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Animasyonlar</div>
              </div>
            </div>
          </div>
        </div>

        {/* Simulators */}
        <div className="space-y-8">
          {/* Attention Mechanism */}
          <section id="attention">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-600" />
                Attention & Transformer Mekanizması
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Query, Key, Value matrislerinin nasıl çarpıldığını ve Softmax ile attention ağırlıklarının
                nasıl hesaplandığını görün. Transformer modellerin temelini oluşturan attention mekanizması.
              </p>
            </div>
            <ErrorBoundary componentName="Attention Visualizer">
              <AttentionVisualizer />
            </ErrorBoundary>
          </section>

          {/* Neural Network */}
          <section id="neural-network">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Network className="w-6 h-6 text-purple-600" />
                Yapay Sinir Ağı İleri/Geri Yayılım
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Forward propagation ile ağın çıktısının nasıl hesaplandığını, backward propagation ile
                gradyanların nasıl geri yayıldığını ve ağırlıkların nasıl güncellendiğini izleyin.
              </p>
            </div>
            <ErrorBoundary componentName="Neural Network Simulator">
              <NeuralNetworkSimulator />
            </ErrorBoundary>
          </section>

          {/* CNN Convolution */}
          <section id="cnn">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Eye className="w-6 h-6 text-pink-600" />
                CNN Evrişim (Convolution) Operatörü
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Convolutional Neural Network'lerin temel işlemi olan convolution'ı görün. Kernel'in girdi
                görüntüsü üzerinde nasıl kaydırıldığını ve feature map'in nasıl oluştuğunu izleyin.
              </p>
            </div>
            <ErrorBoundary componentName="CNN Convolution Visualizer">
              <CNNConvolutionVisualizer />
            </ErrorBoundary>
          </section>

          {/* Gradient Descent */}
          <section id="gradient-descent">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <TrendingDown className="w-6 h-6 text-green-600" />
                Gradient Descent Optimizasyonu
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Öğrenme oranının (learning rate) etkisini görün. Konveks ve non-konveks fonksiyonlarda
                gradyan inişinin nasıl çalıştığını interaktif olarak keşfedin. Adım adım parametrelerin
                minimum noktaya yakınsamasını izleyin.
              </p>
            </div>
            <ErrorBoundary componentName="Gradient Descent Plot">
              <GradientDescentPlot />
            </ErrorBoundary>
          </section>

          {/* K-Means Clustering */}
          <section id="kmeans">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Layers className="w-6 h-6 text-orange-600" />
                K-Means Kümeleme Algoritması
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gözetimsiz öğrenmenin en popüler algoritması. Rastgele dağılmış veri noktalarının
                centroid'ler etrafında nasıl kümelendiğini, algoritmanın her iterasyonda nasıl yakınsadığını
                canlı animasyonla görün.
              </p>
            </div>
            <ErrorBoundary componentName="K-Means Animator">
              <KMeansAnimator />
            </ErrorBoundary>
          </section>

          {/* PCA Visualization */}
          <section id="pca">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Maximize2 className="w-6 h-6 text-indigo-600" />
                PCA - Boyut İndirgeme
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Principal Component Analysis (Temel Bileşen Analizi) ile yüksek boyutlu verinin nasıl
                daha düşük boyutlara izdüşürüldüğünü görün. Variance (varyans) korunumu ve bilgi kaybını
                3D'den 2D'ye indirgeme ile gözlemleyin.
              </p>
            </div>
            <ErrorBoundary componentName="PCA Visualizer">
              <PCAVisualizer />
            </ErrorBoundary>
          </section>

          {/* Q-Learning Grid World */}
          <section id="qlearning">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-teal-600" />
                Q-Learning - Pekiştirmeli Öğrenme
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Reinforcement Learning'in temel algoritması Q-Learning'i interaktif grid world üzerinde
                gözlemleyin. Ajan, epsilon-greedy policy ile keşif/sömürü dengesini koruyarak optimal
                politikayı öğrenir. Learning rate, discount factor ve epsilon parametrelerini değiştirerek
                öğrenme sürecini etkileyin.
              </p>
            </div>
            <ErrorBoundary componentName="Q-Learning Grid World">
              <QLearningGridWorld />
            </ErrorBoundary>
          </section>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-500">
          <p>
            Bu simülasyonlar eğitim amaçlıdır ve basitleştirilmiş versiyonlardır.
            Gerçek uygulamalarda daha karmaşık yapılar kullanılır.
          </p>
        </div>
      </div>
    </div>
  );
}
