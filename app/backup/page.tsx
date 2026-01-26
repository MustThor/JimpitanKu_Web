'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Upload, Trash2, RefreshCw } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useTheme } from '@/hooks/useTheme';
import { useBackup } from '@/hooks/useBackup';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useAuth } from '@/lib/contexts/AuthContext';
import { MENU_ITEMS } from '@/lib/constants';
import { formatDateTime } from '@/lib/utils/format';

export default function BackupPage() {
  const { darkMode, toggleTheme } = useTheme();
  const { data, loading, createBackup, restoreBackup, deleteBackup, error } = useBackup();
  const { appName } = useAppSettings();
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBackup = async () => {
    setIsCreating(true);
    const result = await createBackup();
    setIsCreating(false);

    if (result.success) {
      alert('Backup berhasil dibuat!');
    } else {
      alert(`Gagal membuat backup: ${result.error || 'Terjadi kesalahan yang tidak diketahui'}`);
    }
  };

  const handleRestore = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin merestore backup "${name}"?`)) {
      const result = await restoreBackup(id);
      if (result.success) {
        alert('Backup berhasil di-restore!');
      } else {
        alert(`Gagal restore backup: ${result.error || 'Terjadi kesalahan yang tidak diketahui'}`);
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus backup "${name}"?`)) {
      const result = await deleteBackup(id);
      if (result.success) {
        alert('Backup berhasil dihapus!');
      } else {
        alert(`Gagal menghapus backup: ${result.error || 'Terjadi kesalahan yang tidak diketahui'}`);
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        menuItems={MENU_ITEMS}
        currentPage="backup"
        onPageChange={(page) => router.push(`/${page}`)}
        darkMode={darkMode}
        appName={appName}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64">
        <Header
          title="Backup"
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="p-4 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
                  <p className="font-semibold">Error:</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Kelola Backup
                </h3>
                <div className={`mb-4 p-4 rounded-xl ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                    <strong>Info:</strong> Anda dapat membuat backup berkali-kali. Setiap backup akan memiliki nama unik berdasarkan waktu pembuatan.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={handleCreateBackup}
                    disabled={isCreating}
                    className="flex items-center justify-center gap-3"
                  >
                    <Download className="w-5 h-5" />
                    {isCreating ? 'Membuat...' : 'Buat Backup'}
                  </Button>
                </div>
              </div>

              <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Riwayat Backup
                </h3>
                <div className={`mb-4 p-4 rounded-xl ${darkMode ? 'bg-amber-900/30' : 'bg-amber-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                    <strong>Catatan:</strong> Tombol restore akan dinonaktifkan setelah backup di-restore untuk mencegah restore ganda.
                  </p>
                </div>
                {data.length > 0 ? (
                  <div className="space-y-3">
                    {data.map((backup) => (
                      <div
                        key={backup.id}
                        className={`flex items-center justify-between p-4 rounded-xl
                          ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                      >
                        <div className="flex-1">
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {backup.backup_name}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Dibuat: {formatDateTime(backup.created_at)}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Jumlah Data: {backup.backup_data?.length || 0} item
                          </p>
                          {backup.restored_at && (
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Di-restore: {formatDateTime(backup.restored_at)}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleRestore(backup.id, backup.backup_name)}
                            disabled={!!backup.restored_at}
                          >
                            <Upload className="w-4 h-4" />
                          </Button>
                          {isAdmin() && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(backup.id, backup.backup_name)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Belum ada backup</p>
                    <p className="text-sm mt-2">Buat backup pertama Anda sekarang</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
