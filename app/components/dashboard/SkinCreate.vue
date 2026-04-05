<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2" @keydown.enter="submitCreate">
      <NFormField label="Name" required class="w-full">
        <UInput v-model="formState.name" placeholder="Some skin name" class="w-full" />
      </NFormField>
      <NFormField label="Author" required class="w-full">
        <UInput v-model="formState.author" placeholder="Author name" class="w-full" />
      </NFormField>
      <NFormField label="Download URL" required class="w-full">
        <UInput
          v-model="formState.download_url"
          placeholder="https://example.com/skin-download"
          class="w-full"
        />
      </NFormField>
      <NFormField label="Preview Images" required class="w-full">
        <ImageDropzone v-model="rawFiles" accept="image/png, image/jpeg" class="w-full" />
      </NFormField>
    </div>

    <p v-if="statusMessage" class="text-muted text-xs">{{ statusMessage }}</p>
  </div>
</template>

<script lang="ts" setup>
// ------ Local Types & Defaults ------
const getDefaults = () => ({ name: "", author: "", download_url: "" });

// ------ External Composables ------
const store = useDashboardStore();
const toast = useAppToast();
const { handleSubmit, statusMessage, isLoading } = useSubmitAction();
const { state: formState, reset: resetForm } = useResettableRef(getDefaults);

// ------ Props & Emits ------
defineExpose({
  submitCreate,
  isLoading,
});

// ------ Local State ------
const rawFiles = ref<File[]>([]);

// ------ Actions ------
function resetAll() {
  resetForm();
  rawFiles.value = [];
}

// ------ Handlers ------
async function submitCreate() {
  await handleSubmit(
    async () => {
      statusMessage.value = "Uploading images...";
      const imageUrls = await uploadSkinImages(rawFiles.value);

      statusMessage.value = "Checking response...";
      if (imageUrls.length === 0) {
        toast.warning({
          title: "No preview images uploaded.",
          description: "Please upload at least one preview image.",
        });
        return false;
      }

      statusMessage.value = "Creating skin...";
      await $fetch("/api/skins", {
        method: "POST",
        body: { ...formState.value, preview_images: imageUrls },
      });

      toast.success({ title: `Created skin "${formState.value.name}" successfully!` });
      resetAll();
      store.clearSelection();
    },
    { errorTitle: "Error creating skin." },
  );
}
</script>
