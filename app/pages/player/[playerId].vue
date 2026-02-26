<template>
  <div class="flex w-full flex-col items-center gap-12">
    <section v-if="player" class="flex flex-col items-center gap-1">
      <a
        class="squircle size-24 overflow-hidden rounded-3xl"
        :href="`https://osu.ppy.sh/users/${player.osu_id}`"
        target="_blank"
      >
        <img :src="`https://a.ppy.sh/${playerId}`" alt="" class="size-full object-cover" />
      </a>
      <div>
        <h1 class="text-lg font-medium">{{ player.name }}</h1>
      </div>
    </section>

    <section v-if="skins" class="flex w-full max-w-3xl flex-col gap-2">
      <UInput
        placeholder="Search skins..."
        class="w-60"
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
useHead(() => ({
  title: title.value,
}));
</script>

<style></style>
