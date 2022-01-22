import { db } from "./db.server";
import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect } from "remix";

type LoginType = {
  username: string;
  password: string;
};

export async function login({ username, password }: LoginType) {
  let existingUser = await db.user.findFirst({
    where: {
      username,
    },
  });

  if (!existingUser) return null;
  let isPasswordsMatch = await bcrypt.compare(
    password,
    existingUser.passwordHash
  );
  if (!isPasswordsMatch) return null;
  return existingUser;
}

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("There must be env variable SESSION_SECRET");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  let session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-cookie": await storage.commitSession(session),
    },
  });
}
