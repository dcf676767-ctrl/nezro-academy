"use client";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      const { data: profile } = await supabase.from("profiles").select("statut").eq("id", user.id).single();
      if (!profile || profile.statut === "en_attente") { window.location.href = "/attente"; return; }
      window.location.href = "/programme";
    };
    check();
  }, []);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  );
}
