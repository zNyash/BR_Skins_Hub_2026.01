<template>
  <UModal v-model:open="isOpen" title="Unsaved Changes" :close="false" :ui="{ content: 'max-w-sm' }">
    <template #body>
      <p class="text-muted text-sm">You have unsaved changes. What would you like to do?</p>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton label="Cancel" variant="ghost" color="neutral" @click="emit('cancel')" />
        <UButton label="Discard" variant="soft" color="error" @click="emit('discard')" />
        <UButton label="Save" @click="emit('save')" />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
// ------ Props & Emits ------
const isOpen = defineModel<boolean>("open", { required: true });
const emit = defineEmits<{
  (e: "save"): void;
  (e: "discard"): void;
  (e: "cancel"): void;
}>();
</script>
