import { verifyToken } from "./auth";
import type { H3Event } from "h3";

export async function getUser(event: H3Event) {
  const token = getCookie(event, "session");

  if (!token) {
    return null;
  }

  try {
    return await verifyToken(token);
  } catch (err) {
    return null;
  }
}
