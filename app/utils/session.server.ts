import { db } from "./db.server";
import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect } from "remix";

type LoginType = {
  username: string;
  password: string;
};

export async function register({ username, password }: LoginType) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      username,
      passwordHash: hashedPassword,
    },
  });

  return user;
}

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

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function createUserSession(userId: string, redirectTo: string) {
  let session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-cookie": await storage.commitSession(session),
    },
  });
}
export async function getUserId(request: Request) {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if (typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  let userId = await getUserId(request);
  if (!userId) {
    let params = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${params.toString()}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  let userId = await getUserId(request);
  if (!userId) return null;
  return await db.user.findUnique({
    where: {
      id: userId,
    },
  });
}

export async function logout(request: Request) {
  let session = await getUserSession(request);
  session.set("userId", null);
  return redirect(`/jokes`, {
    headers: {
      "Set-cookie": await storage.destroySession(session),
    },
  });
}
