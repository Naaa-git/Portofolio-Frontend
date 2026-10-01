import type { PublicClientApplication } from '@azure/msal-browser'

// Shared singleton: both the login page (to start loginRedirect) and app.vue
// (to catch the redirect coming back, which can land on ANY page) need the
// exact same MSAL instance/config.
let instancePromise: Promise<PublicClientApplication> | null = null

export function useMsal() {
  if (!instancePromise) {
    const config = useRuntimeConfig()
    instancePromise = import('@azure/msal-browser').then(async ({ PublicClientApplication }) => {
      const instance = new PublicClientApplication({
        auth: {
          clientId: config.public.microsoftClientId,
          authority: 'https://login.microsoftonline.com/consumers',
          redirectUri: window.location.origin,
        },
      })
      await instance.initialize()
      return instance
    })
  }
  return instancePromise
}
