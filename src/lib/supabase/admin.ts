import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./server";

// cache(): page and layout share one auth check + client per request.
export const requireAdmin = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const { data: claims, error } = await supabase.auth.getClaims();
  if (error || !claims?.claims?.sub) redirect("/admin/login");
  const { data: allowed, error: roleError } = await supabase.rpc("is_house_admin");
  if (roleError || allowed !== true) redirect("/admin/login?error=access");
  return supabase;
});
