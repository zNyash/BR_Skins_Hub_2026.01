<template>
  <div>
    <section v-if="player" class="flex flex-col items-center gap-1">
      <div class="squircle size-24 overflow-hidden rounded-[50%]">
        <img :src="`https://a.ppy.sh/${playerId}`" alt="" class="size-full object-cover" />
      </div>
      <div>
        <h1 class="text-lg font-medium">{{ player.name }}</h1>
      </div>
    </section>

    <section v-if="skins" class="grid w-full max-w-3xl grid-cols-2 gap-2">
      <div v-for="skin in skins" :key="skin._id" class="">
        <SkinCard :skin="skin" :disabled="true" />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { api } from "~~/convex/_generated/api";
import { useRouteParams } from "@vueuse/router";

// ------ Props & Emits ------
const playerId = useRouteParams("playerId", 1, { transform: Number });

// ------ External Composables ------
const { data: player, isPending: isPlayerPending } = useConvexQuery(api.players.getPlayerByOsuId, {
  osu_id: playerId.value,
});
const { data: skins } = useConvexQuery(api.playerSkins.getSkinsByOsuId, { osu_id: playerId.value });

// ------ Computed ------
const title = computed(() => {
  if (isPlayerPending.value) return "Loading player...";
  if (player.value) return `${player.value.name}'s Skins | BR Skins Hub`;
  return "Player Not Found | BR Skins Hub";
});

// ------ Lifecycle ------
useHead(() => ({
  title: title.value,
}));
</script>

<style></style>
