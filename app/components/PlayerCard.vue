<template>
  <Transition name="player-card">
    <div v-if="!isDeleting" class="bg-muted/50 border-muted/50 flex flex-row items-center gap-2 rounded-md border p-2">
      <UAvatar :alt="name" :src="`https://a.ppy.sh/${osu_id}`" />
      <span class="flex flex-col justify-center">
        <p class="font-medium">{{ name }}</p>
        <p class="text-muted -mt-1 text-xs">{{ osu_id }}</p>
      </span>
      <span class="ml-auto">
        <UTooltip text="Refresh Username">
          <UButton
            icon="lucide:refresh-ccw"
            color="neutral"
            variant="ghost"
            @click="handlePlayerNameRefresh"
            :loading="isRefreshingUsername"
          />
        </UTooltip>
        <ModalsEditPlayer :player-id="_id" :player-name="name" />
        <UTooltip text="Delete Player">
          <UButton icon="lucide:trash-2" @click="handlePlayerDelete" variant="ghost" color="error" />
        </UTooltip>
      </span>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

const props = defineProps<{
  name: string;
  osu_id: number;
  _id: Id<"players">;
}>();

const toast = useToast();
const isDeleting = ref(false);
const isRefreshingUsername = ref(false);
const deletePlayerMutation = useConvexMutation(api.players.deletePlayer);

const handlePlayerDelete = async () => {
  const mutationState = toast.add({
    icon: "svg-spinners:ring-resize",
    title: "Deleting player...",
    description: `Player ${props.name} is being deleted in the background...`,
    color: "info",
    duration: 0,
  });

  try {
    isDeleting.value = true;
    await deletePlayerMutation.mutate({ player_id: props._id });

    toast.update(mutationState.id, {
      icon: "material-symbols:check-small-rounded",
      title: "Successfully deleted player",
      description: `Player ${props.name} has been deleted successfully.`,
      color: "success",
      duration: 3000,
    });
  } catch (error) {
    console.error("Error deleting player:", error);

    toast.update(mutationState.id, {
      icon: "material-symbols:error-outline-rounded",
      title: "Error deleting player",
      description: `There was an error deleting player ${props.name}. Please try again.`,
      color: "error",
      duration: 3000,
    });
  } finally {
    isDeleting.value = false;
  }
};

const mutationPlayerUpdate = useConvexMutation(api.players.updatePlayer);
const handlePlayerNameRefresh = async () => {
  try {
    isRefreshingUsername.value = true;

    const response = await $fetch("/api/player/refresh", {
      method: "GET",
      params: { osu_id: props.osu_id },
    });

    await mutationPlayerUpdate.mutate({
      id: props._id,
      name: response,
    });
  } catch (error) {
    console.error("Error refreshing player name:", error);
  } finally {
    isRefreshingUsername.value = false;
  }
};
</script>

<style scoped>
.player-card-enter-active,
.player-card-leave-active {
  transition: all 0.3s ease;
}
.player-card-enter-from,
.player-card-leave-to {
  opacity: 0;
}
.player-card-enter-to,
.player-card-leave-from {
  opacity: 1;
}
</style>
