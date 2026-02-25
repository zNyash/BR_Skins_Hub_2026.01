export default defineNuxtRouteMiddleware((to) => {
  const { isSignedIn } = useAuth();

  // If navigating to /dashboard/* and not logged in
  if (to.path.startsWith("/dashboard") && !isSignedIn.value) {
    return navigateTo("/login");
  }

  // If navigating to /login while already logged in
  if (to.path === "/login" && isSignedIn.value) {
    return navigateTo("/dashboard/players");
  }
});
