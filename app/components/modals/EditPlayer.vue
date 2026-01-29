<template>
  <UModal title="Editing Player" :close="false" v-model:open="isModalOpen">
    <UTooltip text="Edit Player" :delay-duration="TOOLTIP.DELAY">
      <UButton icon="lucide:edit" variant="ghost" color="info" />
    </UTooltip>
    <template #body>
      <span class="flex w-full flex-col items-start gap-4">
        <!-- Inputs -->
        <div class="flex w-full flex-col items-start gap-2">
          <NFormField label="Player Username" class="w-full">
            <UFieldGroup class="w-full">
              <UInput
                placeholder="Name"
                v-model="playerNameInput"
                class="w-full"
                @keydown.enter="handleSaveChanges"
              />
              <UButton
                icon="lucide:refresh-ccw"
                color="neutral"
                variant="subtle"
                @click="handleRefreshClick"
                :loading="isRefreshingUsername"
              />
            </UFieldGroup>
          </NFormField>
        </div>

        <NSaveCancel @save="handleSaveChanges" @cancel="closeModal" :loading-text="loadingState" />
      </span>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { TOOLTIP } from "~/types/constants";
import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

// ------ Props & Emits ------
const props = defineProps<{
  _playerId: Id<"players">;
  playerName: string;
  osuId: number;
}>();

// ------ Composables ------
const updatePlayerMutation = useConvexMutation(api.players.updatePlayer);
const { isLoading: isRefreshingUsername, refreshPlayerName } = usePlayerNameRefresh();
const toast = useAppToast();

// ------ State ------
const isModalOpen = ref(false);
const playerNameInput = ref(props.playerName);
const loadingState = ref("");

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

// ------ Methods ------
const handleSaveChanges = async () => {
  try {
    loadingState.value = "Checking changes...";
    if (playerNameInput.value.trim() === props.playerName) {
      toast.success({
        title: "No changes were made to the player.",
      });
      closeModal();
      return;
    }

    loadingState.value = "Updating player...";
    await updatePlayerMutation.mutate({
      id: props._playerId,
      name: playerNameInput.value,
    });

    toast.success({
      title: `Successfully updated player's username to ${playerNameInput.value}!`,
    });

    closeModal();
  } catch (error) {
    console.error("Error updating player name:", error);

    toast.error({
      title: `Error updating player's username to ${playerNameInput.value}.`,
      description: `The error: ${(error as Error).message}`,
    });
  } finally {
    loadingState.value = "";
  }
};

const handleRefreshClick = async () => {
  loadingState.value = "Refreshing username...";
  await refreshPlayerName({
    osuId: props.osuId,
    currentUsername: props.playerName,
    playerId: props._playerId,
  });
  loadingState.value = "";
};
</script>

<style></style>
