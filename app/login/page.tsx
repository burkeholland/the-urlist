"use client";

import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email/password login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    setLoading(false);
  }

  // Google login
  async function handleGoogleLogin() {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6 mx-4">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">Sign in to your account</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold shadow transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 p-3 rounded-lg font-semibold shadow transition disabled:opacity-50"
          disabled={loading}
        >
          <FcGoogle size={22} />
          {loading ? 'Redirecting...' : 'Sign in with Google'}
        </button>
        {error && <div className="text-red-600 text-center mt-2">{error}</div>}
      </div>
    </div>
  );
}
