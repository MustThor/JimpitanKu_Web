'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useTheme } from '@/hooks/useTheme';
import { useAppSettings } from '@/hooks/useAppSettings';
import { MENU_ITEMS } from '@/lib/constants';
import { validateSettingsInput } from '@/lib/utils/validation';

export default function SettingsPage() {
  const { darkMode, toggleTheme } = useTheme();
  const { appName, nominalDefault, theme, isLoaded, saveSettings, setAppName: setAppNameState, setNominalDefault: setNominalDefaultState, setTheme: setThemeState } = useAppSettings();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isLoaded) {
      setThemeState(darkMode ? 'dark' : 'light');
    }
  }, [darkMode, isLoaded, setThemeState]);

  const handleSave = async () => {
    setSuccessMessage('');

    const validation = validateSettingsInput({
      app_name: appName,
      nominal_default: nominalDefault,
      theme,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSaving(true);

    // Save to localStorage using the hook
    saveSettings({
      app_name: appName,
      nominal_default: nominalDefault,
      theme,
    });

    // Update theme immediately
    if (theme === 'dark' && !darkMode) {
      toggleTheme();
    } else if (theme === 'light' && darkMode) {
      toggleTheme();
    }

    setIsSaving(false);
    setSuccessMessage('Pengaturan berhasil disimpan!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  return (
    <ProtectedRoute>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        menuItems={MENU_ITEMS}
        currentPage="settings"
        onPageChange={(page) => router.push(`/${page}`)}
        darkMode={darkMode}
        appName={appName}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64">
        <Header
          title="Settings"
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="p-4 lg:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Pengaturan Aplikasi
              </h3>

              {successMessage && (
                <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl">
                  {successMessage}
                </div>
              )}

              <div className="space-y-5">
                <Input
                  label="Nama Aplikasi"
                  type="text"
                  value={appName}
                  onChange={(e) => setAppNameState(e.target.value)}
                  placeholder="Contoh: Angsana Residence"
                  error={errors.app_name}
                />

                <Input
                  label="Nominal Default (Rp)"
                  type="number"
                  value={nominalDefault}
                  onChange={(e) => setNominalDefaultState(e.target.value)}
                  placeholder="Contoh: 2000"
                  error={errors.nominal_default}
                />

                <Select
                  label="Tema"
                  value={theme}
                  onChange={(e) => setThemeState(e.target.value as 'light' | 'dark')}
                  options={themeOptions}
                  error={errors.theme}
                />

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </Button>
              </div>
            </div>

            <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Tentang Aplikasi
              </h3>
              <div className="space-y-3">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {appName}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Versi 1.0.0
                  </p>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Aplikasi ini dibuat untuk membantu pencatatan iuran jimpitan komunitas {appName}.
                  Data disimpan secara online dan dapat di-backup kapan saja.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
