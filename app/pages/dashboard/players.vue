<template>
  <div class="flex w-full max-w-2xl flex-col gap-4">
    <UButton
      label="Add Player"
      :icon="ICONS.ADD"
      class="ml-auto w-fit"
      @click="isCreatePlayerOpen = true"
    />
    <ModalsCreatePlayer v-model:open="isCreatePlayerOpen" />

    <div class="grid w-full grid-cols-2 gap-1.5">
      <LoadingPage :isLoading="playersLoading" />
      <TransitionGroup name="listPlayers">
        <PlayerCard
          v-if="playersList"
          v-for="player in playersList"
          :key="player._id"
          :_playerId="player._id"
          :playerName="player.name"
          :cover-url="player.cover_url"
          :osuId="player.osu_id"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";

// ------ External Composables ------
const { data: playersList, isPending: playersLoading } = useConvexQuery(api.players.listPlayers);

// ------ Local State ------
const isCreatePlayerOpen = ref(false);
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
