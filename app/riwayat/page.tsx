'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useTheme } from '@/hooks/useTheme';
import { useJimpitan } from '@/hooks/useJimpitan';
import { useAppSettings } from '@/hooks/useAppSettings';
import { MENU_ITEMS, MONTHS, ITEMS_PER_PAGE } from '@/lib/constants';
import { formatRupiah, formatShortDate } from '@/lib/utils/format';

export default function RiwayatPage() {
  const { darkMode, toggleTheme } = useTheme();
  const { data, loading, deleteJimpitan } = useJimpitan();
  const { appName } = useAppSettings();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1);
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const [currentTablePage, setCurrentTablePage] = useState(1);

  const filteredData = data.filter(
    (item) => item.month === filterMonth && item.year === filterYear
  );

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

  const monthOptions = MONTHS.map((month, index) => ({
    value: (index + 1).toString(),
    label: month,
  }));

  const yearOptions = [
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        menuItems={MENU_ITEMS}
        currentPage="riwayat"
        onPageChange={(page) => router.push(`/${page}`)}
        darkMode={darkMode}
        appName={appName}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
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
                </div>

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
                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
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
      </div>
    </div>
  );
}
