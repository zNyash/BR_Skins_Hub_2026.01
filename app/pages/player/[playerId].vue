<template>
  <div class="flex w-full flex-col items-center gap-12">
    <section v-if="player" class="flex w-full flex-col items-center gap-1 px-2 md:px-4 lg:px-0">
      <div class="relative w-full max-w-4xl">
        <div class="bg-background/0 from-default absolute inset-0 z-10 bg-linear-to-t to-50%" />
        <img :src="player.cover_url" alt="" class="w-full rounded-xl object-cover" />
      </div>
      <span class="z-10 -mt-24 flex flex-col items-center">
        <a class="size-26" :href="`https://osu.ppy.sh/users/${player.osu_id}`" target="_blank">
          <img
            :src="`https://a.ppy.sh/${playerId}`"
            alt=""
            class="squircle size-full rounded-3xl object-cover drop-shadow-lg"
          />
        </a>
        <div>
          <UPopover mode="hover">
            <h1 class="isHovering cursor-help text-2xl font-medium">{{ player.name }}</h1>

            <template #content>
              <span class="popover-content gap-2 select-text!">
                {{ player.previous_usernames?.join(", ") }}
              </span>
            </template>
          </UPopover>
        </div>
      </span>
    </section>

    <section v-if="skins" class="flex w-full max-w-4xl flex-col gap-2 px-2 md:px-4 lg:px-0">
      <UInput
        placeholder="Search skins..."
        class="search-input-default-size"
        :icon="ICONS.SEARCH"
        v-model="skinSearchQuery"
      />
      <div class="grid w-full grid-cols-2 gap-2">
        <div v-for="skin in filteredSkins" :key="skin._id" class="">
          <SkinCard :skin="skin" :disabled="true" />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { api } from "~~/convex/_generated/api";
import { useRouteParams } from "@vueuse/router";
import { ICONS } from "~/types/icons";
import Fuse from "fuse.js";

// ------ Props & Emits ------
const playerId = useRouteParams("playerId", 1, { transform: Number });

// ------ External Composables ------
const { data: player, isPending: isPlayerPending } = useConvexQuery(api.players.getPlayerByOsuId, {
  osu_id: playerId.value,
});
const { data: skins } = useConvexQuery(api.playerSkins.getSkinsByOsuId, { osu_id: playerId.value });

// ------ Local State ------
const skinSearchQuery = ref("");

// ------ Computed ------
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

<style></style>
