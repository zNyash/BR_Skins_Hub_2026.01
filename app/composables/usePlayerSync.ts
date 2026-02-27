import type { UsersDetailsResponse } from "osu-api-extended/dist/types/v2/users_details";
import { api } from "~~/convex/_generated/api";
import type { Doc } from "~~/convex/_generated/dataModel";

type PlayerFetchResult = {
  data: UsersDetailsResponse | null;
  error: string;
};
type SyncPlayerResult = {
  successMessage: string;
  errorMessage: string;
};

export const usePlayerSync = () => {
  const updatePlayerMutation = useConvexMutation(api.players.updatePlayer);
  const isLoading = ref(false);

  async function fetchPlayerInfo(osuId: number): Promise<PlayerFetchResult> {
    try {
      isLoading.value = true;
      const response = await $fetch<UsersDetailsResponse>(`/api/player/refresh`, {
        method: "GET",
        params: { osu_id: osuId },
      });

      if (!response) {
        return { data: null, error: "No data returned from API" };
      }

      return { data: response, error: "" };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    } finally {
      isLoading.value = false;
    }
  }

  async function syncPlayer(player: Doc<"players">): Promise<SyncPlayerResult> {
    try {
      isLoading.value = true;
      const { data: latestData, error } = await fetchPlayerInfo(player.osu_id);

      if (error || !latestData) {
        console.error(error);
        return { successMessage: "", errorMessage: error };
      }

      const hasNameChanged = latestData.username !== player.name;
      const hasCoverChanged = latestData.cover?.url !== player.cover_url;

      if (hasNameChanged || hasCoverChanged) {
        await updatePlayerMutation.mutate({
          id: player._id,
          name: latestData.username,
          cover_url: latestData.cover?.url,
        });

        return { successMessage: "Player info updated successfully!", errorMessage: "" };
      }

      return { successMessage: "No changes detected!", errorMessage: "" };
    } catch (err) {
      return { successMessage: "", errorMessage: (err as Error).message };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    fetchPlayerInfo,
    syncPlayer,
  };
};
