export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  // Known Nuxt/Nitro bug (github.com/nuxt/nuxt/issues/33132): the production
  // server build can end up importing a default export from 'vue' that
  // doesn't exist under Node's own module resolution (only under Vite's).
  // Forcing Vite to fully optimize/bundle vue instead of treating it as an
  // external dependency is the community-confirmed workaround.
  vite: {
    optimizeDeps: {
      include: ['vue', 'vue-router'],
    },
    ssr: {
      noExternal: ['vue', 'vue-router'],
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],
  // Used by @nuxtjs/sitemap and @nuxtjs/i18n to build absolute URLs (sitemap
  // <loc>, hreflang alternates). Update NUXT_PUBLIC_SITE_URL once the real
  // domain is decided — everything downstream reads from this one value.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://pradana.dev',
  },
  i18n: {
    langDir: 'locales',
    locales: [
      { code: 'id', language: 'id-ID', name: 'Indonesia', file: 'id.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'id',
    strategy: 'prefix_except_default',
    // strictSeo needs this explicitly — it doesn't fall back to `site.url`.
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://pradana.dev',
    // No browser-language auto-redirect: there's an explicit manual switcher
    // in the navbar, and auto-detection on '/' was fighting it — landing back
    // on '/' after switching to 'id' would get redirected straight back to
    // '/en' based on a stale detection cookie.
    detectBrowserLanguage: false,
    // Auto-injects <link rel="alternate" hreflang="..."> + canonical tags into
    // every page's <head> — without this, nothing tells Google that '/about'
    // and '/en/about' are the same content in two languages.
    experimental: {
      strictSeo: true,
    },
  },
  // Admin is behind auth and has nothing to offer a search index.
  routeRules: {
    '/admin/**': { robots: false },
  },
  robots: {
    disallow: ['/admin'],
  },
  sitemap: {
    // Admin is noindex'd via routeRules already; it shouldn't even be listed
    // in the sitemap (that's a contradictory signal to send Google).
    exclude: ['/admin/**'],
    // Dynamic project URLs are added at runtime via the `sitemap:sources`
    // Nitro hook (server/plugins/sitemap-projects.ts) — a config-time
    // function here can't work because `sitemap.urls` gets serialized into
    // runtime config, and functions aren't JSON-serializable.
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
      // Site-wide OG defaults; pages override og:title/description/image via
      // useSeoMeta — this just covers the fallback case where a page forgets to.
      meta: [
        { property: 'og:site_name', content: 'Pradana Aldi Musthofa' },
      ],
    },
  },
})
