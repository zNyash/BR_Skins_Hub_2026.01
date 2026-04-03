<template>
  <div class="flex w-full flex-col items-center">
    <div class="flex w-full max-w-5xl flex-col gap-2 p-2">
      <!-- Search Input -->
      <div class="flex w-full items-center justify-between gap-2">
        <span class="flex w-full items-center gap-1 text-nowrap">
          <UInput
            v-model="inputSearch"
            :icon="ICONS.SEARCH"
            placeholder="Search players by name or ID..."
            class="search-input-default-size"
          />

          <!-- Players Count -->
          <span>
            <p v-if="playersList?.length" class="text-muted pl-2 text-sm">
              {{ playersList.length }} players
            </p>
            <p v-else class="text-muted pl-2 text-sm">Loading...</p>
          </span>
        </span>

        <div class="flex shrink-0 items-center gap-1">
          <!-- Sorting Buttons -->
          <UButton
            size="sm"
            color="neutral"
            :variant="sortBy === 'name' ? 'soft' : 'ghost'"
            :trailing-icon="
              sortBy === 'name'
                ? sortDir === 'asc'
                  ? ICONS.SORT_NAME_ASC
                  : ICONS.SORT_NAME_DESC
                : ICONS.SORT_NAME_ASC
            "
            @click="toggleSort('name')"
            >Name</UButton
          >
          <UButton
            size="sm"
            color="neutral"
            :variant="sortBy === '_creationTime' ? 'soft' : 'ghost'"
            :trailing-icon="
              sortBy === '_creationTime'
                ? sortDir === 'asc'
                  ? ICONS.SORT_DATE_ASC
                  : ICONS.SORT_DATE_DESC
                : ICONS.SORT_DATE_ASC
            "
            @click="toggleSort('_creationTime')"
            >Date</UButton
          >
        </div>
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
        <MainPlayerCard v-for="player in visiblePlayers" :key="player._id" :player="player" />
        <div v-if="canLoadMore" ref="loadMoreTrigger" class="flex justify-center py-4">
          <p class="text-muted animate-pulse text-sm">Loading more...</p>
        </div>
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
import { useIntersectionObserver } from "@vueuse/core";
import Fuse from "fuse.js";
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";

// ------ Local Types & Defaults ------
type SortField = "name" | "_creationTime";
type SortDir = "asc" | "desc";

// ------ External Composables ------
const { data: playersList, isPending: isLoadingPlayers } = useConvexQuery(api.players.listPlayers);

// ------ Local State ------
const inputSearch = ref("");
const sortBy = ref<SortField>("name");
const sortDir = ref<SortDir>("asc");

// ------ Computed ------
const paginationResetTrigger = computed(
  () => `${sortBy.value}-${sortDir.value}-${inputSearch.value}`,
);

const sortedPlayers = computed(() => {
  if (!playersList.value) return [];
  const list = [...playersList.value];
  list.sort((a, b) => {
    if (sortBy.value === "name") return a.name.localeCompare(b.name);
    return a._creationTime - b._creationTime;
  });
  return sortDir.value === "desc" ? list.reverse() : list;
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

// ------ Actions ------
const toggleSort = (field: SortField) => {
  if (sortBy.value === field) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortDir.value = "asc";
  }
};

// ------ Paginating and loading more players ------
const {
  visibleItems: visiblePlayers,
  canLoadMore,
  loadMore,
} = useLoadMore(filteredPlayers, {
  pageSize: 32,
  resetTrigger: paginationResetTrigger,
});

// Automatically load more players when the user scrolls to the bottom of the list.
const loadMoreTrigger = ref<HTMLElement | null>(null);
useIntersectionObserver(loadMoreTrigger, ([entry]) => {
  if (entry?.isIntersecting && canLoadMore.value) {
    loadMore();
  }
});

// ------ Lifecycle ------
useSeoMeta({
  title: "Players List | BR Skins Hub",
  ogTitle: "Players List | BR Skins Hub",
});
</script>
