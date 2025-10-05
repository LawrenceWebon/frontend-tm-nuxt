// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Enable modules
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],

  // Alias configuration for app directory structure
  alias: {
    '~': '.',
    '@': './app',
    '@shared': './app/shared',
    '@features': './app/features'
  },

  // TypeScript configuration
  typescript: {
    typeCheck: false
  },

  // Vite configuration for path resolution
  vite: {
    resolve: {
      alias: {
        '@': './app',
        '@shared': './app/shared',
        '@features': './app/features'
      }
    }
  },

  // Runtime config for API
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost',
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost/api',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Task Manager',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
      enableAnalytics: process.env.NUXT_PUBLIC_ENABLE_ANALYTICS === 'true',
      enableDebug: process.env.NUXT_PUBLIC_ENABLE_DEBUG === 'true',
      csrfEnabled: process.env.NUXT_PUBLIC_CSRF_ENABLED !== 'false',
      devTools: process.env.NUXT_PUBLIC_DEV_TOOLS === 'true'
    }
  },

  // Nitro configuration for API proxy
  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost',
        changeOrigin: true,
        prependPath: true
      }
    }
  },

  // CSS - Tailwind CSS is auto-configured

  // App configuration
  app: {
    head: {
      title: 'Task Manager',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A simple and elegant task management application' }
      ]
    }
  },

  // Router configuration to handle service worker requests
  router: {
    options: {
      // This helps prevent router warnings for non-page routes
      strict: false
    }
  }
})
