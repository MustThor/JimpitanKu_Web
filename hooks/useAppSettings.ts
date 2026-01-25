'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_SETTINGS } from '@/lib/constants';

export interface AppSettings {
  app_name: string;
  nominal_default: string;
  theme: 'light' | 'dark';
}

export function useAppSettings() {
  const [appName, setAppName] = useState<string>(DEFAULT_SETTINGS.app_name);
  const [nominalDefault, setNominalDefault] = useState<string>(DEFAULT_SETTINGS.nominal_default);
  const [theme, setTheme] = useState<'light' | 'dark'>(DEFAULT_SETTINGS.theme);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAppName = localStorage.getItem('app_name');
      const savedNominalDefault = localStorage.getItem('nominal_default');
      const savedTheme = localStorage.getItem('theme');

      if (savedAppName) setAppName(savedAppName);
      if (savedNominalDefault) setNominalDefault(savedNominalDefault);
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setTheme(savedTheme as 'light' | 'dark');
      }

      setIsLoaded(true);
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (settings: Partial<AppSettings>) => {
    if (typeof window !== 'undefined') {
      if (settings.app_name !== undefined) {
        localStorage.setItem('app_name', settings.app_name);
        setAppName(settings.app_name);
      }
      if (settings.nominal_default !== undefined) {
        localStorage.setItem('nominal_default', settings.nominal_default);
        setNominalDefault(settings.nominal_default);
      }
      if (settings.theme !== undefined) {
        localStorage.setItem('theme', settings.theme);
        setTheme(settings.theme);
      }
    }
  };

  return {
    appName,
    nominalDefault,
    theme,
    isLoaded,
    saveSettings,
    setAppName,
    setNominalDefault,
    setTheme,
  };
}
