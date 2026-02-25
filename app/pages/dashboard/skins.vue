<template>
  <div class="flex w-full max-w-2xl flex-col items-center gap-4">
    <div class="flex w-full justify-end">
      <UButton :icon="ICONS.BUTTONS.ADD" @click="isCreateSkinOpen = true">Add Skin</UButton>
      <ModalsCreateSkin v-model:open="isCreateSkinOpen" />
    </div>

    <!-- Skins Display -->
    <div class="grid w-full grid-cols-2 gap-2">
      <LoadingPage :isLoading="isLoadingSkins" />

      <SkinCard v-for="skin in skinsList" :key="skin._id" :skin="skin" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";

// ------ External Composables ------
const { data: skinsList, isPending: isLoadingSkins } = useConvexQuery(api.skins.listSkins);

// ------ Local State ------
const isCreateSkinOpen = ref(false);
</script>

<style></style>
