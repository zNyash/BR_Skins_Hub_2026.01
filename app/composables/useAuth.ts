type AuthUser = {
  osu_id: number;
  isAdmin: boolean;
  username: string | null;
  avatar_url: string | null;
};

export const useAuth = () => {
  const user = useState<AuthUser | null>("auth_user", () => null);

  const isSignedIn = computed(() => !!user.value && user.value.osu_id !== -1);
  const isAdmin = computed(() => user.value?.isAdmin === true);

  const fetchUser = async () => {
    user.value = await $fetch<AuthUser>("/api/auth/me");
  };

  return { user, isSignedIn, isAdmin, fetchUser };
};
