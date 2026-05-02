'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/services/api';

interface User {
    name: string,
    email: string,
    avatar?: string,
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const res = await apiFetch('/auth/me', {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    }
    console.log('Loading user...');
    loadUser();
  }, []);

  return { user };
}
