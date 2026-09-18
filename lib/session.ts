import { cookies } from "next/headers";

const COOKIE_NAME = "activeMemberId";

export async function getActiveMemberId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function setActiveMemberIdCookie(memberId: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, memberId, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 año
  });
}

export async function clearActiveMemberIdCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
