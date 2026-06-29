"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function Auth() {
  const [mode, setMode] = useState<"login"|"signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async () => {
    setLoading(true); setMessage("");
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setMessage("Erreur : " + error.message); setLoading(false); return; }
      await supabase.from("profiles").insert({ id: data.user?.id, email, nom, statut: "en_attente", role: "membre" });
      setMessage("Demande envoyée ! En attente de validation.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setMessage("Email ou mot de passe incorrect."); setLoading(false); return; }
      const { data: profile } = await supabase.from("profiles").select("statut").eq("id", data.user?.id).single();
      if (!profile || profile.statut !== "accepte") {
        await supabase.auth.signOut();
        if (profile?.statut === "en_attente") setMessage("Ton compte est en attente de validation par un admin.");
        else setMessage("Ton accès a été refusé ou suspendu. Contacte un admin.");
        setLoading(false);
        return;
      }
      window.location.href = "/programme";
    }
    setLoading(false);
  };
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
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
            <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
              <button onClick={() => setMode("signup")} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode==="signup"?"bg-blue-600 text-white":"text-gray-400"}`}>S'inscrire</button>
              <button onClick={() => setMode("login")} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode==="login"?"bg-blue-600 text-white":"text-gray-400"}`}>Se connecter</button>
            </div>
            <div className="flex flex-col gap-4">
              {mode === "signup" && (
                <input type="text" placeholder="Ton prénom" value={nom} onChange={e => setNom(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              )}
              <input type="email" placeholder="Ton email" value={email} onChange={e => setEmail(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              <div className="relative">
                <input type={showPassword?"text":"password"} placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <button onClick={handleSubmit} disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-400 hover:to-blue-600 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/30">
                {loading ? "Chargement..." : mode==="signup" ? "Faire ma demande" : "Se connecter"}
              </button>
            </div>
            {message && <p className="mt-4 text-center text-sm text-gray-400">{message}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
