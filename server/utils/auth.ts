import { SignJWT, jwtVerify } from "jose";
import type { JwtSessionPayload } from "~~/server/types/jwt";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createToken(osu_id: string | number) {
  const token = await new SignJWT({ osu_id: Number(osu_id) })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  return token;
}

export async function verifyToken(token: string): Promise<JwtSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JwtSessionPayload;
  } catch (err) {
    return null;
  }
}
