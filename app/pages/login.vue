<template>
  <div class="flex min-h-[50vh] w-full flex-col items-center justify-center gap-6">
    <!-- Manual Sign In Form -->
    <SignedOut>
      <UCard class="w-full max-w-sm shadow-xl">
        <template #header>
          <div class="text-center">
            <h1 class="text-xl font-bold">Admin Login</h1>
            <p class="text-muted text-sm">Sign in to manage skins</p>
          </div>
        </template>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <UFormField label="Username" name="username" class="w-full">
            <UInput
              v-model="username"
              type="text"
              placeholder="admin"
              :icon="ICONS.USER"
              autofocus
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Password" name="password" class="w-full">
            <UInput
              v-model="password"
              type="password"
              placeholder="••••••••"
              :icon="ICONS.LOCK"
              required
              class="w-full"
            />
          </UFormField>

          <UAlert
            v-if="error"
            color="error"
            variant="soft"
            :icon="ICONS.WARNING"
            :title="error"
            class="text-sm"
          />

          <UButton
            type="submit"
            block
            :loading="isLoading"
            color="primary"
            label="Sign In"
            class="mt-2"
          />
        </form>
      </UCard>
    </SignedOut>

    <!-- Already Signed In View -->
    <SignedIn>
      <div class="flex flex-col items-center gap-4 text-center">
        <div class="bg-primary/10 rounded-full p-4">
          <UIcon :name="ICONS.SUCCESS" class="text-primary size-12" />
        </div>
        <div class="space-y-1">
          <h2 class="text-xl font-bold">You are signed in</h2>
          <p class="text-muted text-sm">Access the dashboard below</p>
        </div>

        <div class="flex gap-3">
          <UserButton />
          <UButton to="/dashboard/players" :icon="ICONS.EDIT" label="Go to Dashboard" />
        </div>
      </div>
    </SignedIn>
  </div>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";

const { signIn, isLoaded, setActive } = useSignIn();

const username = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

async function handleLogin() {
  if (!isLoaded.value || !signIn.value) return;

  error.value = "";
  isLoading.value = true;

  try {
    const result = await signIn.value.create({
      identifier: username.value,
      password: password.value,
    });

    if (result.status === "complete") {
      await setActive.value!({
        session: result.createdSessionId,
      });

      // Redirect happens automatically via middleware or we can force it
      await navigateTo("/dashboard/players");
    } else {
      /*Investigate why the login hasn't completed */
      console.log(result);
    }
  } catch (err: any) {
    console.error("Login error:", err);
    error.value = err.errors?.[0]?.longMessage || "Invalid username or password.";
  } finally {
    isLoading.value = false;
  }
}

// ------ Lifecycle ------
useSeoMeta({
  title: "Admin Login | BR Skins Hub Dashboard",
  ogTitle: "Admin Login | BR Skins Hub Dashboard",
});
</script>

<style></style>
