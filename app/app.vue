<template>
  <UApp>
    <nav
      class="border-muted bg-mantle/25 fixed top-0 z-50 flex w-full items-center justify-center border-b backdrop-blur-3xl"
    >
      <UNavigationMenu :items="menuItems" class="flex w-full max-w-2xl justify-center" />
    </nav>

    <UMain class="mt-24 mb-24 flex h-full w-full justify-center">
      <NuxtPage />
    </UMain>

    <UFooter>
      <UPopover mode="hover">
        <UButton
          :icon="copied ? ICONS.SUBMIT : 'i-simple-icons-discord'"
          :color="copied ? 'success' : 'neutral'"
          :variant="copied ? 'soft' : 'ghost'"
          aria-label="Discord"
          @click="copy('znyash')"
        />

        <template #content>
          <span class="popover-content select-text!">
            <p>@znyash</p>
          </span>
        </template>
      </UPopover>
      <UPopover mode="hover">
        <UButton
          icon="i-simple-icons-x"
          color="neutral"
          variant="ghost"
          to="https://x.com/VitorNyash_"
          target="_blank"
          aria-label="X"
        />

        <template #content>
          <span class="popover-content select-text!">
            <p>@VitorNyash_</p>
          </span>
        </template>
      </UPopover>
      <UPopover mode="hover">
        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          to="https://github.com/zNyash"
          target="_blank"
          aria-label="GitHub"
        />

        <template #content>
          <span class="popover-content select-text!">
            <p>@zNyash</p>
          </span>
        </template>
      </UPopover>

      <template #right>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </template>
    </UFooter>
  </UApp>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";
import { ICONS } from "./types/icons";
import { useClipboard } from "@vueuse/core";

// ------ External Composables ------
const { isSignedIn } = useAuth();
const { copy, copied } = useClipboard();

// ------ Local State ------
const footerItems: NavigationMenuItem[] = [];

// ------ Computed ------
const menuItems = computed<NavigationMenuItem[]>(() => {
  const items: NavigationMenuItem[] = [
    {
      label: "Players",
      to: "/",
      icon: ICONS.USERS,
    },
    {
      label: "Skins",
      to: "/skins",
      icon: ICONS.BRUSH,
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
