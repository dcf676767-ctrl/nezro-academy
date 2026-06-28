"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Attente() {
  const [statut, setStatut] = useState("en_attente");

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      const { data: profile } = await supabase.from("profiles").select("statut").eq("id", user.id).single();
      if (profile?.statut === "accepte") { window.location.href = "/programme"; return; }
      if (profile?.statut) setStatut(profile.statut);
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  const content = {
    en_attente: { emoji: "⏳", titre: "Demande en cours", texte: "En attente de validation par l'admin. Tu seras redirigé automatiquement dès que tu seras accepté !" },
    expulse: { emoji: "🚫", titre: "Vous avez été expulsé", texte: "Vous avez été expulsé du programme. Contactez l'admin pour plus d'informations." },
    refuse: { emoji: "❌", titre: "Demande refusée", texte: "Votre demande a été refusée. Contactez l'admin pour plus d'informations." },
  }[statut] || { emoji: "⏳", titre: "Demande en cours", texte: "En attente de validation." };

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
        <span className="text-4xl">{content.emoji}</span>
        <h1 className="text-2xl font-bold mt-4 mb-2 text-gray-900">{content.titre}</h1>
        <p className="text-gray-500">{content.texte}</p>
      </div>
    </main>
  );
}
