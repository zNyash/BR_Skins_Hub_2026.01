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
              <UInput placeholder="Name" v-model="inputPlayerName" class="w-full" @keydown.enter="handleSaveChanges" />
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
          <UButton label="Cancel" color="neutral" variant="ghost" @click="handleCloseModal" />
          <UButton label="Save" @click="handleSaveChanges" />
        </div>
      </span>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

const props = defineProps<{
  playerId: Id<"players">;
  playerName: string;
  osuId: number;
}>();

/* --------------- */
/* Refs and Consts */
/* --------------- */
const isModalOpen = ref(false);
const isRefreshingUsername = ref(false);

const inputPlayerName = ref(props.playerName);

const toast = useToast();
const mutationPlayerUpdate = useConvexMutation(api.players.updatePlayer);

/* ---------- */
/* Life Cycle */
/* ---------- */
watch(
  () => props.playerName,
  (newName) => {
    inputPlayerName.value = newName;
  },
);

/* ----------------- */
/* Handler Functions */
/* ----------------- */
const handleCloseModal = () => {
  isModalOpen.value = false;
  inputPlayerName.value = props.playerName;
};
const handleSaveChanges = async () => {
  isModalOpen.value = false;

  const toastToUpdate = toast.add({
    icon: "svg-spinners:ring-resize",
    title: `Updating player's name to ${inputPlayerName.value}...`,
    color: "info",
    duration: 0,
  });

  try {
    await mutationPlayerUpdate.mutate({
      id: props.playerId,
      name: inputPlayerName.value || "",
    });

    toast.update(toastToUpdate.id, {
      icon: "lucide:circle-check-big",
      title: `Successfully updated player's name to ${inputPlayerName.value}!`,
      color: "success",
      duration: 3000,
    });
  } catch (error) {
    console.error("Error updating player name:", error);

    toast.update(toastToUpdate.id, {
      icon: "lucide:circle-x",
      title: `Error updating player's name to ${inputPlayerName.value}.`,
      description: `The error: ${(error as Error).message}`,
      color: "error",
      duration: 5000,
    });
  }
};
const handlePlayerNameRefresh = async () => {
  try {
    isRefreshingUsername.value = true;

    const response = await $fetch<string>("/api/player/refresh", {
      method: "GET",
      params: { osu_id: props.osuId },
    });
    console.log(response);

    if (response) {
      inputPlayerName.value = response;
    }
  } catch (error) {
    console.error("Error refreshing player name:", error);
  } finally {
    isRefreshingUsername.value = false;
  }
};
</script>

<style></style>
