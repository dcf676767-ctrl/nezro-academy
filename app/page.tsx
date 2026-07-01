"use client";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";
export default function Home() {
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.replace("/auth"); return; }
      const { data: profile } = await supabase.from("profiles").select("statut").eq("id", user.id).single();
      if (!profile || profile.statut !== "accepte") { window.location.replace("/attente"); return; }
      window.location.replace("/programme");
    };
    check();
  }, []);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </main>
  );
}
