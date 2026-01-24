<template>
  <UModal title="Editing Player" :close="false" v-model:open="isModalOpen">
    <UTooltip text="Edit Player">
      <UButton icon="lucide:edit" variant="ghost" color="info" />
    </UTooltip>
    <template #body>
      <span class="flex flex-col items-start gap-4">
        <!-- Inputs -->
        <div v-if="inputPlayerData" class="flex w-full flex-col items-start gap-2">
          <span class="flex w-full flex-col gap-0.5">
            <p class="text-muted text-xs">Player Username</p>
            <UFieldGroup>
              <UInput placeholder="Name" v-model="inputPlayerData.name" class="w-full" />
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
}>();
const isModalOpen = ref(false);
const isRefreshingUsername = ref(false);
const { data: playerData } = useConvexQuery(api.players.getPlayer, { id: props.playerId });
const mutationPlayerUpdate = useConvexMutation(api.players.updatePlayer);

const inputPlayerData = ref({
  name: playerData.value?.name || props.playerName,
});

// Functions
const handleCloseModal = () => {
  isModalOpen.value = false;
  inputPlayerData.value = {
    name: playerData.value?.name || props.playerName,
  };
};
const handleSaveChanges = async () => {
  await mutationPlayerUpdate.mutate({
    id: props.playerId,
    name: inputPlayerData.value?.name || "",
  });
  isModalOpen.value = false;
};
const handlePlayerNameRefresh = async () => {
  try {
    isRefreshingUsername.value = true;

    const response = await $fetch("/api/player/refresh", {
      method: "GET",
      params: { osu_id: playerData.value?.osu_id },
    });

    if (response) {
      inputPlayerData.value.name = response;
    }
  } catch (error) {
    console.error("Error refreshing player name:", error);
  } finally {
    isRefreshingUsername.value = false;
  }
};
</script>

<style></style>
