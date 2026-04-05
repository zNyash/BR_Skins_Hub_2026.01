<template>
  <div class="flex h-full flex-col gap-2">
    <UInput
      v-model="searchQuery"
      placeholder="Search players..."
      :icon="ICONS.SEARCH"
      class="shrink-0"
    />

    <div class="flex-1 overflow-y-auto p-2">
      <div v-if="isLoading" class="flex flex-col gap-1.5">
        <USkeleton v-for="n in 12" :key="n" class="h-10 w-full" />
      </div>

      <div v-else-if="filteredPlayers.length" class="flex flex-col gap-1">
        <button
          v-for="player in filteredPlayers"
          :key="player._id"
          class="hover:bg-elevated flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors"
          :class="{ 'bg-elevated ring-primary ring-1': store.selectedPlayer?._id === player._id }"
          @click="handleSelect(player)"
        >
          <span class="truncate text-sm font-medium">{{ player.name }}</span>
        </button>
      </div>

      <p v-else class="text-muted py-4 text-center text-sm">No players found.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSorted } from "@vueuse/core";
import { api } from "~~/convex/_generated/api";
import type { Doc } from "~~/convex/_generated/dataModel";
import { ICONS } from "~/types/icons";

// ------ Props & Emits ------
const emit = defineEmits<{
  (e: "request-select", player: Doc<"players">): void;
}>();

// ------ External Composables ------
const store = useDashboardStore();
const { data: playersList, isPending: isLoading } = useConvexQuery(api.players.listPlayers);

// ------ Local State ------
const searchQuery = ref("");

// ------ Computed ------
const sortedPlayers = useSorted(
  () => playersList.value || [],
  (a, b) => b._creationTime - a._creationTime,
);

const filteredPlayers = useFuzzyFilter(sortedPlayers, searchQuery, {
  keys: ["name", "osu_id"],
});

// ------ Actions ------
function handleSelect(player: Doc<"players">) {
  if (store.isDirty) {
    emit("request-select", player);
    return;
  }
  store.selectPlayer(player);
}
</script>
