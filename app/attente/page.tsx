"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
export default function Attente() {
  const [statut, setStatut] = useState<string | null>(null);

  useEffect(() => {
    let redirected = false;
    const check = async () => {
      if (redirected) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { redirected = true; window.location.replace("/auth"); return; }
      const { data: profile } = await supabase.from("profiles").select("statut").eq("id", user.id).single();
      if (!profile) return;
      if (profile.statut === "accepte") { redirected = true; window.location.replace("/programme"); return; }
      setStatut(profile.statut);
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!statut) return null;

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
        <span className="text-4xl">⏳</span>
        <h1 className="text-2xl font-bold mt-4 mb-2 text-gray-900">Demande en cours</h1>
        <p className="text-gray-500">En attente de validation par l'admin.</p>
      </div>
    </main>
  );
}
