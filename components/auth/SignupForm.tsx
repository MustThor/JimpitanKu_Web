'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SignupFormProps {
  onSignupAttempt?: (email: string) => boolean;
}

export function SignupForm({ onSignupAttempt }: SignupFormProps) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Log form values for debugging
    console.log('[SignupForm] Form submission:', {
      name: name,
      email: email,
      emailTrimmed: email.trim(),
      emailLength: email.length,
      passwordLength: password.length,
      confirmPasswordLength: confirmPassword.length,
      passwordMatch: password === confirmPassword,
      timestamp: new Date().toISOString()
    });

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password harus minimal 6 karakter');
      return;
    }

    // Check if email is allowed (if onSignupAttempt is provided)
    if (onSignupAttempt && !onSignupAttempt(email)) {
      setError('Email tidak diizinkan untuk registrasi');
      return;
    }

    setLoading(true);

    const { error: signUpError } = await signUp(email, password, name);

    if (signUpError) {
      console.error('[SignupForm] Signup failed:', signUpError);
      setError(signUpError);
    } else {
      console.log('[SignupForm] Signup successful');
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded text-center">
        <svg className="mx-auto h-12 w-12 text-green-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold mb-2">Pendaftaran Berhasil!</h3>
        <p className="text-sm">
          Silakan cek email Anda untuk konfirmasi akun, lalu login.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nama Lengkap
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimal 6 karakter"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Konfirmasi Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Ulangi password"
          required
          disabled={loading}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Memuat...' : 'Daftar'}
      </Button>
    </form>
  );
}
