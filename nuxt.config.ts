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
  ],

  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24 * 7, // Session expires after 7 days
    },
    smtp: {
      fromEmail: process.env.SMTP_FROM_EMAIL,
      replyToEmail: process.env.SMTP_REPLY_TO_EMAIL,
      host: process.env.SMTP_HOST,
      port:
        typeof process.env.SMTP_PORT === "string"
          ? parseInt(process.env.SMTP_PORT)
          : process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASS,
      tls:
        typeof process.env.SMTP_TLS === "string"
          ? process.env.SMTP_TLS === "true"
          : process.env.SMTP_TLS,
    },
    public: {
      baseUrl: process.env.BASE_URL,
    },
  },
});
