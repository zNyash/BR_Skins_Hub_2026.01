<template>
  <div class="flex w-full flex-col items-center">
    <div v-if="playersList" class="flex w-full max-w-2xl flex-col gap-4">
      <UInput
        v-model="inputSearch"
        :icon="ICONS.SEARCH"
        placeholder="Search players by name or ID..."
        class="w-full max-w-60"
      />

      <div v-if="filteredPlayers?.length" class="grid w-full grid-cols-2 gap-2">
        <MainPlayerCard v-for="player in filteredPlayers" :key="player._id" :player="player" />
      </div>

      <div v-else class="text-muted-foreground flex flex-col items-center justify-center py-10">
        <UIcon :name="ICONS.FROWN" class="text-muted-foreground/50 mb-2 h-10 w-10" />
        <p>No players found matching "{{ inputSearch }}"</p>
      </div>
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
import Fuse from "fuse.js";
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";

// ------ External Composables ------
const { data: playersList } = useConvexQuery(api.players.listPlayers);

// ------ Local State ------
const inputSearch = ref("");

// ------ Computed ------
const filteredPlayers = computed(() => {
  if (!playersList.value) return [];
  if (!inputSearch.value) return playersList.value;

  const fuse = new Fuse(playersList.value, {
    keys: ["name", "osu_id"],
    threshold: 0.4,
  });

  return fuse.search(inputSearch.value).map((result) => result.item);
});
</script>
