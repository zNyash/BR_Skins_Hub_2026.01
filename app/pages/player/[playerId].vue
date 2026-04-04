<template>
  <div class="flex w-full flex-col items-center gap-12">
    <section
      v-if="player"
      class="flex w-full max-w-4xl flex-col items-center gap-1 px-2 md:px-4 lg:px-0"
    >
      <div class="relative h-62 w-full">
        <div class="bg-background/0 from-default absolute inset-0 z-10 bg-linear-to-t to-75%" />
        <img :src="player.cover_url" alt="" class="size-full rounded-xl object-cover" />
      </div>
      <!-- Player Info -->
      <span class="z-10 -mt-16 flex w-full items-end justify-start gap-4 px-12">
        <a
          class="size-26 shrink-0"
          :href="`https://osu.ppy.sh/users/${player.osu_id}`"
          target="_blank"
        >
          <img
            :src="`https://a.ppy.sh/${playerId}`"
            alt=""
            class="squircle size-full rounded-3xl object-cover drop-shadow-lg"
          />
        </a>

        <div class="flex w-full items-center">
          <div class="flex flex-col">
            <!-- Player Name and Previous Usernames -->
            <div class="flex">
              <UPopover mode="hover" v-if="player.previous_usernames?.length">
                <h1 class="isHovering cursor-help text-2xl font-medium">{{ player.name }}</h1>
                <template #content>
                  <span class="popover-content gap-2 select-text!">
                    {{ player.previous_usernames?.join(", ") }}
                  </span>
                </template>
              </UPopover>
              <h1 v-else class="isHovering cursor-help text-2xl font-medium">{{ player.name }}</h1>
            </div>

            <!-- Player Description -->
            <div v-if="isOwnProfile" class="text-toned -mt-2">
              <p>The first line of your description goes here unformatted.</p>
            </div>
          </div>

          <!-- Player Links -->
          <div class="ml-auto"></div>
        </div>
      </span>
    </section>

    <section class="flex w-full max-w-4xl flex-col px-2 md:px-4 lg:px-0">
      <div class="flex w-full justify-between">
        <UTabs v-model="activeTab" :items="tabs" size="sm" variant="pill" />
        <UInput
          v-if="activeTab === 'skins'"
          placeholder="Search skins..."
          class="search-input-default-size"
          :icon="ICONS.SEARCH"
          v-model="skinSearchQuery"
        />
      </div>

      <!-- Skins Tab -->
      <div v-if="activeTab === 'skins'" class="mt-2 grid w-full grid-cols-2 gap-2">
        <div v-for="skin in filteredSkins" :key="skin._id">
          <SkinCard :skin="skin" :disabled="true" />
        </div>
      </div>

      <!-- About Tab -->
      <div v-else-if="activeTab === 'about'" class="mt-2">
        <UAlert
          title="Currently work in progress!"
          description="I'm working on this feature right now and soon enough you guys will be able to set your about information! You can also contribute to the project on Github if you want to speed up the process :)"
          variant="subtle"
          color="info"
          class="max-w-md"
          icon="lucide:construction"
          :actions="[
            {
              label: 'Github',
              icon: 'simple-icons:github',
              href: 'https://github.com/zNyash/BR_Skins_Hub',
            },
          ]"
          :ui="{
            icon: 'size-11',
          }"
        />
      </div>

      <!-- Setup Tab -->
      <div v-else-if="activeTab === 'setup'" class="mt-2">
        <UAlert
          title="Currently work in progress!"
          description="I'm working on this feature right now and soon enough you guys will be able to set your about information! You can also contribute to the project on Github if you want to speed up the process :)"
          variant="subtle"
          color="info"
          class="max-w-md"
          icon="lucide:construction"
          :actions="[
            {
              label: 'Github',
              icon: 'simple-icons:github',
              href: 'https://github.com/zNyash/BR_Skins_Hub',
            },
          ]"
          :ui="{
            icon: 'size-11',
          }"
        />
      </div>
    </section>

    <LoadingPage :is-loading="isLoading" />
  </div>
</template>

<script lang="ts" setup>
import { api } from "~~/convex/_generated/api";
import { useRouteParams } from "@vueuse/router";
import { ICONS } from "~/types/icons";
import Fuse from "fuse.js";
import type { AvatarProps, BadgeProps } from "@nuxt/ui";

// ------ Local Types & Defaults ------
type TabItem = {
  label?: string;
  icon?: string;
  avatar?: AvatarProps;
  badge?: string | number | BadgeProps;
  content?: string;
  value?: string | number;
  disabled?: boolean;
  slot?: string;
  class?: any;
};

// ------ Props & Emits ------
const playerId = useRouteParams("playerId", 1, { transform: Number });

// ------ External Composables ------
const { user } = useAuth();
const { data: player, isPending: isPlayerPending } = useConvexQuery(api.players.getPlayerByOsuId, {
  osu_id: playerId.value,
});
const { data: skins, isPending: isSkinsPending } = useConvexQuery(api.playerSkins.getSkinsByOsuId, {
  osu_id: playerId.value,
});

// ------ Local State ------
const activeTab = ref("skins");
const skinSearchQuery = ref("");
const tabs = ref<TabItem[]>([
  { label: "Skins", value: "skins" },
  { label: "About", value: "about" },
  { label: "Setup", value: "setup" },
]);

// ------ Computed ------
const isLoading = computed(() => isPlayerPending.value || isSkinsPending.value);
const isOwnProfile = computed(() => !!user.value && user.value.osu_id === playerId.value);

const title = computed(() => {
  if (isPlayerPending.value) return "Loading player...";
  if (player.value) return `${player.value.name}'s Skins | BR Skins Hub`;
  return "Player Not Found | BR Skins Hub";
});

const filteredSkins = computed(() => {
  if (!skins.value?.length) return [];
  if (!skinSearchQuery.value) return skins.value;

  const fuse = new Fuse(skins.value, {
    keys: ["name", "osu_id"],
    threshold: 0.5,
  });

  return fuse.search(skinSearchQuery.value).map((result) => result.item);
});

// ------ Lifecycle ------
useSeoMeta({
  title: () => title.value,
  ogTitle: () => title.value,
  ogImage: `https://a.ppy.sh/${playerId.value}`,
});
</script>
