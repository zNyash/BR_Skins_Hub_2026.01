export default defineNuxtRouteMiddleware((to) => {
  const { isAdmin } = useAuth();

  // If navigating to /dashboard/* and not an admin
  if (to.path.startsWith("/dashboard") && !isAdmin.value) {
    return navigateTo("/login");
  }

  // If navigating to /login while already an admin
  if (to.path === "/login" && isAdmin.value) {
    return navigateTo("/dashboard/players");
  }
});
