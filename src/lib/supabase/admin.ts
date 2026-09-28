import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./server";

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: claims, error } = await supabase.auth.getClaims();
  if (error || !claims?.claims?.sub) redirect("/admin/login");
  const { data: allowed, error: roleError } = await supabase.rpc("is_house_admin");
  if (roleError || allowed !== true) redirect("/admin/login?error=access");
  return supabase;
}
