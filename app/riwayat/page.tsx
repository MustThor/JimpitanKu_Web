'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, ChevronLeft, ChevronRight, FileText, Table, Pencil, Lock } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PhotoThumbnail } from '@/components/ui/PhotoThumbnail';
import { PhotoUpload } from '@/components/ui/PhotoUpload';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useTheme } from '@/hooks/useTheme';
import { useJimpitan } from '@/hooks/useJimpitan';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useAuth } from '@/lib/contexts/AuthContext';
import { MENU_ITEMS, MONTHS, ITEMS_PER_PAGE } from '@/lib/constants';
import { formatRupiah, formatShortDate } from '@/lib/utils/format';
import { exportWeeklySummaryToPDF, exportWeeklySummaryToExcel } from '@/lib/utils/export';
import { Jimpitan } from '@/lib/supabase/types';

export default function RiwayatPage() {
  const { darkMode, toggleTheme } = useTheme();
  const { appName } = useAppSettings();
  const { isAdmin } = useAuth();
  const { data, loading, deleteJimpitan, updateJimpitan, getWeeklyData } = useJimpitan(isAdmin());
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1);
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const [currentTablePage, setCurrentTablePage] = useState(1);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Jimpitan | null>(null);
  const [editFormData, setEditFormData] = useState({
    amount: '',
    collection_date: '',
    notes: '',
    photo: null as File | null,
    removePhoto: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // For regular users, show all data (no filter). For admin, filter by month/year.
  // filterMonth === 0 means "Semua Bulan" (all months)
  const filteredData = isAdmin()
    ? data.filter((item) => {
        if (filterMonth === 0) {
          // Show all months for the selected year
          return item.year === filterYear;
        }
        return item.month === filterMonth && item.year === filterYear;
      })
    : data;

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentTablePage - 1) * ITEMS_PER_PAGE,
    currentTablePage * ITEMS_PER_PAGE
  );

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const result = await deleteJimpitan(id);
      if (result.success) {
        // Adjust page if necessary
        const newTotalPages = Math.ceil((filteredData.length - 1) / ITEMS_PER_PAGE);
        if (currentTablePage > newTotalPages && newTotalPages > 0) {
          setCurrentTablePage(newTotalPages);
        }
      } else {
        alert(result.error || 'Gagal menghapus data');
      }
    }
  };

  const getDayName = (dateString: string) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const handleEdit = (item: Jimpitan) => {
    setEditingItem(item);
    setEditFormData({
      amount: item.amount.toString(),
      collection_date: item.collection_date,
      notes: item.notes || getDayName(item.collection_date),
      photo: null,
      removePhoto: false,
    });
    setEditErrors({});
    setSuccessMessage('');
    setIsEditModalOpen(true);
  };

  const handleEditDateChange = (dateValue: string) => {
    setEditFormData({
      ...editFormData,
      collection_date: dateValue,
      notes: getDayName(dateValue),
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setEditErrors({});
    setSuccessMessage('');

    // Validate
    const errors: Record<string, string> = {};
    if (!editFormData.amount || parseInt(editFormData.amount, 10) <= 0) {
      errors.amount = 'Jumlah harus lebih dari 0';
    }
    if (!editFormData.collection_date) {
      errors.collection_date = 'Tanggal harus diisi';
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const result = await updateJimpitan(editingItem.id, {
      amount: parseInt(editFormData.amount, 10),
      collection_date: editFormData.collection_date,
      notes: editFormData.notes,
      photo: editFormData.photo,
      photo_url: editFormData.removePhoto ? null : undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage('Data berhasil diperbarui!');
      setTimeout(() => {
        setSuccessMessage('');
        setIsEditModalOpen(false);
        setEditingItem(null);
      }, 1500);
    } else {
      setEditErrors({ submit: result.error || 'Gagal memperbarui data' });
    }
  };

  // Get weekly data for export
  const weeklyDataForExport = getWeeklyData(filterMonth, filterYear);

  const handleExportPDF = () => {
    if (weeklyDataForExport.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }
    exportWeeklySummaryToPDF(weeklyDataForExport, filterMonth, filterYear, appName);
  };

  const handleExportExcel = () => {
    if (weeklyDataForExport.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }
    exportWeeklySummaryToExcel(weeklyDataForExport, filterMonth, filterYear);
  };

  const monthOptions = [
    { value: '0', label: 'Semua Bulan' },
    ...MONTHS.map((month, index) => ({
      value: (index + 1).toString(),
      label: month,
    })),
  ];

  const yearOptions = [
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
  ];

  return (
    <ProtectedRoute>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        menuItems={MENU_ITEMS}
        currentPage="riwayat"
        onPageChange={(page) => router.push(`/${page}`)}
        darkMode={darkMode}
        appName={appName}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isAdmin={isAdmin()}
      />

      <div className="lg:ml-64">
        <Header
          title="Riwayat"
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
                {isAdmin() && (
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <Select
                        label="Bulan"
                        value={filterMonth.toString()}
                        onChange={(e) => {
                          setFilterMonth(parseInt(e.target.value, 10));
                          setCurrentTablePage(1);
                        }}
                        options={monthOptions}
                      />
                    </div>
                    <div className="flex-1">
                      <Select
                        label="Tahun"
                        value={filterYear.toString()}
                        onChange={(e) => {
                          setFilterYear(parseInt(e.target.value, 10));
                          setCurrentTablePage(1);
                        }}
                        options={yearOptions}
                      />
                    </div>
                    <div className="flex gap-2 items-end">
                      <Button
                        onClick={handleExportPDF}
                        disabled={weeklyDataForExport.length === 0}
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        PDF
                      </Button>
                      <Button
                        onClick={handleExportExcel}
                        disabled={weeklyDataForExport.length === 0}
                        className="flex items-center gap-2"
                      >
                        <Table className="w-4 h-4" />
                        Excel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <th className={`text-left py-4 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Tanggal
                        </th>
                        <th className={`text-left py-4 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Jumlah
                        </th>
                        <th className={`text-left py-4 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Catatan
                        </th>
                        <th className={`text-left py-4 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Foto
                        </th>
                        <th className={`text-center py-4 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.length > 0 ? (
                        paginatedData.map((item) => (
                          <tr
                            key={item.id}
                            className={`border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-100'}`}
                          >
                            <td className={`py-4 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {formatShortDate(item.collection_date)}
                            </td>
                            <td className={`py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {formatRupiah(item.amount)}
                            </td>
                            <td className={`py-4 px-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {item.notes || '-'}
                            </td>
                            <td className="py-4 px-4">
                              <PhotoThumbnail url={item.photo_url} darkMode={darkMode} size="sm" />
                            </td>
                            <td className="py-4 px-4 text-center">
                              {item.is_archived ? (
                                <div className="flex items-center justify-center gap-2">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                                      darkMode
                                        ? 'bg-amber-500/20 text-amber-400'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}
                                    title="Data sudah di-cutoff dan tidak dapat diubah"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                    Dikunci
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                                    title="Edit"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                    title="Hapus"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className={`py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                          >
                            Tidak ada data untuk periode ini
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Menampilkan {(currentTablePage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                      {Math.min(currentTablePage * ITEMS_PER_PAGE, filteredData.length)} dari {filteredData.length} data
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentTablePage((p) => Math.max(1, p - 1))}
                        disabled={currentTablePage === 1}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <span
                        className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                      >
                        {currentTablePage} / {totalPages}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentTablePage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentTablePage === totalPages}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          title="Edit Riwayat"
          darkMode={darkMode}
        >
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl">
              {successMessage}
            </div>
          )}

          {editErrors.submit && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl">
              {editErrors.submit}
            </div>
          )}

          <form onSubmit={handleEditSubmit} className="space-y-5">
            <Input
              label="Jumlah (Rp)"
              type="number"
              value={editFormData.amount}
              onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
              placeholder="Contoh: 2000"
              error={editErrors.amount}
              required
            />

            <Input
              label="Tanggal"
              type="date"
              value={editFormData.collection_date}
              onChange={(e) => handleEditDateChange(e.target.value)}
              error={editErrors.collection_date}
              required
            />

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Hari Pengumpulan
              </label>
              <div className={`px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white inline-block`}>
                {editFormData.notes}
              </div>
            </div>

            {editingItem?.photo_url && !editFormData.removePhoto && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Foto Saat Ini
                </label>
                <div className="flex items-center gap-4">
                  <PhotoThumbnail url={editingItem.photo_url} darkMode={darkMode} size="lg" />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditFormData({ ...editFormData, removePhoto: true })}
                  >
                    Hapus Foto
                  </Button>
                </div>
              </div>
            )}

            <PhotoUpload
              value={editFormData.photo}
              onChange={(file) => setEditFormData({ ...editFormData, photo: file, removePhoto: false })}
              error={editErrors.photo}
              darkMode={darkMode}
              label={editingItem?.photo_url && !editFormData.removePhoto ? 'Ganti Foto (Opsional)' : 'Upload Foto (Opsional)'}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                }}
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
