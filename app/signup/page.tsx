'use client';

import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showBlockedMessage, setShowBlockedMessage] = useState(false);

  // Hardcoded allowed emails
  const ALLOWED_EMAILS = ['admin@jimpitanku.com', 'user@jimpitanku.com'];

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSignupAttempt = (email: string) => {
    if (!ALLOWED_EMAILS.includes(email)) {
      setShowBlockedMessage(true);
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">J</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Buat Akun JimpitanKu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Atau{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              masuk dengan akun yang sudah ada
            </Link>
          </p>
        </div>

        {showBlockedMessage ? (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-red-900">Registrasi Diblokir</h3>
                <p className="mt-2 text-sm text-red-700">
                  Registrasi baru tidak diizinkan. Hanya email yang telah ditentukan yang dapat mengakses sistem ini.
                </p>
                <p className="mt-2 text-xs text-red-600">
                  Email yang diizinkan: admin@jimpitanku.com, user@jimpitanku.com
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ke Halaman Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <SignupForm onSignupAttempt={handleSignupAttempt} />
          </div>
        )}

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Kembali ke halaman utama
          </Link>
        </div>
      </div>
    </div>
  );
}
