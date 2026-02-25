<template>
  <nav
    class="border-muted bg-mantle/25 fixed top-0 z-50 flex w-full items-center justify-center border-b backdrop-blur-3xl"
  >
    <UNavigationMenu :items="menuItems" class="flex w-full max-w-2xl justify-center" />
    <SignedIn>
      <UserButton />
    </SignedIn>
  </nav>
  <UApp>
    <main class="mt-24 flex w-full justify-center">
      <NuxtPage />
    </main>
  </UApp>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";
import { ICONS } from "./types/icons";

// ------ External Composables ------
const { isSignedIn } = useAuth();

// ------ Computed ------
const menuItems = computed<NavigationMenuItem[]>(() => {
  const items: NavigationMenuItem[] = [
    {
      label: "Home",
      to: "/",
      icon: ICONS.HOME,
    },
  ];

  if (isSignedIn.value) {
    items.push({
      label: "Dashboard",
      icon: ICONS.DASHBOARD,
      children: [
        {
          label: "Manage Players",
          to: "/dashboard/players",
          icon: ICONS.USER_COG,
          description: "Add, edit, or remove players from the website and listing.",
        },
        {
          label: "Manage Skins",
          to: "/dashboard/skins",
          icon: ICONS.FOLDER,
          description:
            "Add, edit, or remove skins from the website and listing. You can change the skin name, author, images and download links here.",
        },
      ],
    });
  }

  return items;
});
</script>
