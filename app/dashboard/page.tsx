'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, Calendar, TrendingUp, Plus, FileText, Table } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PhotoUpload } from '@/components/ui/PhotoUpload';
import { PhotoThumbnail } from '@/components/ui/PhotoThumbnail';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useTheme } from '@/hooks/useTheme';
import { useJimpitan } from '@/hooks/useJimpitan';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useAuth } from '@/lib/contexts/AuthContext';
import { MENU_ITEMS } from '@/lib/constants';
import { formatRupiah, formatShortDate } from '@/lib/utils/format';
import { validateJimpitanInput } from '@/lib/utils/validation';
import { exportToPDF, exportToExcel } from '@/lib/utils/export'; 

export default function DashboardPage() {
  const { darkMode, toggleTheme } = useTheme();
  const { data, loading, getTotalByPeriod, getTotalThisWeek, getWeeklyData, addJimpitan } = useJimpitan();
  const { appName } = useAppSettings();
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    amount: '',
    collection_date: new Date().toISOString().split('T')[0],
    notes: '',
    photo: null as File | null,
  });

  const currentPage = 'dashboard';

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ];

  const years = [2026, 2027, 2028, 2029, 2030];

  const totalAll = getTotalByPeriod();
  const totalThisMonth = getTotalByPeriod(selectedMonth, selectedYear);
  const totalThisWeek = getTotalThisWeek();

  const weeklyChartData = getWeeklyData(selectedMonth, selectedYear);

  const recentEntries = data.slice(0, 5);

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
      setTimeout(() => {
        setSuccessMessage('');
        setIsModalOpen(false);
      }, 1500);
    } else {
      setErrors({ submit: result.error || 'Gagal menambahkan jimpitan' });
    }
  };

  // Get daily data for selected month/year for export
  const dailyDataForExport = data.filter(
    (item) => item.month === selectedMonth && item.year === selectedYear
  );

  const handleExportDailyPDF = () => {
    if (dailyDataForExport.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }
    exportToPDF(dailyDataForExport, selectedMonth, selectedYear, appName);
  };

  const handleExportDailyExcel = () => {
    if (dailyDataForExport.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }
    exportToExcel(dailyDataForExport, selectedMonth, selectedYear);
  };

  return (
    <ProtectedRoute>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        menuItems={MENU_ITEMS}
        currentPage={currentPage}
        onPageChange={(page) => router.push(`/${page}`)}
        darkMode={darkMode}
        appName={appName}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isAdmin={isAdmin()}
      />

      <div className="lg:ml-64">
        <Header
          title="Dashboard"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Pemasukan"
                  value={totalAll}
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

              <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Grafik Pemasukan Mingguan
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors
                        ${darkMode
                          ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    >
                      {months.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors
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
                  <div className="flex gap-2">
                    <Button
                      onClick={handleExportDailyPDF}
                      disabled={dailyDataForExport.length === 0}
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      PDF
                    </Button>
                    <Button
                      onClick={handleExportDailyExcel}
                      disabled={dailyDataForExport.length === 0}
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Table className="w-4 h-4" />
                      Excel
                    </Button>
                  </div>
                </div>
                <WeeklyChart data={weeklyChartData} darkMode={darkMode} />
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
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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

        {/* Floating Action Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/30 z-40"
          aria-label="Tambah Jimpitan"
        >
          <Plus size={24} />
        </button>

        {/* Modal for Adding Jimpitan */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Tambah Jimpitan Baru"
          darkMode={darkMode}
        >
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
                {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => (
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

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
    </ProtectedRoute>
  );
}
