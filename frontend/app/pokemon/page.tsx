'use client';

import { useEffect, useState } from 'react';
import RequireAuth from '@/src/components/RequireAuth';

type PokemonItem = { name: string; url: string };
type PokemonResponse = { count: number; next: string | null; previous: string | null; results: PokemonItem[] };

export default function PokemonPage() {
  const [items, setItems] = useState<PokemonItem[]>([]);
  const [next, setNext] = useState<string | null>(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=0`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMore() {
    if (!next || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(next);
      if (!res.ok) throw new Error(`PokeAPI error (${res.status})`);
      const data = (await res.json()) as PokemonResponse;
      setItems((prev) => [...prev, ...data.results]);
      setNext(data.next);
    } catch (e: any) {
      setError(e?.message ?? 'Error consultando PokeAPI');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RequireAuth>
      <main style={{ padding: 24, maxWidth: 980, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Pokémon</h1>
          <a href="/dashboard/users">Volver a Usuarios</a>
        </header>

        {error ? (
          <div style={{ border: '1px solid crimson', padding: 12, borderRadius: 8, marginTop: 12 }}>
            <p style={{ margin: 0, color: 'crimson' }}>{error}</p>
            <button style={{ marginTop: 8 }} onClick={loadMore}>Reintentar</button>
          </div>
        ) : null}

        <ul style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, padding: 0, listStyle: 'none' }}>
          {items.map((p) => (
            <li key={p.name} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
              <b>{p.name}</b>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 16 }}>
          <button disabled={!next || loading} onClick={loadMore}>
            {loading ? 'Cargando...' : next ? 'Cargar más' : 'No hay más'}
          </button>
        </div>
      </main>
    </RequireAuth>
  );
}
