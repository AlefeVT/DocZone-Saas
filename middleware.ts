import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { DEFAULT_LOGIN_REDIRECT, LANDING_PAGE_ROUTE, apiAuthPrefix, authRoutes, publicRoutes } from '@/routes';

const { auth } = NextAuth(authConfig);

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default auth(async (req) => {
  const { nextUrl } = req;

  if (req.auth && req.auth.user?.email) {
    const email = req.auth.user.email;

    // Chame a API route para verificar a assinatura do usuário
    await fetch(`${baseUrl}/api/check-subscription?email=${encodeURIComponent(email)}`);
  }

  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (nextUrl.searchParams.has('payment') && isLoggedIn) {
      return Response.redirect(new URL(LANDING_PAGE_ROUTE, nextUrl));
    }

    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return null;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
