// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Enable modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

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
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost'
    }
  },

  // Nitro configuration for API proxy
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost',
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
  }
})
