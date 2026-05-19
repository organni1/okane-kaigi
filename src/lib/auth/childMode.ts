import { cookies } from "next/headers";

const cookieName = (childId: string) => `okane_child_${childId}`;

export async function markChildModeVerified(childId: string) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName(childId), "verified", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: `/child/${childId}`,
    maxAge: 60 * 60 * 8,
  });
}

export async function isChildModeVerified(childId: string) {
  const cookieStore = await cookies();
  return cookieStore.get(cookieName(childId))?.value === "verified";
}
