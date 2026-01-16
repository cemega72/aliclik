import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>
      <h1>Aliclik - Prueba técnica</h1>
      <p>Demo: autenticación JWT, CRUD de usuarios y listado de Pokémon.</p>
      <ul>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/register">Registro</Link></li>
        <li><Link href="/dashboard/users">Usuarios (protegido)</Link></li>
        <li><Link href="/pokemon">Pokémon</Link></li>
      </ul>
    </main>
  );
}
