<template>
  <div class="flex w-full max-w-2xl flex-col gap-4">
    <UButton
      label="Add Player"
      :icon="ICONS.BUTTONS.ADD"
      class="ml-auto w-fit"
      @click="isCreatePlayerOpen = true"
    />
    <ModalsCreatePlayer v-model:open="isCreatePlayerOpen" />

    <div class="grid w-full grid-cols-2 gap-1.5">
      <div
        v-if="playersLoading"
        class="bg-default absolute inset-0 flex w-full flex-col items-center justify-center gap-2"
      >
        <img
          src="https://cdn.discordapp.com/attachments/1190788539462451306/1456881064932020388/20260103_SmokyDeliciousCattleGingerPower-6kMh0nApUS0z9faQ_source-ezgif.com-video-to-gif-converter_2.gif?ex=69784c39&is=6976fab9&hm=8fda7e19e0f7d5d3d2574ee8ed9cdce945dc4a215af058a8d5389db3d767e886"
          alt="Loading"
          class="w-lg animate-bounce duration-75"
        />
      </div>
      <TransitionGroup name="listPlayers">
        <PlayerCard
          v-if="playersList"
          v-for="player in playersList"
          :key="player._id"
          :_playerId="player._id"
          :playerName="player.name"
          :osuId="player.osu_id"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";

// ------ Composables ------
const { data: playersList, isPending: playersLoading } = useConvexQuery(api.players.listPlayers);

// ------ State ------
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
