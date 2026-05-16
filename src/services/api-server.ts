
// No seu arquivo de utilitários (ex: api-server.ts)
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function apiServerFetch(url: string, options: RequestInit = {}) {

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
        ...options,
        headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Repassa os cookies manualmente para a API
        },

    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro HTTP: ${res.status}`);
    }

    return res;
}