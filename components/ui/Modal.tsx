'use client';

import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  darkMode?: boolean;
}

export function Modal({ isOpen, onClose, title, children, darkMode = false }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl transform transition-all
          ${darkMode ? 'bg-gray-800' : 'bg-white'}
        `}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b
          ${darkMode ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors
              ${darkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }
            `}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
