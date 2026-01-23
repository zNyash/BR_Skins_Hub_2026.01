import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["./app/assets/main.css"],
  modules: ["convex-nuxt", "shadcn-nuxt", "@nuxtjs/color-mode"],
  convex: {
    url: process.env.CONVEX_URL,
  },
  shadcn: {
    prefix: "Ui",
  },
  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: "",
    classPrefix: "",
    storageKey: "nuxt-color-mode",
  },
});
