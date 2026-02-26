<template>
  <div class="flex w-full flex-col items-center">
    <div v-if="playersList" class="grid w-full max-w-2xl grid-cols-2 gap-2">
      <MainPlayerCard v-for="player in playersList" :key="player._id" :player="player" />
    </div>
    <div v-else class="grid w-full max-w-2xl grid-cols-2 gap-2">
      <USkeleton class="h-14 w-full" />
      <USkeleton class="h-14 w-full" />
      <USkeleton class="h-14 w-full" />
      <USkeleton class="h-14 w-full" />
      <USkeleton class="h-14 w-full" />
      <USkeleton class="h-14 w-full" />
      <USkeleton class="h-14 w-full" />
      <USkeleton class="h-14 w-full" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { api } from "~~/convex/_generated/api";

const { data: playersList } = useConvexQuery(api.players.listPlayers);
</script>
