<template>
  <div class="flex w-full max-w-2xl flex-col items-center gap-4">
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
    <div class="grid w-full grid-cols-2 gap-2" v-if="isLoadingSkins">
      <USkeleton v-for="n in 8" :key="n" class="h-[259.75px] w-full" />
    </div>
    <div class="grid w-full grid-cols-2 gap-2" v-else-if="filteredSkins.length">
      <SkinCard v-for="skin in filteredSkins" :key="skin._id" :skin="skin" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";
import { useSorted } from "@vueuse/core";
import Fuse from "fuse.js";

// ------ External Composables ------
const { data: skinsList, isPending: isLoadingSkins } = useConvexQuery(api.skins.listSkins);

// ------ Local State ------
const isCreateSkinOpen = ref(false);
const inputSearch = ref("");

// ------ Computed ------
// Make here the sorted skins list by time created (createdAt)
const sortedSkins = useSorted(
  () => skinsList.value || [],
  (a, b) => b._creationTime - a._creationTime,
);

// Make here the filtered skins list by search input (inputSearch)
const filteredSkins = computed(() => {
  if (!inputSearch.value) return sortedSkins.value;

  const fuse = new Fuse(sortedSkins.value, {
    keys: ["name", "author"],
    threshold: 0.3,
  });

  return fuse.search(inputSearch.value).map((result) => result.item);
});

// ------ Lifecycle ------
useSeoMeta({
  title: "Manage Skins | BR Skins Hub Dashboard",
  ogTitle: "Manage Skins | BR Skins Hub Dashboard",
});
</script>

<style></style>
