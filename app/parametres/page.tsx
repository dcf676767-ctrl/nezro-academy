"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Parametres() {
  const [section, setSection] = useState("profil");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [bio, setBio] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifChat, setNotifChat] = useState(true);
  const [notifProgression, setNotifProgression] = useState(true);
  const [youtubeHandle, setYoutubeHandle] = useState("");
  const [tiktokHandle, setTiktokHandle] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { window.location.replace("/auth"); return; }
      setUserId(session.user.id);
      setEmail(session.user.email || "");
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (data) {
        setNom(data.nom || "");
        setBio(data.bio || "");
        setNotifEmail(data.notif_email ?? true);
        setNotifChat(data.notif_chat ?? true);
        setNotifProgression(data.notif_progression ?? true);
        setYoutubeHandle(data.youtube_handle || "");
        setTiktokHandle(data.tiktok_handle || "");
        setInstagramHandle(data.instagram_handle || "");
      }
    });
  }, []);

  const showMsg = (text: string, type: string) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 4000);
  };

  const sauvegarderProfil = async () => {
    setLoading(true);
    await supabase.from("profiles").update({ nom, bio }).eq("id", userId);
    showMsg("✅ Profil sauvegardé !", "success");
    setLoading(false);
  };

  const changerMotDePasse = async () => {
    if (!newPassword) { showMsg("❌ Entre un mot de passe", "error"); return; }
    if (newPassword.length < 6) { showMsg("❌ Minimum 6 caractères", "error"); return; }
    if (newPassword !== confirmPassword) { showMsg("❌ Les mots de passe ne correspondent pas", "error"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { showMsg("❌ Erreur : " + error.message, "error"); }
    else { showMsg("✅ Mot de passe changé !", "success"); setNewPassword(""); setConfirmPassword(""); }
    setLoading(false);
  };

  const sauvegarderNotifs = async () => {
    setLoading(true);
    await supabase.from("profiles").update({ notif_email: notifEmail, notif_chat: notifChat, notif_progression: notifProgression }).eq("id", userId);
    showMsg("✅ Notifications sauvegardées !", "success");
    setLoading(false);
  };

  const sauvegarderReseaux = async () => {
    setLoading(true);
    await supabase.from("profiles").update({ youtube_handle: youtubeHandle, tiktok_handle: tiktokHandle, instagram_handle: instagramHandle }).eq("id", userId);
    showMsg("✅ Réseaux sociaux sauvegardés !", "success");
    setLoading(false);
  };

  const supprimerCompte = async () => {
    if (!confirm("⚠️ Es-tu sûr de vouloir supprimer ton compte ? Cette action est irréversible.")) return;
    await supabase.from("profiles").delete().eq("id", userId);
    await supabase.auth.signOut();
    window.location.replace("/auth");
  };

  const sections = [
    { id: "profil", label: "👤 Profil", },
    { id: "compte", label: "🔒 Compte", },
    { id: "notifications", label: "🔔 Notifications", },
    { id: "reseaux", label: "🌐 Réseaux sociaux", },
    { id: "danger", label: "⚠️ Zone de danger", },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar active="/parametres" />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-white mb-2">⚙️ Paramètres</h1>
        <p className="text-gray-400 mb-8">Gère ton compte et tes préférences</p>

        {msg.text && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-semibold ${msg.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
            {msg.text}
          </div>
        )}

        <div className="flex gap-6">
          {/* Menu gauche */}
          <div className="w-56 shrink-0">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              {sections.map(s => (
                <button key={s.id} onClick={() => setSection(s.id)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors border-b border-gray-800 last:border-0 ${section === s.id ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contenu */}
          <div className="flex-1">

            {/* PROFIL */}
            {section === "profil" && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">👤 Informations du profil</h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Prénom / Pseudo</label>
                    <input value={nom} onChange={e => setNom(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
                      placeholder="Ton prénom ou pseudo" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} maxLength={150}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="Parle de toi en quelques mots..." />
                    <p className="text-xs text-gray-500 text-right">{bio.length}/150</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Email</label>
                    <input value={email} disabled
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-500 text-sm cursor-not-allowed" />
                    <p className="text-xs text-gray-600 mt-1">L'email ne peut pas être modifié</p>
                  </div>
                  <button onClick={sauvegarderProfil} disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
                    {loading ? "Sauvegarde..." : "💾 Sauvegarder le profil"}
                  </button>
                </div>
              </div>
            )}

            {/* COMPTE */}
            {section === "compte" && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">🔒 Sécurité du compte</h2>
                <div className="flex flex-col gap-4">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-2">
                    <p className="text-sm text-gray-300 font-semibold">Email du compte</p>
                    <p className="text-gray-400 text-sm mt-1">{email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Nouveau mot de passe</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 pr-12"
                        placeholder="Nouveau mot de passe (min 6 caractères)" />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Confirmer le mot de passe</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
                      placeholder="Confirme ton nouveau mot de passe" />
                  </div>
                  <button onClick={changerMotDePasse} disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
                    {loading ? "Modification..." : "🔒 Changer le mot de passe"}
                  </button>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {section === "notifications" && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">🔔 Notifications</h2>
                <div className="flex flex-col gap-6">
                  {[
                    { label: "Notifications par email", sub: "Recevoir des emails pour les nouveautés de la formation", val: notifEmail, set: setNotifEmail },
                    { label: "Notifications de chat", sub: "Être notifié quand tu reçois un nouveau message", val: notifChat, set: setNotifChat },
                    { label: "Notifications de progression", sub: "Être notifié quand un badge est débloqué", val: notifProgression, set: setNotifProgression },
                  ].map((n, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-white">{n.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.sub}</p>
                      </div>
                      <button onClick={() => n.set(!n.val)}
                        className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${n.val ? "bg-blue-600" : "bg-gray-700"}`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${n.val ? "left-6" : "left-0.5"}`} />
                      </button>
                    </div>
                  ))}
                  <button onClick={sauvegarderNotifs} disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
                    {loading ? "Sauvegarde..." : "💾 Sauvegarder les notifications"}
                  </button>
                </div>
              </div>
            )}

            {/* RESEAUX SOCIAUX */}
            {section === "reseaux" && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-2">🌐 Réseaux sociaux</h2>
                <p className="text-sm text-gray-400 mb-6">Ajoute tes réseaux pour qu'ils s'affichent sur ton profil</p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">🎬 Chaîne YouTube</label>
                    <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden focus-within:border-blue-500">
                      <span className="px-4 text-gray-500 text-sm border-r border-gray-700 py-3">youtube.com/@</span>
                      <input value={youtubeHandle} onChange={e => setYoutubeHandle(e.target.value)}
                        className="flex-1 bg-transparent px-4 py-3 text-white text-sm focus:outline-none"
                        placeholder="tachaîne" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">🎵 TikTok</label>
                    <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden focus-within:border-blue-500">
                      <span className="px-4 text-gray-500 text-sm border-r border-gray-700 py-3">tiktok.com/@</span>
                      <input value={tiktokHandle} onChange={e => setTiktokHandle(e.target.value)}
                        className="flex-1 bg-transparent px-4 py-3 text-white text-sm focus:outline-none"
                        placeholder="tonpseudo" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">📸 Instagram</label>
                    <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden focus-within:border-blue-500">
                      <span className="px-4 text-gray-500 text-sm border-r border-gray-700 py-3">instagram.com/</span>
                      <input value={instagramHandle} onChange={e => setInstagramHandle(e.target.value)}
                        className="flex-1 bg-transparent px-4 py-3 text-white text-sm focus:outline-none"
                        placeholder="tonpseudo" />
                    </div>
                  </div>
                  <button onClick={sauvegarderReseaux} disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
                    {loading ? "Sauvegarde..." : "💾 Sauvegarder les réseaux"}
                  </button>
                </div>
              </div>
            )}

            {/* ZONE DANGER */}
            {section === "danger" && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-red-400 mb-2">⚠️ Zone de danger</h2>
                <p className="text-sm text-gray-400 mb-6">Ces actions sont irréversibles. Fais attention !</p>
                <div className="flex flex-col gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-sm font-semibold text-white mb-1">🗑️ Supprimer mon compte</p>
                    <p className="text-xs text-gray-400 mb-4">Toutes tes données seront supprimées définitivement. Cette action est irréversible.</p>
                    <button onClick={supprimerCompte}
                      className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
                      Supprimer mon compte définitivement
                    </button>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-sm font-semibold text-white mb-1">🚪 Se déconnecter de tous les appareils</p>
                    <p className="text-xs text-gray-400 mb-4">Déconnecte-toi de tous tes appareils en même temps.</p>
                    <button onClick={async () => { await supabase.auth.signOut(); window.location.replace("/auth"); }}
                      className="bg-orange-500/20 hover:bg-orange-500/40 text-orange-400 border border-orange-500/30 font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
                      Se déconnecter partout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
