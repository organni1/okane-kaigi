import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

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
  if (cookieStore.get(cookieName(childId))?.value === "verified") return true;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: child } = await supabase
    .from("child_profiles")
    .select("pin_hash")
    .eq("id", childId)
    .eq("parent_user_id", user.id)
    .maybeSingle();

  return child?.pin_hash === null;
}
