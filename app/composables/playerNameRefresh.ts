import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

interface RefreshPayload {
  osuId: number;
  currentUsername: string;
  playerId: Id<"players">;
}

export const usePlayerNameRefresh = () => {
  const toast = useAppToast();
  const { mutate: updatePlayer } = useConvexMutation(api.players.updatePlayer);

  const isLoading = ref(false);

  const fetchPlayerUsername = async (osuId: number) => {
    return await $fetch<string>("/api/player/refresh", {
      method: "GET",
      params: {
        osu_id: osuId,
      },
    });
  };

  const refreshPlayerName = async ({ osuId, currentUsername, playerId }: RefreshPayload) => {
    try {
      isLoading.value = true;

      const newUsername = await fetchPlayerUsername(osuId);

      // Only change the name on the database if it's different.
      if (newUsername === currentUsername) {
        toast.success({
          title: "Username is up to date!",
          description: `No changes detected for "${currentUsername}".`,
        });

        return true;
      }

      await updatePlayer({
        id: playerId,
        name: newUsername,
      });

      toast.success({
        title: "Username updated!",
        description: `Changed from "${currentUsername}" to "${newUsername}"!`,
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

  return {
    isLoading: readonly(isLoading),
    refreshPlayerName,
    fetchPlayerUsername,
  };
};
