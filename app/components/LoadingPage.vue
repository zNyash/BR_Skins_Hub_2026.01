<template>
  <div
    v-if="isLoading"
    class="bg-default absolute inset-0 flex w-full flex-col items-center justify-center gap-2"
  >
    <UIcon :name="ICONS.LOADING" size="2rem" class="text-primary" />
  </div>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";
const { isLoading = false } = defineProps<{
  isLoading: boolean;
}>();
</script>

<style></style>
