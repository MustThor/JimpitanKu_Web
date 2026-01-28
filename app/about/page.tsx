'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useTheme } from '@/hooks/useTheme';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useAuth } from '@/lib/contexts/AuthContext';
import { MENU_ITEMS } from '@/lib/constants';

export default function AboutPage() {
  const { darkMode, toggleTheme } = useTheme();
  const { appName } = useAppSettings();
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        menuItems={MENU_ITEMS}
        currentPage="about"
        onPageChange={(page) => router.push(`/${page}`)}
        darkMode={darkMode}
        appName={appName}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isAdmin={isAdmin()}
      />

      <div className="lg:ml-64">
        <Header
          title="Tentang Aplikasi"
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="p-4 lg:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Tentang Aplikasi
              </h3>
              <div className="space-y-3">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`font-medium text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {appName}
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Versi 1.0.0
                  </p>
                </div>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Aplikasi ini dibuat untuk membantu pencatatan iuran jimpitan komunitas {appName}.
                  Data disimpan secara online dan dapat di-backup kapan saja.
                </p>
              </div>
            </div>

            <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Fitur Utama
              </h3>
              <div className="space-y-3">
                <div className={`flex items-start gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-500 text-lg">📊</span>
                  </div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Lihat ringkasan pemasukan dan grafik mingguan
                    </p>
                  </div>
                </div>
                <div className={`flex items-start gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-500 text-lg">➕</span>
                  </div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Input Jimpitan</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Catat pemasukan jimpitan harian dengan mudah
                    </p>
                  </div>
                </div>
                <div className={`flex items-start gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-500 text-lg">📜</span>
                  </div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Riwayat</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Lihat dan kelola riwayat pemasukan, ekspor ke PDF/Excel
                    </p>
                  </div>
                </div>
                <div className={`flex items-start gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-500 text-lg">💾</span>
                  </div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Backup</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Backup dan restore data dengan aman
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Kontak
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Jika ada pertanyaan atau masalah, silakan hubungi pengurus RT/RW.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
