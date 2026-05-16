// middleware.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

//import * as jose from 'jose'; // biblioteca para verificar JWT no Edge

// Lista de rotas que não exigem autenticação
const publicRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

    // 🔥 ignora APIs
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Tenta ler o cookie 'access_token' (HttpOnly)
  const token = request.cookies.get('access_token')?.value;

  //se tiver token e rota for login ou register, redireciona para dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }

  // Se a rota é pública, deixa passar sem verificar token
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Se não existe token, redireciona para login
  if (!token) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // Token existe: deixa a requisição prosseguir
  return NextResponse.next();
  // Verifica se o token é válido usando a mesma chave secreta do Laravel
  //   try {
  //     const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  //     await jose.jwtVerify(token, secret);
  //     // Token válido: deixa a requisição prosseguir
  //     return NextResponse.next();
  //   } catch (error) {
  //     // Token inválido ou expirado: redireciona para login
  //     const url = new URL('/login', request.url);
  //     return NextResponse.redirect(url);
  //   }
}

// Configura em quais caminhos o middleware deve rodar (evita rodar em arquivos estáticos)
export const config = {
  //matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
   matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};