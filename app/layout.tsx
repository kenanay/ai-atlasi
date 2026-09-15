import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GlobalProviders } from "@/components/layout/GlobalProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Atlası - Yapay Zeka Öğrenme ve Deney Laboratuvarı",
  description: "Matematikten donanıma, algoritmalardan büyük dil modellerine kadar yapay zeka alanını öğrenin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('ai-atlasi-theme');
                const isDark = stored === 'dark' || ((!stored || stored === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        <Script
          src="https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js"
          strategy="lazyOnload"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white">
        <ThemeProvider>
          {/* Skip to main content link for keyboard navigation */}
          <a href="#main-content" className="skip-to-main">
            Ana içeriğe atla
          </a>
          
          <Header />
          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>
          <GlobalProviders />
        </ThemeProvider>
      </body>
    </html>
  );
}
