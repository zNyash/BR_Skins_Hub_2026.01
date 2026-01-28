<template>
  <UModal title="Edit Skin" :close="false" v-model:open="isModalOpen">
    <template #body>
      <div class="flex w-full flex-col gap-4">
        <div class="flex w-full flex-col gap-2">
          <NFormField label="Name">
            <UInput v-model="formdata.name" class="w-full" />
          </NFormField>
          <NFormField label="Download URL">
            <UInput v-model="formdata.downloadUrl" class="w-full" />
          </NFormField>
        </div>
        <NSaveCancel @save="onSave" @cancel="closeModal" :loading-text="loadingState" />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { api } from "~~/convex/_generated/api";

// ------ Types ------
type Skin = (typeof api.skins.listSkins._returnType)[0];

// ------ Props ------
const props = defineProps<{
  skin: Skin;
}>();

// ------ State ------
const getUpdatedFormData = () => ({
  name: props.skin.name,
  downloadUrl: props.skin.download_url,
});

const formdata = ref({ ...getUpdatedFormData() });
const isModalOpen = defineModel<boolean>("isModalOpen", { required: true });
const loadingState = ref("");

// ------ Convex Mutations ------
const { mutate: updateSkin } = useConvexMutation(api.skins.updateSkin);

// ------ Watchers ------
watch(
  () => isModalOpen.value,
  (newVal) => {
    if (!newVal) resetForm();
  },
);

// ------ Helpers ------
const resetForm = () => {
  formdata.value = { ...getUpdatedFormData() };
};
const closeModal = () => {
  isModalOpen.value = false;
};
const toast = useAppToast();

// ------ Handlers ------
const onSave = async () => {
  try {
    loadingState.value = "Checking for changes...";
    if (
      formdata.value.name === props.skin.name &&
      formdata.value.downloadUrl === props.skin.download_url
    ) {
      toast.success({
        title: "No changes were made to the skin.",
      });

      closeModal();
      return;
    }

    loadingState.value = "Updating skin...";
    await updateSkin({
      _id: props.skin._id,
      name: formdata.value.name,
      download_url: formdata.value.downloadUrl,
    });

    closeModal();
    resetForm();
    toast.success({
      title: "The skin has been successfully updated!",
    });
  } catch (error) {
    toast.error({
      title: "An error occurred while updating the skin.",
      description: String(error),
    });
    console.error("Error updating skin:", error);
  } finally {
    loadingState.value = "";
  }
};
</script>

<style></style>
