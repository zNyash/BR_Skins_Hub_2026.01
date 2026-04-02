<template>
  <UModal title="Add New Skin" v-model:open="isOpen" :close="false">
    <template #body>
      <div class="flex w-full flex-col gap-2">
        <span class="flex w-full flex-col gap-2" @keydown.enter="handleSkinCreation">
          <NFormField label="Name" required class="w-full">
            <UInput v-model="formState.name" required placeholder="Some skin name" class="w-full" />
          </NFormField>
          <NFormField label="Author" required class="w-full">
            <UInput v-model="formState.author" required placeholder="Author name" class="w-full" />
          </NFormField>
          <NFormField label="Download URL" required class="w-full">
            <UInput
              v-model="formState.download_url"
              required
              placeholder="https://example.com/skin-download"
              class="w-full"
            />
          </NFormField>
          <NFormField label="Preview Images" required class="w-full">
            <ImageDropzone v-model="rawFiles" accept="image/png, image/jpeg" class="w-full" />
          </NFormField>
        </span>

        <NSaveCancel
          :loading-text="statusMessage"
          @save="handleSkinCreation"
          @cancel="closeModal"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
// ------ Local Types & Defaults ------
const getFormDefaults = () => ({
  name: "",
  author: "",
  download_url: "",
  preview_images: [""],
});

// ------ Props & Emits ------
const isOpen = defineModel<boolean>("open", { required: true });

// ------ External Composables ------
const { handleSubmit, statusMessage } = useSubmitAction();
const toast = useAppToast();
const { state: formState, reset: resetForm } = useResettableRef(getFormDefaults);

// ------ Local State ------
const rawFiles = ref<File[]>([]);

// ------ Watchers ------
watch(
  () => isOpen.value,
  (newVal) => {
    if (!newVal) {
      resetAll();
    }
  },
);

// ------ Actions ------
const resetAll = () => {
  resetForm();
  rawFiles.value = [];
  statusMessage.value = "";
};
const closeModal = () => {
  isOpen.value = false;
};

// ------ Handlers ------
const handleSkinCreation = () =>
  handleSubmit(
    async () => {
      statusMessage.value = "Uploading Images...";
      const imageUrls = await uploadSkinImages(rawFiles.value);

      statusMessage.value = "Checking response...";
      if (imageUrls.length === 0) {
        toast.warning({
          title: "No preview images uploaded.",
          description: "Please upload at least one preview image for the skin.",
        });
        return false;
      }

      statusMessage.value = "Creating Skin...";
      await $fetch("/api/skins", {
        method: "POST",
        body: {
          ...formState.value,
          preview_images: imageUrls,
        },
      });

      toast.success({
        title: `Created skin "${formState.value.name}" successfully!`,
      });
      resetAll();
      closeModal();
    },
    {
      errorTitle: "Error creating skin.",
    },
  );
</script>

<style></style>
