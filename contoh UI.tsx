
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  PlusCircle, 
  History, 
  Database, 
  Settings, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Trash2, 
  Download, 
  Upload, 
  FileText, 
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatShortDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const initialJimpitanData = [
  { id: 1, amount: 125000, collection_date: '2026-01-25', week_number: 4, month: 1, year: 2026, notes: 'Jimpitan malam Jumat' },
  { id: 2, amount: 98000, collection_date: '2026-01-24', week_number: 4, month: 1, year: 2026, notes: 'Jimpitan malam Kamis' },
  { id: 3, amount: 115000, collection_date: '2026-01-18', week_number: 3, month: 1, year: 2026, notes: 'Jimpitan malam Sabtu' },
  { id: 4, amount: 87000, collection_date: '2026-01-17', week_number: 3, month: 1, year: 2026, notes: 'Jimpitan malam Jumat' },
  { id: 5, amount: 142000, collection_date: '2026-01-11', week_number: 2, month: 1, year: 2026, notes: 'Jimpitan malam Sabtu' },
  { id: 6, amount: 93000, collection_date: '2026-01-10', week_number: 2, month: 1, year: 2026, notes: 'Jimpitan malam Jumat' },
  { id: 7, amount: 78000, collection_date: '2026-01-04', week_number: 1, month: 1, year: 2026, notes: 'Jimpitan malam Sabtu' },
  { id: 8, amount: 105000, collection_date: '2026-01-03', week_number: 1, month: 1, year: 2026, notes: 'Jimpitan malam Jumat' },
  { id: 9, amount: 132000, collection_date: '2025-12-28', week_number: 4, month: 12, year: 2025, notes: 'Jimpitan akhir tahun' },
  { id: 10, amount: 156000, collection_date: '2025-12-21', week_number: 3, month: 12, year: 2025, notes: 'Jimpitan malam Minggu' },
  { id: 11, amount: 89000, collection_date: '2025-12-14', week_number: 2, month: 12, year: 2025, notes: 'Jimpitan malam Sabtu' },
  { id: 12, amount: 110000, collection_date: '2025-12-07', week_number: 1, month: 12, year: 2025, notes: 'Jimpitan awal Desember' },
];

const initialBackups = [
  { id: 1, backup_name: 'Backup_20260120_1430', created_at: '2026-01-20T14:30:00', restored_at: null },
  { id: 2, backup_name: 'Backup_20260115_0900', created_at: '2026-01-15T09:00:00', restored_at: null },
  { id: 3, backup_name: 'Backup_20260101_1200', created_at: '2026-01-01T12:00:00', restored_at: '2026-01-02T08:00:00' },
];

export default function JimpitanApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jimpitanData, setJimpitanData] = useState(initialJimpitanData);
  const [backups, setBackups] = useState(initialBackups);
  const [appName, setAppName] = useState('Jimpitan RT 05');
  
  const [formData, setFormData] = useState({
    amount: '',
    collection_date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const [filterMonth, setFilterMonth] = useState(1);
  const [filterYear, setFilterYear] = useState(2026);
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const itemsPerPage = 5;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'input', label: 'Input Jimpitan', icon: PlusCircle },
    { id: 'riwayat', label: 'Riwayat', icon: History },
    { id: 'backup', label: 'Backup', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const totalAll = jimpitanData.reduce((sum, item) => sum + item.amount, 0);
  const totalThisMonth = jimpitanData
    .filter(item => item.month === 1 && item.year === 2026)
    .reduce((sum, item) => sum + item.amount, 0);
  const totalToday = jimpitanData
    .filter(item => item.collection_date === '2026-01-25')
    .reduce((sum, item) => sum + item.amount, 0);

  const weeklyChartData = [
    { week: 'Minggu 1', amount: jimpitanData.filter(d => d.week_number === 1 && d.month === 1 && d.year === 2026).reduce((s, i) => s + i.amount, 0) },
    { week: 'Minggu 2', amount: jimpitanData.filter(d => d.week_number === 2 && d.month === 1 && d.year === 2026).reduce((s, i) => s + i.amount, 0) },
    { week: 'Minggu 3', amount: jimpitanData.filter(d => d.week_number === 3 && d.month === 1 && d.year === 2026).reduce((s, i) => s + i.amount, 0) },
    { week: 'Minggu 4', amount: jimpitanData.filter(d => d.week_number === 4 && d.month === 1 && d.year === 2026).reduce((s, i) => s + i.amount, 0) },
  ];

  const handleSubmitJimpitan = (e: React.FormEvent) => {
    e.preventDefault();
    const date = new Date(formData.collection_date);
    const weekNumber = Math.ceil(date.getDate() / 7);
    
    const newEntry = {
      id: Date.now(),
      amount: parseInt(formData.amount),
      collection_date: formData.collection_date,
      week_number: weekNumber,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      notes: formData.notes
    };
    
    setJimpitanData([newEntry, ...jimpitanData]);
    setFormData({ amount: '', collection_date: new Date().toISOString().split('T')[0], notes: '' });
  };

  const handleDelete = (id: number) => {
    setJimpitanData(jimpitanData.filter((item: any) => item.id !== id));
  };

  const handleCreateBackup = () => {
    const newBackup = {
      id: Date.now(),
      backup_name: `Backup_${new Date().toISOString().slice(0,10).replace(/-/g, '')}_${new Date().toTimeString().slice(0,5).replace(':', '')}`,
      created_at: new Date().toISOString(),
      restored_at: null
    };
    setBackups([newBackup, ...backups]);
  };

  const handleRestore = (id: number) => {
    setBackups(backups.map((b: any) => 
      b.id === id ? { ...b, restored_at: new Date().toISOString() } : b
    ));
  };

  const filteredData = jimpitanData.filter(
    item => item.month === filterMonth && item.year === filterYear
  );
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentTablePage - 1) * itemsPerPage,
    currentTablePage * itemsPerPage
  );

  const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) => (
    <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 hover:shadow-xl`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatRupiah(value)}</p>
        </div>
        <div className={`p-4 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
      <div className="flex flex-col h-full">
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{appName}</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sistem Pencatatan</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${currentPage === item.id 
                  ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} shadow-lg` 
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  const Header = () => (
    <header className={`sticky top-0 z-40 px-4 lg:px-8 py-4 ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'} border-b backdrop-blur-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`lg:hidden p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {menuItems.find(m => m.id === currentPage)?.label}
          </h2>
        </div>
        
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );

  const DashboardPage = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Pemasukan" value={totalAll} icon={DollarSign} color="bg-gradient-to-br from-blue-500 to-blue-600" />
        <StatCard title="Pemasukan Bulan Ini" value={totalThisMonth} icon={Calendar} color="bg-gradient-to-br from-green-500 to-green-600" />
        <StatCard title="Pemasukan Hari Ini" value={totalToday} icon={TrendingUp} color="bg-gradient-to-br from-purple-500 to-purple-600" />
      </div>
      
      <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Grafik Pemasukan Mingguan - Januari 2026
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="week" stroke={darkMode ? '#9ca3af' : '#6b7280'} tick={{ fontSize: 12 }} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000)}K`} />
              <Tooltip 
                formatter={(value) => [formatRupiah(value as number), 'Pemasukan']}
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#2563eb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Entri Terbaru
        </h3>
        <div className="space-y-3">
          {jimpitanData.slice(0, 5).map((item) => (
            <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatRupiah(item.amount)}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatShortDate(item.collection_date)} • {item.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const InputPage = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Tambah Jimpitan Baru
        </h3>
        <form onSubmit={handleSubmitJimpitan} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Jumlah (Rp)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Contoh: 100000"
              required
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
                ${darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Tanggal
            </label>
            <input
              type="date"
              value={formData.collection_date}
              onChange={(e) => setFormData({ ...formData, collection_date: e.target.value })}
              required
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
                ${darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Catatan
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Contoh: Jimpitan malam Jumat"
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-none
                ${darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Simpan Jimpitan
          </button>
        </form>
      </div>
      
      <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Entri Terbaru
        </h3>
        <div className="space-y-3">
          {jimpitanData.slice(0, 5).map((item) => (
            <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div>
                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatRupiah(item.amount)}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatShortDate(item.collection_date)}</p>
              </div>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.notes}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const RiwayatPage = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bulan</label>
            <select
              value={filterMonth}
              onChange={(e) => { setFilterMonth(parseInt(e.target.value)); setCurrentTablePage(1); }}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
                ${darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tahun</label>
            <select
              value={filterYear}
              onChange={(e) => { setFilterYear(parseInt(e.target.value)); setCurrentTablePage(1); }}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
                ${darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-4 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tanggal</th>
                <th className={`text-left py-4 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Jumlah</th>
                <th className={`text-left py-4 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Catatan</th>
                <th className={`text-center py-4 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? paginatedData.map((item) => (
                <tr key={item.id} className={`border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
                  <td className={`py-4 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{formatShortDate(item.collection_date)}</td>
                  <td className={`py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatRupiah(item.amount)}</td>
                  <td className={`py-4 px-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.notes || '-'}</td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className={`py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
              Menampilkan {((currentTablePage - 1) * itemsPerPage) + 1} - {Math.min(currentTablePage * itemsPerPage, filteredData.length)} dari {filteredData.length} data
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentTablePage(p => Math.max(1, p - 1))}
                disabled={currentTablePage === 1}
                className={`p-2 rounded-lg transition-colors ${currentTablePage === 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
                {currentTablePage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentTablePage(p => Math.min(totalPages, p + 1))}
                disabled={currentTablePage === totalPages}
                className={`p-2 rounded-lg transition-colors ${currentTablePage === totalPages 
                  ? 'opacity-50 cursor-not-allowed' 
                  : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const BackupPage = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Kelola Backup
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleCreateBackup}
            className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Download className="w-5 h-5" />
            Buat Backup
          </button>
          <button
            className={`flex items-center justify-center gap-3 py-4 px-6 font-semibold rounded-xl border-2 border-dashed transition-all duration-300
              ${darkMode 
                ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50' 
                : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
              }`}
          >
            <Upload className="w-5 h-5" />
            Restore Backup
          </button>
        </div>
      </div>
      
      <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Export Data
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FileText className="w-5 h-5" />
            Export PDF
          </button>
          <button
            className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Export Excel
          </button>
        </div>
      </div>
      
      <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Riwayat Backup
        </h3>
        <div className="space-y-3">
          {backups.map((backup) => (
            <div key={backup.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl gap-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{backup.backup_name}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Dibuat: {formatDate(backup.created_at)}
                  {backup.restored_at && ` • Direstore: ${formatDate(backup.restored_at)}`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRestore(backup.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${darkMode 
                      ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  Restore
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${darkMode 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SettingsPage = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Pengaturan Aplikasi
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Nama Aplikasi
            </label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
                ${darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Contoh: Jimpitan RT 05 RW 02
            </p>
          </div>
          
          <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mode Gelap</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Aktifkan tampilan gelap untuk kenyamanan mata
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
        
        <button className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          Simpan Pengaturan
        </button>
      </div>
      
      <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Informasi Aplikasi
        </h3>
        <div className="space-y-3">
          <div className={`flex justify-between py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Versi</span>
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>1.0.0</span>
          </div>
          <div className={`flex justify-between py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Total Data</span>
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>{jimpitanData.length} entri</span>
          </div>
          <div className={`flex justify-between py-2`}>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Terakhir Diupdate</span>
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>25 Januari 2026</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'input': return <InputPage />;
      case 'riwayat': return <RiwayatPage />;
      case 'backup': return <BackupPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar />
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="lg:ml-64">
        <Header />
        <main className="p-4 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
