import { NextResponse } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import { i18n } from './i18n-config'
import { authEdge } from '@/lib/auth-edge'

function getLocale(request: Request) {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const locales = i18n.locales
  const languages = ['vi', 'en']

  // Ưu tiên "vi" trước
  const viIndex = languages.indexOf('vi')
  if (viIndex !== -1) {
    languages.unshift(languages.splice(viIndex, 1)[0])
  }

  return matchLocale(languages, locales, i18n.defaultLocale)
}

// Đây là middleware chính
export default authEdge(async (req) => {
  const { nextUrl } = req
  const { pathname } = nextUrl
  const isLoggedIn = !!req.auth

  // Bỏ qua các file tĩnh
  if (
    /^(\/_next|\/api|\/favicon\.ico|\/robots\.txt|\/sitemap|\/images|\/fonts|\/css)/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Nếu truy cập root `/`, tự redirect sang ngôn ngữ
  if (pathname === '/') {
    const locale = getLocale(req)
    return NextResponse.redirect(new URL(`/${locale}`, req.url))
  }

  // Kiểm tra nếu đường dẫn không có locale
  const hasLocale = i18n.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (!hasLocale) {
    const locale = getLocale(req)
    const redirectUrl = new URL(`/${locale}${pathname}`, req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Auth logic
  const isOnDashboard = pathname.includes('/dashboard')
  const isOnProfile = pathname.includes('/profile')
  const isOnAuthPage = pathname.includes('/auth')

  if ((isOnDashboard || isOnProfile) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  if (isOnAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
