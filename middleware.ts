import { checkAndCreateSessionCart } from '@/lib/actions/cart.actions'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const cartResult = await checkAndCreateSessionCart(request)
  
  const protectedPaths = [
    '/shipping-address',
    '/payment-method',
    '/place-order',
    '/profile',
    '/order',
  ]

  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path)) && !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  if (cartResult instanceof NextResponse) {
    return cartResult
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|_next/assets|favicon.ico).*)',
  ],
}