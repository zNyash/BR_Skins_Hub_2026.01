<template>
  <div
    class="bg-muted hover:ring-primary relative isolate flex w-full items-center gap-2 overflow-hidden rounded-md p-2 shadow-lg ring ring-transparent transition-all duration-150 hover:cursor-pointer"
    @click="handleRedirect"
  >
    <!-- Background cover + overlay -->
    <div class="absolute inset-0 -z-10 opacity-50" v-if="player.cover_url">
      <img :src="player.cover_url" alt="" class="h-full w-full object-cover" />
      <div class="absolute inset-0 h-full w-full bg-black/70"></div>
    </div>

    <div>
      <img :src="`https://a.ppy.sh/${player.osu_id}`" alt="" class="pfp size-11" />
    </div>

    <div class="flex flex-col justify-center">
      <p class="text-lg font-medium">{{ player.name }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Doc } from "~~/convex/_generated/dataModel";

type Player = Doc<"players">;

const props = defineProps<{
  player: Player;
}>();

const handleRedirect = () => {
  navigateTo(`/player/${props.player.osu_id}`);
};
</script>

<style>
.pfp {
  border-radius: 0.5rem;
}
@supports (corner-shape: squircle) {
  .pfp {
    corner-shape: squircle;
    border-radius: 2rem;
  }
}
</style>
