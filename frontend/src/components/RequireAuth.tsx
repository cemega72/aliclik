'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadMe } from '../slices/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, initialized } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!initialized) dispatch(loadMe());
  }, [initialized, dispatch]);

  useEffect(() => {
    if (initialized && !user) {
      router.replace('/login');
    }
  }, [initialized, user, router]);

  if (!initialized) return <div style={{ padding: 16 }}>Cargando sesión...</div>;
  if (!user) return null;
  return <>{children}</>;
}
