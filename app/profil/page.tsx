"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function Profil() {
  const [nom, setNom] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.replace("/auth"); return; }
      setUserId(session.user.id);
      supabase.from("profiles").select("nom,bio,avatar_url").eq("id", session.user.id).single().then(({ data }) => {
        if (data) { setNom(data.nom||""); setBio(data.bio||""); setAvatarUrl(data.avatar_url||""); }
      });
    });
  }, []);
  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;
    await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", userId);
    setAvatarUrl(data.publicUrl);
  };
  const save = async () => {
    setLoading(true);
    await supabase.from("profiles").update({ nom, bio }).eq("id", userId);
    setMessage("✅ Profil sauvegardé !");
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar active="" />
      <main className="flex-1 ml-64 p-8">
        <h2 className="text-3xl font-bold text-white mb-8">👤 Mon profil</h2>
        <div className="flex gap-8">
          <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative cursor-pointer" onClick={() => fileRef.current?.click()}>
                <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden border-4 border-gray-800">
                  {avatarUrl ? <img src={avatarUrl} className="w-28 h-28 object-cover rounded-full" alt="avatar" /> : <span className="text-white font-bold text-4xl">{nom?.[0]?.toUpperCase()||"?"}</span>}
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-gray-900">✏️</div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              <p className="text-xs text-gray-500 mt-2">Clique pour changer la photo</p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Prénom</label>
                <input type="text" value={nom} onChange={e => setNom(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={5} maxLength={150}
                  placeholder="Parle de toi en quelques mots..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
                <p className="text-xs text-gray-500 text-right">{bio.length}/150</p>
              </div>
              <button onClick={save} disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50">
                {loading ? "Sauvegarde..." : "Sauvegarder"}
              </button>
              {message && <p className="text-center text-sm text-green-400">{message}</p>}
            </div>
          </div>
          <div className="w-80 shrink-0 flex flex-col gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">🎯 Ma progression</h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Modules terminés</span><span className="text-white font-bold">2/7</span></div>
                <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width:"28%"}} /></div>
                <p className="text-xs text-gray-500">Continue comme ça ! 🔥</p>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">🏆 Badges</h3>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-full">🚀 Membre</span>
                <span className="text-xs bg-green-600/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full">✅ Actif</span>
                <span className="text-xs bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded-full">⭐ Early</span>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-2">💡 Astuce</h3>
              <p className="text-sm text-gray-400">Complète tous les modules pour débloquer le badge 💎 Elite !</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
