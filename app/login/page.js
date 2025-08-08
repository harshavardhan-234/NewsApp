'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          placeholder="Email"
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          placeholder="Password"
          style={{ width: '100%', marginBottom: 5 }}
        />

        <div style={{ textAlign: 'right', marginBottom: 10 }}>
          <Link href="/forgot-password" style={{ fontSize: 14, color: '#0070f3' }}>
            Forgot Password?
          </Link>
        </div>

        <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>
          Login
        </button>
      </form>

      <div style={{ textAlign: 'center', margin: '1rem 0' }}>— OR —</div>

      <button
        onClick={() => signIn('google')}
        style={{
          width: '100%',
          padding: '0.5rem',
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
