import { CodeExecutor } from '@/components/ui/CodeExecutor';

export default function CodeLabPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
          🐍 Python Kod Laboratuvarı
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Tarayıcınızda Python kodu yazıp çalıştırın. NumPy, Pandas ve diğer bilimsel kütüphaneler hazır!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CodeExecutor
          title="Temel Python"
          initialCode={`# Merhaba Dünya
print("Merhaba, AI Atlası!")

# Basit hesaplama
x = 10
y = 20
print(f"{x} + {y} = {x + y}")`}
          height="200px"
        />

        <CodeExecutor
          title="NumPy ile Vektör İşlemleri"
          initialCode={`import numpy as np

# Vektörler oluştur
v1 = np.array([1, 2, 3])
v2 = np.array([4, 5, 6])

print("v1:", v1)
print("v2:", v2)
print("v1 + v2:", v1 + v2)
print("Nokta çarpım:", np.dot(v1, v2))
print("v1 normu:", np.linalg.norm(v1))`}
          height="250px"
        />

        <CodeExecutor
          title="Basit Linear Regression"
          initialCode={`import numpy as np

# Veri (y = 2x + 1 ilişkisi)
X = np.array([1, 2, 3, 4, 5])
y = np.array([3, 5, 7, 9, 11])

# Normal equation ile w hesapla
# y = w * X için: w = (X^T X)^-1 X^T y
w = np.sum(X * y) / np.sum(X * X)
b = np.mean(y) - w * np.mean(X)

print(f"Öğrenilen parametreler:")
print(f"w (eğim) = {w:.2f}")
print(f"b (kesişim) = {b:.2f}")
print(f"\\nModel: y = {w:.2f}x + {b:.2f}")

# Tahmin
x_test = 6
y_pred = w * x_test + b
print(f"\\nTahmin (x={x_test}): {y_pred:.2f}")`}
          height="300px"
        />
      </div>
    </div>
  );
}
