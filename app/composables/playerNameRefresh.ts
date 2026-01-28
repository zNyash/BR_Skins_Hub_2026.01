import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

export const usePlayerNameRefresh = () => {
  const toast = useAppToast();
  const { mutate: updatePlayer } = useConvexMutation(api.players.updatePlayer);

  const isLoading = ref(false);

  const refreshPlayerName = async (payload: PayLoad) => {
    try {
      isLoading.value = true;

      const oldUsername = payload.currentName;
      const newUsername = await fetchPlayerUsername(payload.osuId);

      // Only change the name on the database if it's different.
      if (newUsername === oldUsername) {
        toast.success({
          title: "Username is up to date!",
          description: `No changes detected for "${oldUsername}".`,
        });

        return true;
      }

      await updatePlayer({
        id: payload.playerId,
        name: newUsername,
      });

      toast.success({
        title: "Username updated!",
        description: `Changed from "${oldUsername}" to "${newUsername}"!`,
      });

      return true;
    } catch (error) {
      console.error("Error refreshing player name:", error);

      toast.error({
        title: "Failed to refresh the user's name :(",
        description: "Could not connect to osu! API",
      });

      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchPlayerUsername = async (osuId: number) => {
    const newName = await $fetch("/api/player/refresh", {
      method: "GET",
      params: {
        osu_id: osuId,
      },
    });
    return newName;
  };

  return {
    isLoading,
    refreshPlayerName,
    fetchPlayerUsername,
  };
};

type PayLoad = {
  osuId: number;
  currentName: string;
  playerId: Id<"players">;
};
