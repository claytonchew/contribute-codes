// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-04-03",

  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/test-utils/module",
    "@nuxt/ui",
    "nuxt-auth-utils",
    "@nuxt/content",
    "@nuxt/fonts",
    "@nuxt/image",
  ],

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },

  content: {
    markdown: {
      anchorLinks: false,
    },
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL,
    },
    session: {
      maxAge: 60 * 60 * 24 * 7, // Session expires after 7 days
    },
  },
});
