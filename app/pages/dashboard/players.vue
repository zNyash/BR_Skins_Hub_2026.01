<template>
  <div class="flex w-full max-w-5xl flex-col gap-2 p-2">
    <div class="flex w-full items-center justify-between gap-2">
      <UInput
        v-model="inputSearch"
        placeholder="Search players..."
        :icon="ICONS.SEARCH"
        class="search-input-default-size"
      />
      <div>
        <UButton
          label="Add Player"
          :icon="ICONS.ADD"
          class="ml-auto w-fit"
          @click="isCreatePlayerOpen = true"
        />
        <ModalsCreatePlayer v-model:open="isCreatePlayerOpen" />
      </div>
    </div>

    <div
      v-if="filteredPlayers.length"
      class="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
    >
      <TransitionGroup name="listPlayers">
        <PlayerCard
          v-if="filteredPlayers"
          v-for="player in filteredPlayers"
          :key="player._id"
          :player="player"
        />
      </TransitionGroup>
    </div>
    <div v-else class="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      <USkeleton v-for="n in 32" :key="n" class="h-13.5 w-full" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";
import { useSorted } from "@vueuse/core";
import Fuse from "fuse.js";

// ------ External Composables ------
const { data: playersList, isPending: playersLoading } = useConvexQuery(api.players.listPlayers);

// ------ Local State ------
const isCreatePlayerOpen = ref(false);
const inputSearch = ref("");

// ------ Computed ------
const sortedPlayers = useSorted(
  () => playersList.value || [],
  (a, b) => b._creationTime - a._creationTime,
);

const filteredPlayers = computed(() => {
  if (!inputSearch.value) return sortedPlayers.value;

  const fuse = new Fuse(sortedPlayers.value, {
    keys: ["name", "osu_id"],
    threshold: 0.3,
  });

  return fuse.search(inputSearch.value).map((result) => result.item);
});

// ------ Lifecycle ------
useSeoMeta({
  title: "Manage Players | BR Skins Hub Dashboard",
  ogTitle: "Manage Players | BR Skins Hub Dashboard",
});
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
