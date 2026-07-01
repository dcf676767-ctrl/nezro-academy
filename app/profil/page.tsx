"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import Sidebar from "../components/Sidebar";
const MODULES = [{id:1,c:1},{id:2,c:3},{id:3,c:3},{id:4,c:3},{id:5,c:3},{id:6,c:3},{id:7,c:3}];
const TOTAL = 19;
export default function Profil() {
  const [nom, setNom] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [progression, setProgression] = useState(0);
  const [modulesTermines, setModulesTermines] = useState(0);
  const [dateInscription, setDateInscription] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.replace("/auth"); return; }
      setUserId(session.user.id);
      if (session.user.created_at) {
        setDateInscription(new Date(session.user.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }));
      }
      supabase.from("profiles").select("nom,bio,avatar_url").eq("id", session.user.id).single().then(({ data }) => {
        if (data) { setNom(data.nom||""); setBio(data.bio||""); setAvatarUrl(data.avatar_url||""); }
      });
      supabase.from("progression").select("*").eq("user_id", session.user.id).eq("completed", true).then(({ data }) => {
        if (!data) return;
        setProgression(Math.round((data.length / TOTAL) * 100));
        let t = 0;
        MODULES.forEach(m => { if (data.filter((p:any) => p.module_id === m.id).length >= m.c) t++; });
        setModulesTermines(t);
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
    const urlAvecCache = `${data.publicUrl}?t=${Date.now()}`;
    await supabase.from("profiles").update({ avatar_url: urlAvecCache }).eq("id", userId);
    setAvatarUrl(urlAvecCache);
  };

  const save = async () => {
    setLoading(true);
    await supabase.from("profiles").update({ nom, bio }).eq("id", userId);
    setMessage("✅ Profil sauvegardé !");
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const badges = [
    { label: "🚀 Membre", ok: true, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    { label: "✅ Actif", ok: progression > 0, color: "bg-green-500/20 text-green-400 border-green-500/30" },
    { label: "⭐ Early", ok: true, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    { label: "🏆 Avancé", ok: progression >= 50, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    { label: "💎 Elite", ok: progression >= 100, color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  ];
  const prochain = badges.find(b => !b.ok);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar active="/profil" />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-white mb-8">👤 Mon profil</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative cursor-pointer" onClick={() => fileRef.current?.click()}>
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden border-4 border-gray-700">
                  {avatarUrl ? <img src={avatarUrl} className="w-24 h-24 object-cover" alt="avatar" /> : <span className="text-3xl text-white font-bold">{nom?.[0]?.toUpperCase()||"?"}</span>}
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm border-2 border-gray-900">✏️</div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              </div>
              <p className="text-sm text-gray-400 mt-2">Clique pour changer la photo</p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Prénom</label>
                <input value={nom} onChange={e => setNom(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="Ton prénom" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} maxLength={150} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="Parle de toi en quelques mots..." />
                <p className="text-xs text-gray-500 text-right">{bio.length}/150</p>
              </div>
              {message && <p className="text-sm text-green-400 font-semibold">{message}</p>}
              <button onClick={save} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
                {loading ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">🎯 Ma progression</h3>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Modules terminés</span>
                <span className="text-white font-bold">{modulesTermines}/7</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all" style={{width:`${progression}%`}} />
              </div>
              <p className="text-xs text-gray-400">{progression}% du programme complété</p>
              {progression === 100 ? <p className="text-xs text-green-400 mt-2 font-semibold">🎉 Programme complété !</p> : <p className="text-xs text-blue-400 mt-2">Continue comme ça ! 🔥</p>}
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">🏆 Badges</h3>
              <div className="flex flex-wrap gap-2">
                {badges.filter(b => b.ok).map((b, i) => (
                  <span key={i} className={`text-xs font-semibold px-3 py-1 rounded-full border ${b.color}`}>{b.label}</span>
                ))}
              </div>
              {prochain && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className="text-xs text-gray-400">Prochain badge :</p>
                  <p className="text-xs text-gray-300 font-semibold mt-1">{prochain.label}</p>
                  <p className="text-xs text-gray-500 mt-1">Continue ta progression !</p>
                </div>
              )}
            </div>
            {dateInscription && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="font-bold text-white mb-2">📅 Membre depuis</h3>
                <p className="text-sm text-gray-400">{dateInscription}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
