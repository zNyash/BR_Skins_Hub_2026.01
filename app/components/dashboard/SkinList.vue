<template>
  <div class="flex h-full flex-col gap-2">
    <UInput
      v-model="searchQuery"
      placeholder="Search skins..."
      :icon="ICONS.SEARCH"
      class="shrink-0"
    />

    <div class="flex-1 overflow-y-auto p-2">
      <div v-if="isLoading" class="flex flex-col gap-1.5">
        <USkeleton v-for="n in 12" :key="n" class="h-12 w-full" />
      </div>

      <div v-else-if="filteredSkins.length" class="flex flex-col gap-1">
        <button
          v-for="skin in filteredSkins"
          :key="skin._id"
          class="hover:bg-elevated flex w-full items-center gap-2.5 rounded-lg p-1 text-left transition-colors"
          :class="{ 'bg-elevated ring-primary ring-1': store.selectedSkin?._id === skin._id }"
          @click="store.selectSkin(skin)"
        >
          <img
            v-if="skin.preview_images[0]"
            :src="skin.preview_images[0]"
            class="aspect-video h-8 shrink-0 rounded object-cover"
            :alt="skin.name"
          />
          <div class="min-w-0">
            <p class="truncate text-sm font-medium">{{ skin.name }}</p>
            <p class="text-muted truncate text-xs">{{ skin.author }}</p>
          </div>
        </button>
      </div>

      <p v-else class="text-muted py-4 text-center text-sm">No skins found.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Fuse from "fuse.js";
import { useSorted } from "@vueuse/core";
import { api } from "~~/convex/_generated/api";
import { ICONS } from "~/types/icons";

// ------ External Composables ------
const store = useDashboardStore();
const { data: skinsList, isPending: isLoading } = useConvexQuery(api.skins.listSkins);

// ------ Local State ------
const searchQuery = ref("");

// ------ Computed ------
const sortedSkins = useSorted(
  () => skinsList.value || [],
  (a, b) => b._creationTime - a._creationTime,
);

const filteredSkins = computed(() => {
  if (!searchQuery.value.trim()) return sortedSkins.value;

  const fuse = new Fuse(sortedSkins.value, {
    keys: ["name", "author"],
    threshold: 0.3,
  });

  return fuse.search(searchQuery.value).map((r) => r.item);
});
</script>
