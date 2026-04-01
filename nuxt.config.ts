import tailwindcss from "@tailwindcss/vite";
import { dark } from "@clerk/themes";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["./app/assets/main.css"],
  modules: ["convex-nuxt", "@nuxt/ui", "@uploadthing/nuxt", "@clerk/nuxt"],
  convex: {
    url: process.env.CONVEX_URL,
  },
  clerk: {
    appearance: {
      theme: dark,
    },
  },

  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: "",
    classPrefix: "",
    storageKey: "nuxt-color-mode",
  },
  runtimeConfig: {
    osuClientSecret: process.env.OSU_CLIENT_SECRET,
    public: {
      osuClientId: process.env.OSU_CLIENT_ID,
      currentDomain: process.env.CURRENT_DOMAIN,
    },
  },
});
