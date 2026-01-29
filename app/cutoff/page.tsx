'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, Calendar, TrendingUp, Scissors, AlertTriangle } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useTheme } from '@/hooks/useTheme';
import { useJimpitan } from '@/hooks/useJimpitan';
import { useCutoff } from '@/hooks/useCutoff';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useAuth } from '@/lib/contexts/AuthContext';
import { MENU_ITEMS, MONTHS } from '@/lib/constants';
import { formatRupiah } from '@/lib/utils/format';

export default function CutoffPage() {
  const { darkMode, toggleTheme } = useTheme();
  const { appName } = useAppSettings();
  const { isAdmin } = useAuth();
  const { data, loading: jimpitanLoading, getTotalByPeriod, getTotalThisWeek, fetchJimpitan } = useJimpitan(isAdmin());
  const { cutoffHistory, totalPemasukan, loading: cutoffLoading, performCutoff, refetch } = useCutoff();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin()) {
      router.push('/dashboard');
    }
  }, [isAdmin, router]);

  const totalThisMonth = getTotalByPeriod(selectedMonth, selectedYear);
  const totalThisWeek = getTotalThisWeek();
  const loading = jimpitanLoading || cutoffLoading;

  const handleCutoff = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');

    const result = await performCutoff(selectedMonth, selectedYear, totalThisMonth);

    setIsProcessing(false);
    setIsModalOpen(false);

    if (result.success) {
      setSuccessMessage(`Cut off berhasil! ${formatRupiah(totalThisMonth)} telah ditambahkan ke Total Pemasukan.`);
      // Refresh jimpitan data to reflect archived records
      await fetchJimpitan(false);
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      setErrorMessage(result.error || 'Gagal melakukan cut off');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const formatPeriod = (month: number, year: number) => {
    return `${MONTHS[month - 1]} ${year}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAdmin()) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <Sidebar
          menuItems={MENU_ITEMS}
          currentPage="cutoff"
          onPageChange={(page) => router.push(`/${page}`)}
          darkMode={darkMode}
          appName={appName}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isAdmin={isAdmin()}
        />

        <div className="lg:ml-64">
          <Header
            title="Cut Off"
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
                {/* Success/Error Messages */}
                {successMessage && (
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl">
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl">
                    {errorMessage}
                  </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title="Total Pemasukan"
                    value={totalPemasukan}
                    icon={DollarSign}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                    darkMode={darkMode}
                  />
                  <StatCard
                    title="Pemasukan Bulan Ini"
                    value={totalThisMonth}
                    icon={Calendar}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                    darkMode={darkMode}
                  />
                  <StatCard
                    title="Pemasukan Minggu Ini"
                    value={totalThisWeek}
                    icon={TrendingUp}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                    darkMode={darkMode}
                  />
                </div>

                {/* Cutoff Section */}
                <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Lakukan Cut Off
                  </h3>

                  <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Bulan
                      </label>
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors
                          ${darkMode
                            ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 focus:border-blue-500'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      >
                        {MONTHS.map((m, index) => (
                          <option key={index} value={index + 1}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Tahun
                      </label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors
                          ${darkMode
                            ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 focus:border-blue-500'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button
                      onClick={() => setIsModalOpen(true)}
                      disabled={totalThisMonth === 0}
                      className="flex items-center gap-2"
                    >
                      <Scissors className="w-4 h-4" />
                      Cut Off {formatPeriod(selectedMonth, selectedYear)}
                    </Button>
                  </div>

                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Jumlah yang akan di-cut off: <strong className={darkMode ? 'text-white' : 'text-gray-900'}>{formatRupiah(totalThisMonth)}</strong>
                    </p>
                    <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      * Setelah cut off, data jimpitan bulan ini akan di-archive dan tidak terlihat oleh user biasa.
                    </p>
                  </div>
                </div>

                {/* Cutoff History */}
                <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Riwayat Cut Off
                  </h3>
                  
                  {cutoffHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Tanggal Cut Off
                            </th>
                            <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Periode
                            </th>
                            <th className={`px-4 py-3 text-right text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Jumlah
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {cutoffHistory.map((item) => (
                            <tr 
                              key={item.id} 
                              className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}
                            >
                              <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {formatDate(item.cutoff_date)}
                              </td>
                              <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {formatPeriod(item.period_month, item.period_year)}
                              </td>
                              <td className={`px-4 py-3 text-sm text-right font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {formatRupiah(item.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Belum ada riwayat cut off
                    </p>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Confirmation Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Konfirmasi Cut Off"
          darkMode={darkMode}
        >
          <div className="space-y-4">
            <div className={`flex items-start gap-3 p-4 rounded-xl ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <div>
                <p className={`font-medium ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                  Perhatian!
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  Tindakan ini akan mengarsipkan semua data jimpitan periode {formatPeriod(selectedMonth, selectedYear)} dan menambahkan {formatRupiah(totalThisMonth)} ke Total Pemasukan.
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex justify-between items-center">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Periode:</span>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatPeriod(selectedMonth, selectedYear)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Jumlah:</span>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatRupiah(totalThisMonth)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={handleCutoff}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? 'Memproses...' : 'Ya, Cut Off'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
