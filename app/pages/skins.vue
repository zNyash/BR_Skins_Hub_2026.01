<template>
  <div class="flex w-full flex-col items-center">
    <section class="flex w-full max-w-5xl flex-col gap-2 p-2">
      <!-- Search Input -->
      <div class="flex w-full items-center justify-between gap-2">
        <span class="flex w-full items-center gap-1 text-nowrap">
          <UInput
            v-model="inputSearch"
            placeholder="Search skins..."
            :icon="ICONS.SEARCH"
            class="search-input-default-size"
          />

          <!-- Skins Count -->
          <span>
            <p v-if="skinsList?.length" class="text-muted pl-2 text-sm">
              {{ skinsList.length }} skins
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

      <div
        v-if="isLoadingSkins"
        class="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
      >
        <SkinCard v-for="n in 16" :key="n" loading />
      </div>

      <div v-else-if="filteredSkins.length" class="flex w-full flex-col gap-4">
        <div class="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          <SkinCard
            v-for="skin in visibleSkins"
            :key="skin._id"
            :skin="skin"
            :disabled="!isAdmin"
          />
        </div>

        <div v-if="canLoadMore" ref="loadMoreTrigger" class="flex justify-center py-4">
          <p class="text-muted animate-pulse text-sm">Loading more...</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";
import { useIntersectionObserver } from "@vueuse/core";
import Fuse from "fuse.js";

// ------ Local Types & Defaults ------
type SortField = "name" | "_creationTime";
type SortDir = "asc" | "desc";

// ------ External Composables ------
const { isAdmin } = useAuth();
const { data: skinsList, isPending: isLoadingSkins } = useConvexQuery(
  api.skins.listSkinsWithPlayers,
);

// ------ Local State ------
const inputSearch = ref("");
const sortBy = ref<SortField>("_creationTime");
const sortDir = ref<SortDir>("desc");

// ------ Computed ------
const paginationResetTrigger = computed(
  () => `${sortBy.value}-${sortDir.value}-${inputSearch.value}`,
);

const sortedSkins = computed(() => {
  if (!skinsList.value) return [];
  const list = [...skinsList.value];
  list.sort((a, b) => {
    if (sortBy.value === "name") return a.name.localeCompare(b.name);
    return a._creationTime - b._creationTime;
  });
  return sortDir.value === "desc" ? list.reverse() : list;
});

const filteredSkins = computed(() => {
  if (!inputSearch.value) return sortedSkins.value;

  const fuse = new Fuse(sortedSkins.value, {
    keys: ["name", "author", "playerNames"],
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

// ------ Paginating and loading more skins ------
const {
  visibleItems: visibleSkins,
  canLoadMore,
  loadMore,
} = useLoadMore(filteredSkins, {
  pageSize: 16,
  resetTrigger: paginationResetTrigger,
});

// Automatically load more skins when the user scrolls to the bottom of the list.
const loadMoreTrigger = ref<HTMLElement | null>(null);
useIntersectionObserver(loadMoreTrigger, ([entry]) => {
  if (entry?.isIntersecting && canLoadMore.value) {
    loadMore();
  }
});
</script>

<style></style>
