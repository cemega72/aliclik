'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { register } from '@/src/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await dispatch(register({ email, password, name: name || undefined }))
      .unwrap()
      .then(() => true)
      .catch(() => false);
    if (ok) router.push('/dashboard/users');
  }

  return (
    <main style={{ padding: 24, maxWidth: 520, margin: '0 auto' }}>
      <h1>Crear cuenta</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={{ width: '100%' }} />
        </label>
        <label>
          Nombre (opcional)
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" style={{ width: '100%' }} />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={8} required style={{ width: '100%' }} />
        </label>
        <button disabled={loading} type="submit">{loading ? 'Registrando...' : 'Registrarme'}</button>
        {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      </form>
      <p style={{ marginTop: 12 }}>
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
      </p>
    </main>
  );
}
