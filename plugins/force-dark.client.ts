import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin((nuxtApp) => {
  document.documentElement.classList.remove("light");
  document.documentElement.classList.add("dark");
});
