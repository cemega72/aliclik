'use client';

import { useEffect, useState } from 'react';
import RequireAuth from '@/src/components/RequireAuth';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { createUser, deleteUser, fetchUsers, updateUser } from '@/src/slices/usersSlice';
import { logout } from '@/src/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { rows, loading, error } = useAppSelector((s) => s.users);
  const me = useAppSelector((s) => s.auth.user);

  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      await dispatch(updateUser({ id: editingId, email: form.email || undefined, name: form.name || undefined, password: form.password || undefined }));
    } else {
      await dispatch(createUser({
        email: form.email,
        name: form.name || undefined,
        password: form.password,
      }));
    }
    setForm({ email: '', name: '', password: '' });
    setEditingId(null);
  }

  function startEdit(id: number) {
    const u = rows.find(x => x.id === id);
    if (!u) return;
    setEditingId(id);
    setForm({ email: u.email, name: u.name ?? '', password: '' });
  }

  async function doLogout() {
    await dispatch(logout());
    router.push('/login');
  }

  return (
    <RequireAuth>
      <main style={{ padding: 24, maxWidth: 980, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Usuarios</h1>
            <p style={{ margin: 0 }}>Conectado como: {me?.email}</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="/pokemon">Ver Pokemon</a>
            <button onClick={doLogout}>Salir</button>
          </div>
        </header>

        <section style={{ marginTop: 20, border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
          <h2 style={{ marginTop: 0 }}>{editingId ? `Editar usuario #${editingId}` : 'Crear usuario'}</h2>
          <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12 }}>
            <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required={!editingId} />
            <input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder={editingId ? 'Password (opcional)' : 'Password'} type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} />
            <button disabled={loading} type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
          </form>
          {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
        </section>

        <section style={{ marginTop: 20 }}>
          <h2>Listado</h2>
          {loading ? <p>Cargando...</p> : null}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>ID</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Email</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Nombre</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{u.id}</td>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{u.email}</td>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{u.name ?? '-'}</td>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => startEdit(u.id)}>Editar</button>
                      <button onClick={() => dispatch(deleteUser(u.id))}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </RequireAuth>
  );
}
