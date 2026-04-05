<template>
  <div class="flex items-start justify-between gap-4 pb-4">
    <div class="flex flex-col gap-0.5">
      <span class="text-muted text-xs">{{ label }}</span>
      <h2 class="text-lg font-semibold">{{ title }}</h2>
    </div>
    <div class="flex shrink-0 items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// ------ Props & Emits ------
defineProps<{
  label: string;
  title: string;
}>();
</script>
