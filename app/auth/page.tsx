"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setMessage("Erreur : " + error.message); setLoading(false); return; }
      await supabase.from("profiles").insert({ id: data.user?.id, email, nom, statut: "en_attente", role: "membre" });
      setMessage("✅ Demande envoyée ! En attente d'approbation par l'admin.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setMessage("❌ Email ou mot de passe incorrect."); setLoading(false); return; }
      window.location.href = "/programme";
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">N</div>
          <span className="text-2xl font-bold text-gray-900">Nezro Academy</span>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button onClick={() => setMode("signup")} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "signup" ? "bg-blue-600 text-white shadow" : "text-gray-500"}`}>S'inscrire</button>
          <button onClick={() => setMode("login")} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "login" ? "bg-blue-600 text-white shadow" : "text-gray-500"}`}>Se connecter</button>
        </div>
        <div className="flex flex-col gap-4">
          {mode === "signup" && (
            <input type="text" placeholder="Ton prénom" value={nom} onChange={(e) => setNom(e.target.value)} className="border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-blue-500" />
          )}
          <input type="email" placeholder="Ton email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-blue-500" />
          <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-blue-500" />
          <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50">
            {loading ? "Chargement..." : mode === "signup" ? "Faire ma demande" : "Se connecter"}
          </button>
        </div>
        {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
      </div>
    </main>
  );
}