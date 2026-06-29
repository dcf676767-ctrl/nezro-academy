"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Parametres() {
  const [userId, setUserId] = useState("");
  const [nom, setNom] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [siteWeb, setSiteWeb] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifCommunaute, setNotifCommunaute] = useState(true);
  const [notifProgression, setNotifProgression] = useState(true);
  const [notifNouveauModule, setNotifNouveauModule] = useState(true);
  const [profilPublic, setProfilPublic] = useState(true);
  const [showProgression, setShowProgression] = useState(true);
  const [langue, setLangue] = useState("fr");
  const [theme, setTheme] = useState("dark");
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("profil");
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.replace("/auth"); return; }
      setUserId(session.user.id);
      setEmail(session.user.email || "");
      supabase.from("profiles").select("*").eq("id", session.user.id).single().then(({ data }) => {
        if (!data) return;
        setNom(data.nom || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || "");
        setPseudo(data.pseudo || "");
        setLocalisation(data.localisation || "");
        setSiteWeb(data.site_web || "");
        setTwitter(data.twitter || "");
        setYoutube(data.youtube || "");
        setNotifEmail(data.notif_email ?? true);
        setNotifCommunaute(data.notif_communaute ?? true);
        setNotifProgression(data.notif_progression ?? true);
        setNotifNouveauModule(data.notif_nouveau_module ?? true);
        setProfilPublic(data.profil_public ?? true);
        setShowProgression(data.show_progression ?? true);
        setLangue(data.langue || "fr");
        setTheme(data.theme || "dark");
      });
    });
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
    await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", userId);
    setUploading(false);
  };

  const saveProfil = async () => {
    await supabase.from("profiles").update({ nom, bio, pseudo, localisation, site_web: siteWeb, twitter, youtube }).eq("id", userId);
    setSaved(true); setMsg("Profil sauvegardé !"); setTimeout(() => { setSaved(false); setMsg(""); }, 2500);
  };

  const savePassword = async () => {
    if (newPassword !== confirmPassword) { setMsg("❌ Les mots de passe ne correspondent pas !"); return; }
    if (newPassword.length < 6) { setMsg("❌ Minimum 6 caractères !"); return; }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { setMsg("❌ Erreur : " + error.message); return; }
    setMsg("✅ Mot de passe changé !"); setNewPassword(""); setConfirmPassword("");
    setTimeout(() => setMsg(""), 2500);
  };

  const saveNotifs = async () => {
    await supabase.from("profiles").update({ notif_email: notifEmail, notif_communaute: notifCommunaute, notif_progression: notifProgression, notif_nouveau_module: notifNouveauModule }).eq("id", userId);
    setMsg("✅ Notifications sauvegardées !"); setTimeout(() => setMsg(""), 2500);
  };

  const saveConfidentialite = async () => {
    await supabase.from("profiles").update({ profil_public: profilPublic, show_progression: showProgression }).eq("id", userId);
    setMsg("✅ Confidentialité sauvegardée !"); setTimeout(() => setMsg(""), 2500);
  };

  const savePreferences = async () => {
    await supabase.from("profiles").update({ langue, theme }).eq("id", userId);
    setMsg("✅ Préférences sauvegardées !"); setTimeout(() => setMsg(""), 2500);
  };

  const deleteAccount = async () => {
    if (!confirm("Es-tu sûr de vouloir supprimer ton compte ? Cette action est irréversible.")) return;
    await supabase.from("profiles").delete().eq("id", userId);
    await supabase.auth.signOut();
    window.location.replace("/auth");
  };

  const sections = [
    { id: "profil", label: "👤 Profil", icon: "👤" },
    { id: "compte", label: "🔐 Compte", icon: "🔐" },
    { id: "apparence", label: "🎨 Apparence", icon: "🎨" },
    { id: "notifications", label: "🔔 Notifications", icon: "🔔" },
    { id: "confidentialite", label: "🔒 Confidentialité", icon: "🔒" },
    { id: "reseaux", label: "🌐 Réseaux sociaux", icon: "🌐" },
    { id: "danger", label: "⚠️ Zone de danger", icon: "⚠️" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-white mb-2">⚙️ Paramètres</h1>
        <p className="text-gray-400 mb-8">Gère ton compte et tes préférences</p>

        {msg && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-semibold ${msg.includes("❌") ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-green-500/20 text-green-400 border border-green-500/30"}`}>
            {msg}
          </div>
        )}

        <div className="flex gap-8">
          {/* Menu gauche */}
          <div className="w-56 shrink-0">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 flex flex-col gap-1 sticky top-8">
              {sections.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeSection === s.id ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contenu */}
          <div className="flex-1 flex flex-col gap-6">

            {/* PROFIL */}
            {activeSection === "profil" && (
              <>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-white mb-6">👤 Informations du profil</h2>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-900 border-4 border-blue-500/30">
                        {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-400">{nom?.[0]?.toUpperCase() || "?"}</div>}
                      </div>
                      <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-blue-700">✏️</button>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{nom || "Ton nom"}</p>
                      <p className="text-gray-400 text-sm">{email}</p>
                      {uploading && <p className="text-blue-400 text-xs mt-1">Upload en cours...</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Prénom / Nom</label>
                      <input value={nom} onChange={e => setNom(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="Ton nom" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Pseudo</label>
                      <input value={pseudo} onChange={e => setPseudo(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="@tonpseudo" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-gray-400 mb-1 block">Bio</label>
                      <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} maxLength={200} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="Parle de toi en quelques mots..." />
                      <p className="text-xs text-gray-600 text-right mt-1">{bio.length}/200</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">📍 Localisation</label>
                      <input value={localisation} onChange={e => setLocalisation(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="Paris, France" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">🌐 Site web</label>
                      <input value={siteWeb} onChange={e => setSiteWeb(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="https://tonsite.com" />
                    </div>
                  </div>
                  <button onClick={saveProfil} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
                    {saved ? "✅ Sauvegardé !" : "💾 Sauvegarder le profil"}
                  </button>
                </div>
              </>
            )}

            {/* COMPTE */}
            {activeSection === "compte" && (
              <>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-white mb-4">📧 Informations du compte</h2>
                  <div className="mb-4">
                    <label className="text-sm text-gray-400 mb-1 block">Adresse email</label>
                    <input value={email} disabled className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-500 text-sm cursor-not-allowed" />
                    <p className="text-xs text-gray-600 mt-1">L'email ne peut pas être modifié pour l'instant.</p>
                  </div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-white mb-4">🔒 Changer le mot de passe</h2>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Nouveau mot de passe</label>
                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Confirmer le mot de passe</label>
                      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="Confirmer" />
                    </div>
                    <button onClick={savePassword} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all self-start">
                      🔐 Changer le mot de passe
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* APPARENCE */}
            {activeSection === "apparence" && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-6">🎨 Apparence</h2>
                <div className="mb-6">
                  <label className="text-sm text-gray-400 mb-3 block">Thème</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "dark", label: "🌑 Sombre", desc: "Thème sombre (actuel)" },
                      { id: "light", label: "☀️ Clair", desc: "Thème clair" },
                      { id: "midnight", label: "🌌 Midnight", desc: "Bleu nuit profond" },
                    ].map(t => (
                      <button key={t.id} onClick={() => setTheme(t.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${theme === t.id ? "border-blue-500 bg-blue-500/10" : "border-gray-700 bg-gray-800 hover:border-gray-600"}`}>
                        <p className="font-semibold text-white text-sm">{t.label}</p>
                        <p className="text-gray-400 text-xs mt-1">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="text-sm text-gray-400 mb-3 block">Langue</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "fr", label: "🇫🇷 Français" },
                      { id: "en", label: "🇬🇧 English" },
                      { id: "es", label: "🇪🇸 Español" },
                    ].map(l => (
                      <button key={l.id} onClick={() => setLangue(l.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${langue === l.id ? "border-blue-500 bg-blue-500/10" : "border-gray-700 bg-gray-800 hover:border-gray-600"}`}>
                        <p className="font-semibold text-white text-sm">{l.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={savePreferences} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
                  💾 Sauvegarder les préférences
                </button>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeSection === "notifications" && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-6">🔔 Notifications</h2>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Notifications par email", desc: "Recevoir des emails pour les nouveautés", val: notifEmail, set: setNotifEmail },
                    { label: "Activité de la communauté", desc: "Nouveaux membres, messages importants", val: notifCommunaute, set: setNotifCommunaute },
                    { label: "Ma progression", desc: "Rappels pour continuer les modules", val: notifProgression, set: setNotifProgression },
                    { label: "Nouveaux modules", desc: "Me prévenir quand un nouveau module est ajouté", val: notifNouveauModule, set: setNotifNouveauModule },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
                      <div>
                        <p className="text-white font-semibold text-sm">{item.label}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <button onClick={() => item.set(!item.val)}
                        className={`w-12 h-6 rounded-full transition-all relative ${item.val ? "bg-blue-600" : "bg-gray-700"}`}>
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.val ? "left-7" : "left-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={saveNotifs} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
                  💾 Sauvegarder les notifications
                </button>
              </div>
            )}

            {/* CONFIDENTIALITE */}
            {activeSection === "confidentialite" && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-6">🔒 Confidentialité</h2>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Profil public", desc: "Ton profil est visible par les autres membres", val: profilPublic, set: setProfilPublic },
                    { label: "Afficher ma progression", desc: "Les autres membres peuvent voir ta progression dans les modules", val: showProgression, set: setShowProgression },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
                      <div>
                        <p className="text-white font-semibold text-sm">{item.label}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <button onClick={() => item.set(!item.val)}
                        className={`w-12 h-6 rounded-full transition-all relative ${item.val ? "bg-blue-600" : "bg-gray-700"}`}>
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.val ? "left-7" : "left-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={saveConfidentialite} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
                  💾 Sauvegarder
                </button>
              </div>
            )}

            {/* RESEAUX SOCIAUX */}
            {activeSection === "reseaux" && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-6">🌐 Réseaux sociaux</h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">🐦 Twitter / X</label>
                    <input value={twitter} onChange={e => setTwitter(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="@tonpseudo" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">▶️ YouTube</label>
                    <input value={youtube} onChange={e => setYoutube(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="https://youtube.com/@tachaîne" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">🌐 Site web</label>
                    <input value={siteWeb} onChange={e => setSiteWeb(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="https://tonsite.com" />
                  </div>
                </div>
                <button onClick={saveProfil} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
                  💾 Sauvegarder les réseaux
                </button>
              </div>
            )}

            {/* ZONE DE DANGER */}
            {activeSection === "danger" && (
              <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-red-400 mb-2">⚠️ Zone de danger</h2>
                <p className="text-gray-400 text-sm mb-6">Ces actions sont irréversibles. Fais attention.</p>
                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">🚪 Se déconnecter</p>
                      <p className="text-gray-400 text-xs mt-0.5">Se déconnecter de ton compte</p>
                    </div>
                    <button onClick={async () => { await supabase.auth.signOut(); window.location.replace("/auth"); }}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                      Se déconnecter
                    </button>
                  </div>
                  <div className="p-4 bg-red-950/50 rounded-xl border border-red-500/30 flex items-center justify-between">
                    <div>
                      <p className="text-red-400 font-semibold text-sm">🗑️ Supprimer mon compte</p>
                      <p className="text-gray-400 text-xs mt-0.5">La suppression de ton compte est définitive et irréversible.</p>
                    </div>
                    <button onClick={deleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                      Supprimer
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
