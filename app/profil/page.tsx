"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function Profil() {
  const [nom, setNom] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [confetti, setConfetti] = useState<{id:number;x:number;color:string}[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      setUserId(user.id);
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) { setNom(data.nom || ""); setBio(data.bio || ""); setAvatarUrl(data.avatar_url || ""); }
    };
    load();
  }, []);

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${userId}.${ext}`;
    await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setUploading(false);
  };

  const save = async () => {
    if (!avatarUrl) { setError("Tu dois ajouter une photo de profil !"); return; }
    setError("");
    await supabase.from("profiles").update({ nom, bio, avatar_url: avatarUrl }).eq("id", userId);
    setSaved(true);
    const items = Array.from({length: 30}, (_,i) => ({id: i, x: Math.random()*100, color: ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6"][Math.floor(Math.random()*5)]}));
    setConfetti(items);
    setTimeout(() => { setSaved(false); setConfetti([]); }, 3000);
  };

  const logout = async () => { await supabase.auth.signOut(); window.location.href = "/auth"; };

  return (
    <main className="min-h-screen bg-gray-50">
      {confetti.map(c => (
        <div key={c.id} className="fixed pointer-events-none z-50 text-2xl animate-bounce"
          style={{left: `${c.x}%`, top: `${Math.random()*60}%`, color: c.color, animationDelay: `${Math.random()*0.5}s`}}>🎉</div>
      ))}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">N</div>
            <span className="font-bold text-lg text-gray-900">Nezro Academy</span>
          </div>
          <nav className="flex gap-1">
            <button onClick={() => window.location.href="/programme"} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Programme</button>
            <button onClick={() => window.location.href="/membres"} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Membres</button>
          </nav>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-blue-300">
            {avatarUrl ? <img src={avatarUrl} className="w-10 h-10 object-cover rounded-full" alt="avatar" /> : <span className="text-blue-600 font-bold">{nom?.[0]?.toUpperCase() || "?"}</span>}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              <button onClick={() => window.location.href="/profil"} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl font-medium">👤 Mon profil</button>
              <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-b-xl font-medium">🚪 Se déconnecter</button>
            </div>
          )}
        </div>
      </header>
      <section className="max-w-xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Mon profil</h2>
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-blue-200">
              {avatarUrl ? <img src={avatarUrl} className="w-24 h-24 object-cover rounded-full" alt="avatar" /> : <span className="text-3xl text-blue-400">📷</span>}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-700 shadow">
              ✏️
              <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
            </label>
          </div>
          {uploading && <p className="text-sm text-blue-500">Upload en cours...</p>}
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          <div className="w-full flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Prénom</label>
              <input value={nom} onChange={(e) => setNom(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500" placeholder="Ton prénom" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={150} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none" placeholder="Parle de toi en quelques mots..." />
              <p className="text-xs text-gray-400 text-right">{bio.length}/150</p>
            </div>
            <button onClick={save} className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
              {saved ? "🎉 Sauvegardé !" : "Sauvegarder"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
