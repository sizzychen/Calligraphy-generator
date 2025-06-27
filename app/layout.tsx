import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '字帖生成器',
  description: '免费的汉字练习字帖生成器',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <div className="min-h-screen flex flex-col">
          {/* Simple Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
              <h1 className="text-lg font-bold text-gray-900">
                字帖生成器
              </h1>
              <p className="text-sm text-gray-600">
                使用 <a href="https://clacky.ai" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ClackyAI</a> 制作 • 创作者：Sizzy
              </p>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}