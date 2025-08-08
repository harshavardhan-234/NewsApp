'use client';

import { useState } from 'react';

export default function ResetPasswordPage() {
  const [form, setForm] = useState({
    email: '',
    otp: '',
    newPassword: '',
  });

  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Password reset successful! You can now login.');
    } else {
      setMessage(data.error || 'Reset failed.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Enter OTP"
          required
          value={form.otp}
          onChange={(e) => setForm({ ...form, otp: e.target.value })}
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="New Password"
          required
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          style={{ width: '100%', marginBottom: 10 }}
        />
        <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>
          Reset Password
        </button>
      </form>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
