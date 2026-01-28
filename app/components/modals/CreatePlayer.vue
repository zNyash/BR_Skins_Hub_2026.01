<template>
  <UModal title="Add a player to the website" v-model:open="isModalOpen" :close="false">
    <UButton label="Add Player" :icon="ICONS.BUTTONS.ADD" class="ml-auto w-fit" />
    <template #body>
      <div class="flex w-full flex-col gap-4">
        <div class="flex w-full flex-col gap-2">
          <NFormField label="Player Username">
            <UInput placeholder="Name" v-model="formState.name" class="w-full" />
          </NFormField>
          <NFormField label="Player ID from osu!" required>
            <UInput type="number" :default-value="0" v-model="formState.osu_id" class="w-full" />
          </NFormField>
        </div>
        <NSaveCancel @save="handleCreatePlayer" @cancel="closeModal" :loading-text="loadingState" />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";

// ------ Local Types & Defaults ------
const getDefaultFormState = () => ({
  name: "",
  osu_id: undefined,
});

// ------ Composables ------
const toast = useAppToast();
const createPlayerMutation = useConvexMutation(api.players.createPlayer);
const { fetchPlayerUsername } = usePlayerNameRefresh();

// ------ State ------
const isModalOpen = ref(false);
const loadingState = ref("");
const formState = ref({ ...getDefaultFormState() });

// ------ Watchers ------
watch(
  () => isModalOpen.value,
  (newVal) => {
    if (!newVal) {
      formState.value = { ...getDefaultFormState() };
    }
  },
);

// ------ Helpers ------
const closeModal = () => {
  isModalOpen.value = false;
};

// ------ Methods ------
const handleCreatePlayer = async () => {
  try {
    loadingState.value = "Checking changes...";
    if (!formState.value.osu_id || formState.value.osu_id <= 0) {
      toast.warning({
        title: "Invalid Player ID",
        description: "Please enter a valid osu! Player ID that is greater than 0.",
      });

      return;
    }

    let finalName = formState.value.name.trim();
    if (!finalName) {
      loadingState.value = "Fetching player username...";
      finalName = await fetchPlayerUsername(formState.value.osu_id);
    }

    loadingState.value = "Creating player...";
    await createPlayerMutation.mutate({
      name: finalName,
      osu_id: formState.value.osu_id,
    });

    toast.success({
      title: `Created player "${finalName}" successfully!`,
    });

    closeModal();
  } catch (error) {
    console.error("Error creating player:", error);

    toast.error({
      title: "Failed to create the player.",
      description: (error as Error).message || "An unexpected error occurred.",
    });
  } finally {
    loadingState.value = "";
  }
};
</script>

<style></style>
