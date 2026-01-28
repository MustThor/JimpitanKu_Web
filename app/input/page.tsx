'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PhotoUpload } from '@/components/ui/PhotoUpload';
import { PhotoThumbnail } from '@/components/ui/PhotoThumbnail';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useTheme } from '@/hooks/useTheme';
import { useJimpitan } from '@/hooks/useJimpitan';
import { useAppSettings } from '@/hooks/useAppSettings';
import { MENU_ITEMS, MONTHS } from '@/lib/constants';
import { validateJimpitanInput } from '@/lib/utils/validation';
import { formatRupiah, formatShortDate } from '@/lib/utils/format';

export default function InputPage() {
  const { darkMode, toggleTheme } = useTheme();
  const { data, loading, addJimpitan } = useJimpitan();
  const { appName } = useAppSettings();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    collection_date: new Date().toISOString().split('T')[0],
    notes: '',
    photo: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    const validation = validateJimpitanInput(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const result = await addJimpitan({
      amount: parseInt(formData.amount, 10),
      collection_date: formData.collection_date,
      notes: formData.notes,
      photo: formData.photo,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage('Jimpitan berhasil ditambahkan!');
      setFormData({
        amount: '',
        collection_date: new Date().toISOString().split('T')[0],
        notes: '',
        photo: null,
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrors({ submit: result.error || 'Gagal menambahkan jimpitan' });
    }
  };

  const recentEntries = data.slice(0, 5);

  return (
    <ProtectedRoute>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        menuItems={MENU_ITEMS}
        currentPage="input"
        onPageChange={(page) => router.push(`/${page}`)}
        darkMode={darkMode}
        appName={appName}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64">
        <Header
          title="Input Jimpitan"
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
              <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Tambah Jimpitan Baru
                </h3>

                {successMessage && (
                  <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl">
                    {successMessage}
                  </div>
                )}

                {errors.submit && (
                  <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl">
                    {errors.submit}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Jumlah (Rp)"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Contoh: 2000"
                    error={errors.amount}
                    required
                  />

                  <Input
                    label="Tanggal"
                    type="date"
                    value={formData.collection_date}
                    onChange={(e) => setFormData({ ...formData, collection_date: e.target.value })}
                    error={errors.collection_date}
                    required
                  />

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Hari Pengumpulan <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setFormData({ ...formData, notes: day })}
                          className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-2
                            ${formData.notes === day
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-transparent shadow-lg scale-105'
                              : darkMode
                                ? 'bg-gray-700 text-gray-300 border-gray-600 hover:border-blue-500 hover:bg-gray-600'
                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                            }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                    {errors.notes && (
                      <p className="mt-2 text-sm text-red-500">{errors.notes}</p>
                    )}
                  </div>

                  <PhotoUpload
                    value={formData.photo}
                    onChange={(file) => setFormData({ ...formData, photo: file })}
                    error={errors.photo}
                    darkMode={darkMode}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Jimpitan'}
                  </Button>
                </form>
              </div>

              <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Entri Terbaru
                </h3>
                <div className="space-y-3">
                  {recentEntries.length > 0 ? (
                    recentEntries.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-4 p-4 rounded-xl
                          ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                      >
                        <PhotoThumbnail url={item.photo_url} darkMode={darkMode} size="md" />
                        <div className="flex-1">
                          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formatRupiah(item.amount)}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatShortDate(item.collection_date)} • {item.notes || '-'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Belum ada data
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
