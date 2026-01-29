<template>
  <div class="flex w-full justify-between gap-2">
    <span class="my-auto text-left text-xs"> {{ loadingText }} </span>
    <span class="flex gap-2">
      <UButton label="Cancel" variant="soft" color="neutral" @click="$emit('cancel')" />
      <UButton label="Save" @click="$emit('save')" :loading="!!loadingText" />
    </span>
  </div>
</template>

<script lang="ts" setup>
// ------ Props & Emits ------
defineProps<{
  loadingText?: string;
}>();
defineEmits<{
  (e: "cancel"): void;
  (e: "save"): void;
}>();
</script>

<style></style>
