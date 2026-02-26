<template>
  <div class="flex w-full flex-col items-center">
    <div class="flex w-full max-w-2xl flex-col gap-4">
      <UInput
        v-model="inputSearch"
        :icon="ICONS.SEARCH"
        placeholder="Search players by name or ID..."
        class="w-full max-w-60"
      />

      <div v-if="filteredPlayers.length" class="grid w-full grid-cols-2 gap-2">
        <MainPlayerCard v-for="player in filteredPlayers" :key="player._id" :player="player" />
      </div>

      <div
        v-else-if="!filteredPlayers.length && !isLoadingPlayers"
        class="text-muted-foreground flex flex-col items-center justify-center py-10"
      >
        <UIcon :name="ICONS.FROWN" class="text-muted-foreground/50 mb-2 h-10 w-10" />
        <p>No players found matching "{{ inputSearch }}"</p>
      </div>

      <div v-if="isLoadingPlayers" class="grid w-full max-w-2xl grid-cols-2 gap-2">
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
    keys: ["name", "osu_id"],
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
