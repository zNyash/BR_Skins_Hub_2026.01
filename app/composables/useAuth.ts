export const useUseAuth = () => {
  const user = useState("auth_user", () => null);

  const fetchUser = async () => {
    user.value = await $fetch("/api/me");
  };

  return { user, fetchUser };
};
