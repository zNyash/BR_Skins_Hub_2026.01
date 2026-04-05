<template>
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

    <p v-if="statusMessage" class="text-muted text-xs">{{ statusMessage }}</p>
  </div>
</template>

<script lang="ts" setup>
import type { Doc } from "~~/convex/_generated/dataModel";

// ------ Local Types & Defaults ------
type Skin = Doc<"skins">;

// ------ Props & Emits ------
const { skin } = defineProps<{ skin: Skin }>();

// ------ External Composables ------
const store = useDashboardStore();
const toast = useAppToast();
const { handleSubmit, statusMessage, isLoading } = useSubmitAction();

const getDefaults = () => ({
  name: skin.name,
  author: skin.author ?? "",
  downloadUrl: skin.download_url,
});
const { state: formState, reset: resetForm } = useResettableRef(getDefaults);

// ------ Props & Emits ------
defineExpose({
  submitSave,
  isLoading,
});

// ------ Watchers ------
// Re-sync form when selection changes
watch(
  () => skin._id,
  () => resetForm(),
  { immediate: false },
);

// ------ Actions ------
function handleCancel() {
  resetForm();
  store.clearSelection();
}

// ------ Handlers ------
async function submitSave() {
  await handleSubmit(
    async () => {
      statusMessage.value = "Checking for changes...";
      if (
        formState.value.name === skin.name &&
        formState.value.author === (skin.author ?? "") &&
        formState.value.downloadUrl === skin.download_url
      ) {
        toast.success({ title: "No changes were made to the skin." });
        return false;
      }

      statusMessage.value = "Updating skin...";
      await $fetch(`/api/skins/${skin._id}`, {
        method: "PATCH",
        body: {
          name: formState.value.name,
          author: formState.value.author,
          download_url: formState.value.downloadUrl,
        },
      });

      toast.success({ title: "Skin updated successfully!" });
    },
    { errorTitle: "Failed to update the skin." },
  );
}
</script>
