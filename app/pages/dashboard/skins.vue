<template>
  <div class="flex w-full max-w-5xl flex-col gap-2 p-2">
    <div class="flex w-full justify-between">
      <UInput
        v-model="inputSearch"
        placeholder="Search skins..."
        :icon="ICONS.SEARCH"
        class="search-input-default-size"
      />
      <div>
        <UButton :icon="ICONS.ADD" @click="isCreateSkinOpen = true">Add Skin</UButton>
        <ModalsCreateSkin v-model:open="isCreateSkinOpen" />
      </div>
    </div>

    <!-- Skins Display -->
    <div class="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3" v-if="isLoadingSkins">
      <SkinCard v-for="n in 16" :key="n" loading />
    </div>
    <div
      class="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
      v-else-if="filteredSkins.length"
    >
      <SkinCard v-for="skin in visibleSkins" :key="skin._id" :skin="skin" />

      <div v-if="canLoadMore" ref="loadMoreTrigger" class="flex justify-center py-4">
        <p class="text-muted animate-pulse text-sm">Loading more...</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";
import { useIntersectionObserver, useSorted } from "@vueuse/core";
import Fuse from "fuse.js";

// ------ External Composables ------
const { data: skinsList, isPending: isLoadingSkins } = useConvexQuery(api.skins.listSkins);

// ------ Local State ------
const isCreateSkinOpen = ref(false);
const inputSearch = ref("");

// ------ Sorting and Filtering Skins ------
const sortedSkins = useSorted(
  () => skinsList.value || [],
  (a, b) => b._creationTime - a._creationTime,
);
const filteredSkins = computed(() => {
  if (!inputSearch.value) return sortedSkins.value;

  const fuse = new Fuse(sortedSkins.value, {
    keys: ["name", "author"],
    threshold: 0.3,
  });

  return fuse.search(inputSearch.value).map((result) => result.item);
});

// ------ Paginating and loading more skins ------
const {
  visibleItems: visibleSkins,
  canLoadMore,
  loadMore,
} = useLoadMore(filteredSkins, {
  pageSize: 12,
});

const loadMoreTrigger = ref<HTMLElement | null>(null);
useIntersectionObserver(loadMoreTrigger, ([entry]) => {
  if (entry?.isIntersecting && canLoadMore.value) {
    loadMore();
  }
});

// ------ Lifecycle ------
useSeoMeta({
  title: "Manage Skins | BR Skins Hub Dashboard",
  ogTitle: "Manage Skins | BR Skins Hub Dashboard",
});
</script>

<style></style>
