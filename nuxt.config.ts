import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["./app/assets/main.css"],
  modules: ["@nuxt/ui", "convex-nuxt"],
  convex: {
    url: process.env.CONVEX_URL,
  },
  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: "",
    storageKey: "nuxt-color-mode",
  },
});
