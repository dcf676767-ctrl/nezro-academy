"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function Bloque() {
  const router = useRouter();
  const [statut, setStatut] = useState<string>("en_attente");
  const [loading, setLoading] = useState(true);
  const checkStatut = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/auth"); return; }
    const { data: profile } = await supabase.from("profiles").select("statut").eq("id", session.user.id).single();
    if (profile?.statut === "accepte") { router.push("/programme"); return; }
    setStatut(profile?.statut || "en_attente");
    setLoading(false);
  };
  useEffect(() => {
    checkStatut();
    const interval = setInterval(checkStatut, 5000);
    return () => clearInterval(interval);
  }, []);
  const logout = async () => { await supabase.auth.signOut(); router.push("/auth"); };
  const messages: any = {
    en_attente: { emoji: "⏳", titre: "Compte en attente", texte: "Ta demande est en cours de validation par un admin. Cette page se met à jour automatiquement, pas besoin de revenir te connecter." },
    refuse: { emoji: "🚫", titre: "Accès suspendu", texte: "Ton accès a été suspendu ou refusé. Contacte un admin si tu penses qu'il s'agit d'une erreur." },
  };
  const msg = messages[statut] || messages.refuse;
  if (loading) return <main className="min-h-screen bg-gray-950 flex items-center justify-center"><p className="text-gray-400">Chargement...</p></main>;
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute -inset-8 bg-blue-500 blur-3xl opacity-50 rounded-full" />
            <div className="absolute -inset-4 bg-blue-400 blur-2xl opacity-30 rounded-full" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-600/50">N</div>
          </div>
          <h1 className="text-3xl font-bold text-white mt-2">Nezro Academy</h1>
        </div>
        <div className="relative">
          <div className="absolute -inset-1 bg-blue-500 blur-2xl opacity-20 rounded-3xl" />
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <p className="text-5xl mb-4">{msg.emoji}</p>
            <h2 className="text-xl font-bold text-white mb-2">{msg.titre}</h2>
            <p className="text-gray-400 text-sm mb-6">{msg.texte}</p>
            <button onClick={logout} className="text-gray-500 hover:text-white text-sm underline">Se déconnecter</button>
          </div>
        </div>
      </div>
    </main>
  );
}
