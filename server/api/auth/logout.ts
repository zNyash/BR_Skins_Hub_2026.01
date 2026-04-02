export default defineEventHandler((event) => {
  deleteCookie(event, "session");
  return sendRedirect(event, "/");
});
