import type { UsersLookupResponse } from "osu-api-extended/dist/types/v2/users_lookup";

type PlayerFetchResult = {
  data: UsersLookupResponse | null;
  isLoading: boolean;
  error: string;
};

export const usePlayerSync = () => {
  async function fetchPlayerInfo(osuId: number): Promise<PlayerFetchResult> {
    const isLoading = ref(false);
    try {
      isLoading.value = true;
      const response = await $fetch<UsersLookupResponse>(`/api/player/refresh`, {
        method: "GET",
        params: {
          osu_id: osuId,
        },
      });

      if (!response) {
        return {
          data: null,
          isLoading: isLoading.value,
          error: "No data returned from API",
        };
      }

      return {
        data: response,
        isLoading: isLoading.value,
        error: "",
      };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    fetchPlayerInfo,
  };
};
