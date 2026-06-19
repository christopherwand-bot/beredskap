import crypto from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "beredskapsavisa_session";

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function sign(value: string) {
  return crypto
    .createHmac("sha256", requireEnv("ADMIN_SESSION_SECRET"))
    .update(value)
    .digest("hex");
}

export async function isAuthenticated() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (!token) {
    return false;
  }

  const [value, signature] = token.split(".");

  if (!value || !signature) {
    return false;
  }

  const expected = sign(value);

  if (signature.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function login(password: string) {
  if (password !== requireEnv("ADMIN_PASSWORD")) {
    return false;
  }

  const store = await cookies();
  const value = crypto.randomBytes(24).toString("hex");
  const signature = sign(value);

  store.set(SESSION_COOKIE, `${value}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return true;
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
