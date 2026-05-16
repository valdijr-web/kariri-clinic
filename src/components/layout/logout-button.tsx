'use client';

import { useRouter } from 'next/navigation';
import { apiFetch } from '@/services/api';

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await apiFetch('/auth/logout', { method: 'POST' });
  }

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push('/login');
    }
  };

  return (
    <button onClick={handleLogout} style={{ /* estilos básicos, ajuste conforme necessário */ }}>
      Logout
    </button>
  );
}
