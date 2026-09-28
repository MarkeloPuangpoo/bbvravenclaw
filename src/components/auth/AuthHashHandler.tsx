"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export function AuthHashHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const type = params.get("type");
    if (type !== "invite" && type !== "recovery") return;
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    if (!accessToken || !refreshToken) {
      window.location.replace("/admin/login?error=link");
      return;
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      window.location.replace("/admin/login?error=config");
      return;
    }
    const supabase = createBrowserClient(url, key, { auth: { detectSessionInUrl: false } });
    void supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ error }) => {
      window.location.replace(error ? "/admin/login?error=link" : "/admin/set-password");
    });
  }, []);
  return null;
}
