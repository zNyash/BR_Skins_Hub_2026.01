<template>
  <UApp>
    <nav
      class="border-muted bg-mantle/25 fixed top-0 z-50 flex w-full items-center justify-center border-b backdrop-blur-3xl"
    >
      <UButton label="Login" class="invisible" />
      <UNavigationMenu :items="menuItems" class="flex w-full max-w-2xl justify-center" />
      <UButton v-if="!isSignedIn" @click="login" label="Login" />
      <UButton v-else @click="logout" label="Logout" color="neutral" variant="ghost" />
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
    </UFooter>
  </UApp>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";
import { ICONS } from "./types/icons";
import { useClipboard } from "@vueuse/core";

// ------ External Composables ------
const { isAdmin, isSignedIn, user } = useAuth();
const { copy, copied } = useClipboard();
const runtimeConfig = useRuntimeConfig();

// ------ Lifecycle ------
await callOnce(async () => {
  const { cookie } = useRequestHeaders(["cookie"]);
  user.value = await $fetch("/api/auth/me", {
    headers: cookie ? { cookie } : {},
  });
});

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

  if (isAdmin.value) {
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
// ------ Actions ------
const login = () => {
  const params = new URLSearchParams({
    client_id: runtimeConfig.public.osuClientId,
    redirect_uri: `${runtimeConfig.public.currentDomain}/api/auth/callback`,
    response_type: "code",
    scope: "identify",
  });

  window.location.href = `https://osu.ppy.sh/oauth/authorize?${params}`;
};

const logout = () => {
  window.location.href = "/api/auth/logout";
};
</script>
