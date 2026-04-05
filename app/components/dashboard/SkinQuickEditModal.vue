<template>
  <UModal
    v-model:open="isOpen"
    :title="`Quick Edit — ${skin.name}`"
    :close="false"
    :ui="{ content: 'max-w-md' }"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <NFormField label="Name" class="w-full">
            <UInput v-model="formState.name" class="w-full" />
          </NFormField>
          <NFormField label="Author" class="w-full">
            <UInput v-model="formState.author" class="w-full" />
          </NFormField>
          <NFormField label="Download URL" class="w-full">
            <UInput v-model="formState.downloadUrl" class="w-full" />
          </NFormField>
        </div>

        <NSaveCancel @save="handleSave" @cancel="closeModal" :loading-text="statusMessage" />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { Doc } from "~~/convex/_generated/dataModel";

// ------ Local Types & Defaults ------
type Skin = Doc<"skins">;

// ------ Props & Emits ------
const { skin } = defineProps<{ skin: Skin }>();
const isOpen = defineModel<boolean>("open", { required: true });

// ------ External Composables ------
const toast = useAppToast();
const { handleSubmit, statusMessage } = useSubmitAction();

const getDefaults = () => ({
  name: skin.name,
  author: skin.author ?? "",
  downloadUrl: skin.download_url,
});
const { state: formState, reset: resetForm } = useResettableRef(getDefaults);

// ------ Watchers ------
watch(isOpen, (open) => {
  if (!open) {
    resetForm();
    statusMessage.value = "";
  }
});

// ------ Actions ------
function closeModal() {
  isOpen.value = false;
}

// ------ Handlers ------
function handleSave() {
  handleSubmit(
    async () => {
      statusMessage.value = "Checking for changes...";
      if (
        formState.value.name === skin.name &&
        formState.value.author === (skin.author ?? "") &&
        formState.value.downloadUrl === skin.download_url
      ) {
        toast.success({ title: "No changes were made." });
        closeModal();
        return false;
      }

      statusMessage.value = "Saving skin...";
      await $fetch(`/api/skins/${skin._id}`, {
        method: "PATCH",
        body: {
          name: formState.value.name,
          author: formState.value.author,
          download_url: formState.value.downloadUrl,
        },
      });

      toast.success({ title: "Skin updated!" });
      closeModal();
    },
    { errorTitle: "Failed to update skin." },
  );
}
</script>
