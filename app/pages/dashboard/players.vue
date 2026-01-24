<template>
  <div class="mx-auto flex max-w-md flex-col gap-4">
    <ModalsCreatePlayer />

    <div class="flex flex-col gap-2">
      <div v-if="playersLoading" class="flex w-full flex-col justify-center gap-2">
        <USkeleton class="h-13.5 w-full" />
        <USkeleton class="h-13.5 w-full" />
        <USkeleton class="h-13.5 w-full" />
        <USkeleton class="h-13.5 w-full" />
        <USkeleton class="h-13.5 w-full" />
      </div>
      <TransitionGroup name="listPlayers">
        <PlayerCard
          v-for="player in playersList"
          :key="player._id"
          :_id="player._id"
          :name="player.name"
          :osu_id="player.osu_id"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { api } from "~~/convex/_generated/api";

const { data: playersList, isPending: playersLoading } = useConvexQuery(api.players.listPlayers);
</script>

<style scoped>
.listPlayers-enter-active,
.listPlayers-leave-active {
  transition: all 0.3s ease;
}
.listPlayers-enter-from,
.listPlayers-leave-to {
  opacity: 0;
}
.listPlayers-enter-to,
.listPlayers-leave-from {
  opacity: 1;
}
</style>
