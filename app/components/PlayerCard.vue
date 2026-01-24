<template>
  <Transition name="player-card">
    <div v-if="!isDeleting" class="bg-muted border-muted flex flex-row items-center gap-2 rounded-md border p-2">
      <UAvatar :alt="name" :src="`https://a.ppy.sh/${osu_id}`" />
      <span class="flex flex-col justify-center">
        <p class="font-medium">{{ name }}</p>
        <p class="text-muted -mt-1 text-xs">{{ osu_id }}</p>
      </span>
      <UButton label="delete" @click="handlePlayerDelete" class="ml-auto" variant="ghost" color="error" />
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

const toast = useToast();

const props = defineProps<{
  name: string;
  osu_id: number;
  _id: Id<"players">;
}>();
const deletePlayerMutation = useConvexMutation(api.players.deletePlayer);
const isDeleting = ref(false);
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
    await new Promise((resolve) => setTimeout(resolve, 5000));

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
