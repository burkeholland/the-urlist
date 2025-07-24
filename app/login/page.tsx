"use client";


import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [success, setSuccess] = useState('');

  // Email/password login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    setLoading(false);
  }

  // Email/password sign up
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Sign up successful! Please check your email to confirm your account.');
    }
    setLoading(false);
  }

  // Google login
  async function handleGoogleLogin() {
    setLoading(true);
    setError('');
    setSuccess('');
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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 flex items-center justify-center">
      <Container>
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md p-10 flex flex-col gap-8 border border-gray-200 shadow-xl rounded-2xl bg-white/90">
            <h1 className="text-4xl font-extrabold text-center text-indigo-700 drop-shadow-sm pt-2 pb-2">
              {isSignUp ? 'Create an account' : 'Sign in to your account'}
            </h1>
            {error && (
              <Alert variant="destructive" className="mb-2">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default" className="mb-2">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="flex flex-col gap-5">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="text-base py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="text-base py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-lg font-semibold"
              >
                {loading ? (isSignUp ? 'Signing up...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Login')}
              </Button>
            </form>
            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 text-lg font-semibold"
            >
              <FcGoogle size={22} />
              {loading ? 'Redirecting...' : (isSignUp ? 'Sign up with Google' : 'Sign in with Google')}
            </Button>
            <div className="flex justify-center mt-2">
              <button
                type="button"
                className="text-indigo-600 hover:underline text-sm"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccess('');
                }}
              >
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </Card>
        </div>
      </Container>
    </main>
  );
}
