'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { login } from '@/src/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await dispatch(login({ email, password })).unwrap().then(() => true).catch(() => false);
    if (ok) router.push('/dashboard/users');
  }

  return (
    <main style={{ padding: 24, maxWidth: 520, margin: '0 auto' }}>
      <h1>Iniciar sesión</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={{ width: '100%' }} />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={8} required style={{ width: '100%' }} />
        </label>
        <button disabled={loading} type="submit">{loading ? 'Ingresando...' : 'Entrar'}</button>
        {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      </form>
      <p style={{ marginTop: 12 }}>
        ¿No tienes cuenta? <a href="/register">Regístrate</a>
      </p>
    </main>
  );
}
