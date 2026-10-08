// Project detail pages (/projects/[slug]) come from the backend API, not
// Nuxt's file-based pages — @nuxtjs/sitemap can only auto-discover the
// latter. This hooks into the sitemap at request-time (not build-time,
// since this app runs as a live SSR server rather than being prerendered)
// and adds one URL per project, in both languages.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:sources', async (ctx) => {
    try {
      const apiBase = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5229/api'
      const projects = await $fetch<{ slug: string }[]>(`${apiBase}/projects`)
      ctx.sources.push({
        context: { name: 'projects:dynamic' },
        urls: projects.flatMap(p => [
          { loc: `/projects/${p.slug}` },
          { loc: `/en/projects/${p.slug}` },
        ]),
      })
    } catch {
      // Sitemap generation shouldn't 500 just because the API is briefly down.
    }
  })
})
