// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  sourcemap: {
    server: false,
    client: false,
  },
  devtools: {
    enabled: false,
  },
  compatibilityDate: '2026-06-09',
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    editSecret: process.env.EDIT_SECRET,
    public: {
      apiBase: 'http://127.0.0.1:8000/api'
    },
    session: {
      password: process.env.NUXT_SESSION_PASSWORD,
    },
    oauth: {
      twitch: {
        clientId: process.env.NUXT_OAUTH_TWITCH_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_TWITCH_CLIENT_SECRET,
        redirectURL: 'https://discordine-slack.f5.si/auth/twitch'
      }
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      allowedHosts: [
        'discordine-slack.f5.si'
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: ['nuxt-auth-utils'],

})