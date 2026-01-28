<template>
  <nav
    class="border-muted bg-mantle/25 fixed top-0 z-50 flex w-full justify-center border-b backdrop-blur-3xl"
  >
    <UNavigationMenu :items="menuItems" class="flex w-full max-w-2xl justify-center" />
  </nav>
  <UApp>
    <main class="mt-24 flex w-full justify-center">
      <NuxtPage />
    </main>
  </UApp>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";

const menuItems = ref<NavigationMenuItem[]>([
  {
    label: "Home",
    to: "/",
    icon: "mdi:home-outline",
  },
  {
    label: "Dashboard",
    icon: "mdi:account-multiple-outline",
    children: [
      {
        label: "Manage Players",
        to: "/dashboard/players",
        icon: "mdi:account-cog-outline",
        description: "Add, edit, or remove players from the website and listing.",
      },
      {
        label: "Manage Skins",
        to: "/dashboard/skins",
        icon: "mdi:folder-multiple-outline",
        description:
          "Add, edit, or remove skins from the website and listing. You can change the skin name, author, images and download links here.",
      },
    ],
  },
]);
</script>
