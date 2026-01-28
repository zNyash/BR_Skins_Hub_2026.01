<template>
  <span class="flex flex-col items-start">
    <p class="text-toned text-xs">{{ label }}<span v-if="required" class="text-red-400">*</span></p>
    <slot />
  </span>
</template>

<script lang="ts" setup>
defineProps<{
  label?: string;
  required?: boolean;
}>();
</script>

<style></style>
