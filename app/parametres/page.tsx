"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Parametres() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push("/auth"); return; }
      setUserId(session.user.id);
      setEmail(session.user.email || "");
      supabase.from("profiles").select("*").eq("id", session.user.id).single().then(({ data }) => {
        if (data) { setNom(data.nom || ""); setBio(data.bio || ""); setAvatar(data.avatar_url || ""); }
      });
    });
  }, []);

  const sauvegarder = async () => {
    setLoading(true); setMessage("");
    await supabase.from("profiles").update({ nom, bio }).eq("id", userId);
    setMessage("✅ Profil mis à jour !");
    setLoading(false);
  };

  const changerMotDePasse = async () => {
    if (!password) { setMessage("❌ Entre un nouveau mot de passe."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMessage("❌ " + error.message);
    else setMessage("✅ Mot de passe mis à jour !");
    setPassword("");
    setLoading(false);
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const ext = file.name.split(".").pop();
    const path = userId + "." + ext;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { setMessage("❌ " + error.message); setLoading(false); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", userId);
    setAvatar(data.publicUrl);
    setMessage("✅ Photo mise à jour !");
    setLoading(false);
  };

  const supprimerCompte = async () => {
    if (!confirm("Es-tu sûr de vouloir supprimer ton compte ? Cette action est irréversible.")) return;
    await supabase.from("profiles").update({ statut: "supprime" }).eq("id", userId);
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const deconnecter = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar active="/parametres" />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">⚙️ Paramètres</h1>

          {message && <div className="mb-6 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-300">{message}</div>}

          {/* Photo de profil */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
            <h2 className="font-bold text-white mb-4">📷 Photo de profil</h2>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                {avatar ? <img src={avatar} className="w-20 h-20 object-cover rounded-full" alt="avatar" /> :
                  <span className="text-3xl font-bold text-white">{nom?.[0]?.toUpperCase() || "?"}</span>}
              </div>
              <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all">
                Changer la photo
                <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
              </label>
            </div>
          </div>

          {/* Infos */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
            <h2 className="font-bold text-white mb-4">👤 Informations</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Prénom / Nom</label>
                <input value={nom} onChange={e => setNom(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Biographie</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Email</label>
                <input value={email} disabled
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-500 text-sm cursor-not-allowed" />
              </div>
              <button onClick={sauvegarder} disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all disabled:opacity-50">
                {loading ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          </div>

          {/* Mot de passe */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
            <h2 className="font-bold text-white mb-4">🔐 Mot de passe</h2>
            <div className="flex gap-3">
              <input type="password" placeholder="Nouveau mot de passe" value={password} onChange={e => setPassword(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" />
              <button onClick={changerMotDePasse} disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 rounded-xl text-sm transition-all disabled:opacity-50">
                Modifier
              </button>
            </div>
          </div>

          {/* Déconnexion */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
            <h2 className="font-bold text-white mb-4">🚪 Session</h2>
            <button onClick={deconnecter}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all">
              Se déconnecter
            </button>
          </div>

          {/* Danger */}
          <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6">
            <h2 className="font-bold text-red-400 mb-2">⚠️ Zone de danger</h2>
            <p className="text-gray-500 text-sm mb-4">La suppression de ton compte est irréversible. Tout accès sera immédiatement supprimé.</p>
            <button onClick={supprimerCompte}
              className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 font-semibold py-2.5 px-6 rounded-xl text-sm transition-all">
              Supprimer mon compte
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}