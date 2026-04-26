export async function apiFetch(
    url: string,
    options: RequestInit = {}
){
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        ...options,
        credentials: 'include', // envia access_token cookie
        headers: {
            ...options.headers,
            'Content-Type': 'application/json',
        },
    });

    // 🔥 se expirou, tenta refresh
    if (res.status === 401) {
        const refreshed = await refreshToken();

        if (refreshed) {
            return apiFetch(url, options);
        }
    }

    return res;
}

// 🔁 refresh centralizado
export async function refreshToken(): Promise<boolean> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
    });
    
    if (!res.ok) {
        return false;
    }

    return true;
}