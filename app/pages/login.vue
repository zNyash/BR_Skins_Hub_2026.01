<template>
  <div class="flex w-full flex-col items-center gap-6">
    <UCard class="w-full max-w-sm shadow-xl">
      <template #header>
        <div class="text-center">
          <h1 class="text-xl font-bold">Admin Login</h1>
          <p class="text-muted text-sm">Sign in with your osu! account to manage the website</p>
        </div>
      </template>

      <UButton
        block
        color="primary"
        label="Sign in with osu!"
        icon="i-simple-icons-osu"
        @click="loginWithOsu"
      />
    </UCard>
  </div>
</template>

<script lang="ts" setup>
// ------ External Composables ------
const runtimeConfig = useRuntimeConfig();

// ------ Actions ------
const loginWithOsu = () => {
  const params = new URLSearchParams({
    client_id: runtimeConfig.public.osuClientId,
    redirect_uri: `${runtimeConfig.public.currentDomain}/api/auth/callback`,
    response_type: "code",
    scope: "identify",
  });

  window.location.href = `https://osu.ppy.sh/oauth/authorize?${params}`;
};

// ------ Lifecycle ------
useSeoMeta({
  title: "Admin Login | BR Skins Hub Dashboard",
  ogTitle: "Admin Login | BR Skins Hub Dashboard",
});
</script>

<style></style>
