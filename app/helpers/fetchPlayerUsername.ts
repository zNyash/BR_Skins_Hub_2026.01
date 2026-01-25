export default async function fetchPlayerUsername(osuId: number): Promise<string> {
  return await $fetch("/api/player/refresh", {
        method: "GET",
        params: {
          osu_id: osuId,
        },
      });
}