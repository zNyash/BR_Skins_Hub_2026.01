<template>
  <NuxtLink
    class="bg-muted hover:ring-primary relative isolate flex w-full items-center gap-2 overflow-hidden rounded-md p-2 shadow-lg ring ring-transparent transition-all duration-150 hover:cursor-pointer"
    :to="`/player/${player.osu_id}`"
  >
    <!-- Background cover + overlay -->
    <div class="absolute inset-0 -z-10 opacity-50" v-if="player.cover_url">
      <img :src="player.cover_url" alt="" class="h-full w-full object-cover" />
      <div class="absolute inset-0 h-full w-full bg-black/70"></div>
    </div>

    <div>
      <img :src="`https://a.ppy.sh/${player.osu_id}`" alt="" class="squircle size-11 rounded-xl" />
    </div>

    <div class="flex flex-col justify-center">
      <p class="text-lg font-medium">{{ player.name }}</p>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { Doc } from "~~/convex/_generated/dataModel";

// ------ Local Types & Defaults ------
type Player = Doc<"players">;

// ------ Props & Emits ------
const props = defineProps<{
  player: Player;
}>();
</script>

<style></style>
