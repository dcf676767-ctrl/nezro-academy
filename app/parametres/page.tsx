"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Parametres() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifCommunaute, setNotifCommunaute] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/auth"); return; }
      setEmail(session.user.email || "");
      setUserId(session.user.id);
      const { data } = await supabase.from("profiles").select("nom,notif_email,notif_communaute").eq("id", session.user.id).single();
      if (data) {
        setNom(data.nom || "");
        setNotifEmail(data.notif_email ?? true);
        setNotifCommunaute(data.notif_communaute ?? true);
      }
      setLoading(false);
    });
  }, []);

  const sauvegarder = async () => {
    setSaving(true); setMsg("");
    if (newPassword && newPassword !== confirmPassword) {
      setMsg("❌ Les mots de passe ne correspondent pas."); setSaving(false); return;
    }
    await supabase.from("profiles").update({ nom, notif_email: notifEmail, notif_communaute: notifCommunaute }).eq("id", userId);
    if (newPassword) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) { setMsg("❌ Erreur mot de passe : " + error.message); setSaving(false); return; }
    }
    setMsg("✅ Paramètres sauvegardés !"); setSaving(false); setNewPassword(""); setConfirmPassword("");
  };

  const supprimerCompte = async () => {
    if (!confirm("⚠️ Supprimer ton compte ? Cette action est irréversible.")) return;
    await supabase.from("profiles").delete().eq("id", userId);
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Chargement...</div>;

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar active="/parametres" />
      <main className="flex-1 ml-64 p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">⚙️ Paramètres</h1>
        <p className="text-gray-400 mb-8">Gère ton compte et tes préférences</p>

        {msg && <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-semibold ${msg.startsWith("✅") ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>{msg}</div>}

        {/* Infos générales */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">👤 Informations générales</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Nom affiché</label>
              <input value={nom} onChange={e => setNom(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="Ton nom" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input value={email} disabled className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-500 text-sm cursor-not-allowed" />
              <p className="text-xs text-gray-600 mt-1">L'email ne peut pas être modifié</p>
            </div>
          </div>
        </div>

        {/* Mot de passe */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">🔒 Changer le mot de passe</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Nouveau mot de passe</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="Nouveau mot de passe" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Confirmer le mot de passe</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="Confirmer" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">🔔 Notifications</h2>
          <div className="flex flex-col gap-4">
            {[
              { label: "Notifications par email", sub: "Recevoir des emails pour les nouveautés", val: notifEmail, set: setNotifEmail },
              { label: "Activité de la communauté", sub: "Nouveaux membres, messages importants", val: notifCommunaute, set: setNotifCommunaute },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between">
                <div><p className="text-sm font-semibold text-white">{n.label}</p><p className="text-xs text-gray-400">{n.sub}</p></div>
                <button onClick={() => n.set(!n.val)} className={`w-12 h-6 rounded-full transition-colors relative ${n.val ? "bg-blue-600" : "bg-gray-700"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${n.val ? "left-6" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton sauvegarder */}
        <button onClick={sauvegarder} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors mb-6 disabled:opacity-50">
          {saving ? "Sauvegarde..." : "💾 Sauvegarder les modifications"}
        </button>

        {/* Zone danger */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-red-400 mb-2">⚠️ Zone de danger</h2>
          <p className="text-sm text-gray-400 mb-4">La suppression de ton compte est définitive et irréversible.</p>
          <button onClick={supprimerCompte} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
            🗑️ Supprimer mon compte
          </button>
        </div>
      </main>
    </div>
  );
}
