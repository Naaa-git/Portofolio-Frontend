export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/image',
    '@nuxtjs/i18n',
  ],
  i18n: {
    langDir: 'locales',
    locales: [
      { code: 'id', language: 'id-ID', name: 'Indonesia', file: 'id.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'id',
    strategy: 'prefix_except_default',
    // No browser-language auto-redirect: there's an explicit manual switcher
    // in the navbar, and auto-detection on '/' was fighting it — landing back
    // on '/' after switching to 'id' would get redirected straight back to
    // '/en' based on a stale detection cookie.
    detectBrowserLanguage: false,
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5229/api',
      // Client IDs are not secrets — they're meant to be embedded in frontend
      // JS (anyone can see them in page source). The actual secret-equivalent
      // checks (allowlist, signature verification) all happen server-side.
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '270030833451-185ec46ih3j2dctgesvhd9njpvdg11as.apps.googleusercontent.com',
      microsoftClientId: process.env.NUXT_PUBLIC_MICROSOFT_CLIENT_ID || '1403150d-3b9d-4657-8b97-947726385205',
    },
  },
  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
      ],
    },
  },
})
