// Project detail pages (/projects/[slug]) come from the backend API, not
// Nuxt's file-based pages — @nuxtjs/sitemap can only auto-discover the
// latter. This hooks into the sitemap at request-time (not build-time,
// since this app runs as a live SSR server rather than being prerendered)
// and adds one URL per project, in both languages.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:sources', async (ctx) => {
    try {
      // This plugin only ever runs server-side (it's a Nitro plugin), so it
      // always uses the internal (Docker-network) address, never the public
      // one — same reasoning as apiClient.ts.
      const apiBase = process.env.NUXT_API_BASE_INTERNAL || 'http://localhost:5229/api'
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
