<template>
  <UModal title="Add a player to the website" v-model:open="isModalOpen" :close="false">
    <UButton label="Add Player" :icon="ICONS.BUTTONS.ADD" class="ml-auto w-fit" />
    <template #body>
      <div class="flex flex-col items-start gap-2">
        <span class="flex w-full flex-col gap-0.5">
          <p class="text-muted text-xs">Player Username</p>
          <UInput placeholder="Name" v-model="formState.name" />
        </span>
        <span class="flex w-full flex-col gap-0.5">
          <p class="text-muted text-xs">Player ID from osu!</p>
          <UInput type="number" :default-value="0" v-model="formState.osu_id" />
        </span>
        <span class="flex w-full flex-row justify-end gap-2">
          <UButton
            @click="closeModal"
            label="Cancel"
            variant="ghost"
            color="neutral"
            class="mt-4"
          />
          <UButton @click="handlerCreatePlayer" label="Save" :loading="isPlayerCreationInProgress" class="mt-4" />
        </span>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import fetchPlayerUsername from "~/helpers/fetchPlayerUsername";
import { TOAST } from "~/types/constants";
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";

// ------ Types ------
interface PlayerFormState {
  name: string;
  osu_id: number | undefined;
}
const PLAYER_FORM_DEFAULT: PlayerFormState = {
  name: "",
  osu_id: undefined,
};

// ------ Composables ------
const toast = useToast();
const createPlayerMutation = useConvexMutation(api.players.createPlayer);

// ------ Reactive States ------
const isModalOpen = ref(false);
const formState = ref<PlayerFormState>({ ...PLAYER_FORM_DEFAULT });

// ------ Helpers ------
const closeModal = () => {
  isModalOpen.value = false;
};


// ----- Watchers -----
watch(
  () => isModalOpen.value,
  (newVal) => {
    if (!newVal) {
      formState.value = { ...PLAYER_FORM_DEFAULT };
    }
  }
)

/* ------------------- */
/* Create Player Logic */
/* ------------------- */
const isPlayerCreationInProgress = ref(false);
const handlerCreatePlayer = async () => {
  if (!formState.value.osu_id || formState.value.osu_id <= 0) {
    toast.add({
      icon: ICONS.WARNING,
      title: "Invalid Player ID",
      description: "Please enter a valid osu! Player ID greater than 0.",
      color: "warning",
      duration: TOAST.DURATION.WARNING,
    });
    return;
  }

  isPlayerCreationInProgress.value = true;

  try {
    let finalName = formState.value.name.trim();

    if (!finalName) {
      finalName = await fetchPlayerUsername(formState.value.osu_id);
    }

    await createPlayerMutation.mutate({
      name: finalName,
      osu_id: formState.value.osu_id,
    });

    toast.add({
      icon: ICONS.SUCCESS,
      title: `Created ${finalName} successfully!`,
      color: "success",
      duration: TOAST.DURATION.SUCCESS,
    });

    closeModal();
  } catch (error) {
    console.error("Error creating player:", error);

    toast.add({
      icon: ICONS.ERROR,
      title: "Error creating player",
      description: (error as Error).message || "An unexpected error occurred.",
      color: "error",
      duration: TOAST.DURATION.ERROR,
    });
  } finally {
    isPlayerCreationInProgress.value = false;
  }
};
</script>

<style></style>
