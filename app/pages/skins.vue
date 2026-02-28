<template>
  <div class="flex w-full flex-col items-center">
    <section class="flex w-full max-w-5xl flex-col gap-2 p-2">
      <div class="flex w-full items-end justify-between">
        <UInput
          v-model="inputSearch"
          placeholder="Search skins..."
          :icon="ICONS.SEARCH"
          class="search-input-default-size"
        />
        <p v-if="skinsList?.length" class="text-muted text-sm">
          Loaded {{ skinsList.length }} skins
        </p>
        <p v-else class="text-muted text-sm">Loading skins...</p>
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
            :disabled="!isSignedIn"
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
import { useIntersectionObserver, useSorted } from "@vueuse/core";
import Fuse from "fuse.js";

// ------ External Composables ------
const { isSignedIn } = useAuth();
const { data: skinsList, isPending: isLoadingSkins } = useConvexQuery(api.skins.listSkins);

// ------ Local State ------
const inputSearch = ref("");

// ------ Sorting and Filtering Skins ------
const sortedSkins = useSorted(
  () => skinsList.value || [],
  (a, b) => a.name.localeCompare(b.name),
);
const filteredSkins = computed(() => {
  if (!inputSearch.value) return sortedSkins.value;

  const fuse = new Fuse(sortedSkins.value, {
    keys: ["name", "author"],
    threshold: 0.3,
  });

  const results = fuse.search(inputSearch.value).map((result) => result.item);
  return results;
});

// ------ Paginating and loading more skins ------
const {
  visibleItems: visibleSkins,
  canLoadMore,
  loadMore,
} = useLoadMore(filteredSkins, {
  pageSize: 16,
  resetTrigger: inputSearch,
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
