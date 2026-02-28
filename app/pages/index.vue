<template>
  <div class="flex w-full flex-col items-center">
    <div class="flex w-full max-w-5xl flex-col gap-2 p-2">
      <!-- Search Input -->
      <div class="flex w-full items-end justify-between">
        <UInput
          v-model="inputSearch"
          :icon="ICONS.SEARCH"
          placeholder="Search players by name or ID..."
          class="search-input-default-size"
        />
        <p v-if="playersList?.length" class="text-muted text-sm">
          Loaded {{ playersList.length }} players
        </p>
        <p v-else class="text-muted text-sm">Loading players...</p>
      </div>

      <!-- Loading Skeletons -->
      <div
        v-if="isLoadingPlayers"
        class="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
      >
        <USkeleton v-for="n in 32" :key="n" class="h-15 w-full" />
      </div>

      <!-- Players List -->
      <div
        v-else-if="filteredPlayers.length"
        class="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
      >
        <MainPlayerCard v-for="player in filteredPlayers" :key="player._id" :player="player" />
      </div>

      <!-- No Players Found -->
      <div v-else class="flex flex-col items-center justify-center py-10">
        <div class="text-muted-foreground flex flex-col items-center gap-2">
          <UEmpty
            :title="`No players found matching \u0022${inputSearch}\u0022`"
            description="Are you sure you typed that correctly? You can search by player name or osu! ID."
            :icon="ICONS.FROWN"
            variant="naked"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Fuse from "fuse.js";
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";

// ------ External Composables ------
const { data: playersList, isPending: isLoadingPlayers } = useConvexQuery(api.players.listPlayers);

// ------ Local State ------
const inputSearch = ref("");

// ------ Computed ------
const sortedPlayers = computed(() => {
  if (!playersList.value) return [];
  return [...playersList.value].sort((a, b) => a.name.localeCompare(b.name));
});

const filteredPlayers = computed(() => {
  if (!sortedPlayers.value?.length) return [];
  if (!inputSearch.value) return sortedPlayers.value;

  const fuse = new Fuse(sortedPlayers.value, {
    keys: [
      "name",
      "osu_id",
      "previous_usernames",
    ] satisfies (keyof (typeof sortedPlayers.value)[number])[],
    threshold: 0.3,
  });

  return fuse.search(inputSearch.value).map((result) => result.item);
});

// ------ Lifecycle ------
useSeoMeta({
  title: "Players List | BR Skins Hub",
  ogTitle: "Players List | BR Skins Hub",
});
</script>
