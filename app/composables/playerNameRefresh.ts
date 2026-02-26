import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

interface RefreshPayload {
  osuId: number;
  currentUsername: string;
  currentCoverUrl?: string;
  playerId: Id<"players">;
}

export const usePlayerNameRefresh = () => {
  const toast = useAppToast();
  const { mutate: updatePlayer } = useConvexMutation(api.players.updatePlayer);

  const isLoading = ref(false);

  const fetchPlayerInfo = async (osuId: number) => {
    return await $fetch("/api/player/refresh", {
      method: "GET",
      params: {
        osu_id: osuId,
      },
    });
  };

  const refreshPlayerName = async ({
    osuId,
    currentUsername,
    currentCoverUrl,
    playerId,
  }: RefreshPayload) => {
    try {
      isLoading.value = true;

      const { username: newUsername, cover_url: newCoverUrl } = await fetchPlayerInfo(osuId);

      // Only change on the database if it's different.
      if (newUsername === currentUsername && newCoverUrl === currentCoverUrl) {
        toast.success({
          title: "Player data is up to date!",
          description: `No changes detected for "${currentUsername}".`,
        });

        return true;
      }

      await updatePlayer({
        id: playerId,
        name: newUsername,
        cover_url: newCoverUrl,
      });

      if (newUsername !== currentUsername) {
        toast.success({
          title: "Player data updated!",
          description: `Changed from "${currentUsername}" to "${newUsername}"!`,
        });
      }

      if (newCoverUrl !== currentCoverUrl) {
        toast.success({
          title: "Player cover updated!",
          description: `The cover image for "${newUsername}" has been updated!`,
        });
      }

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
    fetchPlayerInfo,
  };
};
