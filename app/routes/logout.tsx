import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";
import { logout } from "~/utils/session.server";

export const action: ActionFunction = async ({ request: Request }) => {
  return logout(Request);
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
