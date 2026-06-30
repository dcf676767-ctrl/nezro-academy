"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Auth() {
  const router = useRouter();
  const [mode, setMode] = useState<"login"|"signup">("signup");
  const [step, setStep] = useState<"auth"|"profil">("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${userId}.${ext}`;
    await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setUploading(false);
  };

  const handleSubmit = async () => {
    setLoading(true); setMessage("");
    if (mode === "signup") {
      if (!nom.trim()) { setMessage("Entre ton prénom !"); setLoading(false); return; }
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setMessage("Erreur : " + error.message); setLoading(false); return; }
      const uid = data.user?.id;
      if (!uid) { setMessage("Erreur inattendue."); setLoading(false); return; }
      setUserId(uid);
      await supabase.from("profiles").insert({ id: uid, email, nom, statut: "en_attente", role: "membre" });
      setStep("profil");
      setLoading(false);
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setMessage("Email ou mot de passe incorrect."); setLoading(false); return; }
      const { data: profile } = await supabase.from("profiles").select("statut").eq("id", data.user?.id).single();
      if (!profile || profile.statut !== "accepte") { router.push("/bloque"); return; }
      router.push("/programme");
    }
  };

  const finaliserProfil = async () => {
    if (!nom.trim()) { setMessage("Le nom est obligatoire !"); return; }
    if (!avatarUrl) { setMessage("La photo de profil est obligatoire !"); return; }
    setLoading(true);
    await supabase.from("profiles").update({ nom, bio, avatar_url: avatarUrl }).eq("id", userId);
    router.push("/bloque");
  };

  if (step === "profil") {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="absolute -inset-8 bg-blue-500 blur-3xl opacity-50 rounded-full" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-600/50">N</div>
            </div>
            <h1 className="text-3xl font-bold text-white mt-2">Complète ton profil</h1>
            <p className="text-gray-400 text-sm mt-1">Avant de rejoindre la communauté</p>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-blue-500 blur-2xl opacity-20 rounded-3xl" />
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col gap-5">

              {/* Photo obligatoire */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative cursor-pointer" onClick={() => fileRef.current?.click()}>
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-900 border-4 border-blue-500/40 flex items-center justify-center">
                    {avatarUrl
                      ? <img src={avatarUrl} className="w-full h-full object-cover" />
                      : <span className="text-4xl">📷</span>
                    }
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm border-2 border-gray-900">+</div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
                <p className="text-xs text-gray-400">
                  {uploading ? "Upload en cours..." : <span>Photo de profil <span className="text-red-400">*obligatoire</span></span>}
                </p>
              </div>

              {/* Nom obligatoire */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Ton prénom / nom <span className="text-red-400">*</span></label>
                <input value={nom} onChange={e => setNom(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Julien Martin" />
              </div>

              {/* Bio facultative */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Bio <span className="text-gray-600">(facultatif)</span></label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} maxLength={200}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Parle de toi en quelques mots..." />
                <p className="text-xs text-gray-600 text-right">{bio.length}/200</p>
              </div>

              {message && <p className="text-red-400 text-sm text-center">{message}</p>}

              <button onClick={finaliserProfil} disabled={loading || uploading}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-400 hover:to-blue-600 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/30">
                {loading ? "Envoi..." : "✅ Envoyer ma demande"}
              </button>

              <p className="text-xs text-gray-500 text-center">Ta demande sera examinée par l'admin. Tu recevras accès sous peu.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-2">
            <div className="absolute -inset-8 bg-blue-500 blur-3xl opacity-50 rounded-full" />
            <div className="absolute -inset-4 bg-blue-400 blur-2xl opacity-30 rounded-full" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-700 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-blue-600/50 gap-0.5">
              <span className="font-bold text-2xl leading-none">N</span>
              <span className="font-semibold text-[9px] leading-none tracking-wide">Nezro Academy</span>
            </div>
          </div>
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
                <input type="text" placeholder="Ton prénom *" value={nom} onChange={e => setNom(e.target.value)}
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
                {loading ? "Chargement..." : mode==="signup" ? "Faire ma demande →" : "Se connecter"}
              </button>
            </div>
            {message && <p className="mt-4 text-center text-sm text-red-400">{message}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
