<template>
  <UModal title="Editing Player" :close="false" v-model:open="isModalOpen">
    <UTooltip text="Edit Player">
      <UButton icon="lucide:edit" variant="ghost" color="info" />
    </UTooltip>
    <template #body>
      <span class="flex flex-col items-start gap-4">
        <!-- Inputs -->
        <div class="flex w-full flex-col items-start gap-2">
          <span class="flex w-full flex-col gap-0.5">
            <p class="text-muted text-xs">Player Username</p>
            <UFieldGroup>
              <UInput placeholder="Name" v-model="playerNameInput" class="w-full" @keydown.enter="handleSaveChanges" />
              <UButton
                icon="lucide:refresh-ccw"
                color="neutral"
                variant="subtle"
                @click="handlePlayerNameRefresh"
                :loading="isRefreshingUsername"
              />
            </UFieldGroup>
          </span>
        </div>
        <!-- Buttons -->
        <div class="flex w-full flex-row justify-end gap-2">
          <UButton label="Cancel" color="neutral" variant="ghost" @click="closeModal" />
          <UButton label="Save" @click="handleSaveChanges" :loading="isSavingChanges" />
        </div>
      </span>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import fetchPlayerUsername from "~/helpers/fetchPlayerUsername";
import { TOAST } from "~/types/constants";
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

const props = defineProps<{
  playerId: Id<"players">;
  playerName: string;
  osuId: number;
}>();

// ------ Refs and Consts ------
const isModalOpen = ref(false);

const playerNameInput = ref(props.playerName);

const toast = useToast();
const updatePlayerMutation = useConvexMutation(api.players.updatePlayer);

// ------ Watchers ------
watch(
  () => props.playerName,
  (newName) => {
    playerNameInput.value = newName;
  },
);
watch(
  () => isModalOpen.value,
  (newVal) => {
    if (!newVal) {
      playerNameInput.value = props.playerName;
    }
  },
);

// ------ Helpers ------
const closeModal = () => {
  isModalOpen.value = false;
};

/* -------------------- */
/* Saving Changes Logic */
/* -------------------- */
const isSavingChanges = ref(false);
const handleSaveChanges = async () => {
  isSavingChanges.value = true;

  try {
    await updatePlayerMutation.mutate({
      id: props.playerId,
      name: playerNameInput.value,
    });

    toast.add({
      icon: ICONS.SUCCESS,
      title: `Successfully updated player's username to ${playerNameInput.value}!`,
      color: "success",
      duration: TOAST.DURATION.SUCCESS,
    });

    closeModal();
  } catch (error) {
    console.error("Error updating player name:", error);

    toast.add({
      icon: ICONS.ERROR,
      title: `Error updating player's username to ${playerNameInput.value}.`,
      description: `The error: ${(error as Error).message}`,
      color: "error",
      duration: TOAST.DURATION.ERROR,
    });
  } finally {
    isSavingChanges.value = false;
  }
};

/* ------------------------- */
/* Refreshing Username Logic */
/* ------------------------- */
const isRefreshingUsername = ref(false);
const handlePlayerNameRefresh = async () => {
  isRefreshingUsername.value = true;
  
  try {
    const newUsername = await fetchPlayerUsername(props.osuId);

    if (newUsername) {
      playerNameInput.value = newUsername;

      toast.add({
        icon: ICONS.SUCCESS,
        title: `Successfully refreshed player's username to ${newUsername}!`,
        color: "success",
        duration: TOAST.DURATION.SUCCESS,
      });
    }
  } catch (error) {
    console.error("Error refreshing player name:", error);

    toast.add({
      icon: ICONS.ERROR,
      title: `Error refreshing player's username.`,
      description: (error as Error).message,
      color: "error",
      duration: TOAST.DURATION.ERROR,
    });
  } finally {
    isRefreshingUsername.value = false;
  }
};
</script>

<style></style>
