<template>
  <div>
    <UButton v-if="!isSignedIn" @click="login" label="Login" />
    <div v-else class="hover:bg-elevated flex cursor-pointer gap-2 rounded-md p-1 duration-100">
      <UDropdownMenu :items="items">
        <UAvatar
          :src="user?.avatar_url || 'https://via.placeholder.com/150'"
          :alt="user?.username || 'User'"
          size="lg"
        />
      </UDropdownMenu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";

// ------ External Composables ------
const { isSignedIn, user } = useAuth();
const runtimeConfig = useRuntimeConfig();

// ------ Actions ------
const login = () => {
  const params = new URLSearchParams({
    client_id: runtimeConfig.public.osuClientId,
    redirect_uri: `${runtimeConfig.public.currentDomain}/api/auth/callback`,
    response_type: "code",
    scope: "identify",
  });

  window.location.href = `https://osu.ppy.sh/oauth/authorize?${params}`;
};

const logout = () => {
  window.location.href = "/api/auth/logout";
};

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: "your page",
      icon: "lucide:user",
      href: `/player/${user.value?.osu_id}`,
    },
    {
      label: "osu! profile",
      icon: "simple-icons:osu",
      href: user.value ? `https://osu.ppy.sh/users/${user.value.osu_id}` : "",
      target: "_blank",
    },
  ],
  [
    {
      label: "logout",
      icon: "lucide:log-out",
      color: "error",
      onSelect: () => logout(),
    },
  ],
]);
</script>

<style></style>
