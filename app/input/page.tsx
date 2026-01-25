'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
    });

    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage('Jimpitan berhasil ditambahkan!');
      setFormData({
        amount: '',
        collection_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrors({ submit: result.error || 'Gagal menambahkan jimpitan' });
    }
  };

  const recentEntries = data.slice(0, 5);

  return (
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
                      Catatan
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Contoh: Rumah Pak Teguh"
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-none
                        ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                  </div>

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
                        className={`flex items-center justify-between p-4 rounded-xl
                          ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                      >
                        <div>
                          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formatRupiah(item.amount)}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatShortDate(item.collection_date)}
                          </p>
                        </div>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.notes || '-'}
                        </span>
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
  );
}
