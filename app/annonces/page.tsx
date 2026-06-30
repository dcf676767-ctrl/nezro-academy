"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const EMOJIS = ["😀","😂","🔥","❤️","👍","🎉","💪","🚀","⭐","👏","😎","🙌"];

export default function Annonces() {
  const router = useRouter();
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contenu, setContenu] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [reactions, setReactions] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const [sondages, setSondages] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [creationSondage, setCreationSondage] = useState(false);
  const [questionSondage, setQuestionSondage] = useState("");
  const [optionsSondage, setOptionsSondage] = useState(["", ""]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/auth"); return; }
      setUserId(session.user.id);
      const { data } = await supabase.from("profiles").select("email").eq("id", session.user.id).single();
      setIsAdmin(data?.email === "dcf676767@gmail.com");
      chargerAnnonces();
      chargerReactions();
      chargerSondages();

    });

    const sub = supabase.channel("annonces-realtime-" + Math.random())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "annonces" }, () => {
        chargerAnnonces();
      }).subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  const chargerAnnonces = async () => {
    const { data } = await supabase.from("annonces").select("*").order("created_at", { ascending: true });
    if (data) setAnnonces(data);
    setLoading(false);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from("annonces_vu").upsert({ user_id: session.user.id, derniere_visite: new Date().toISOString() });
    }
    window.dispatchEvent(new Event("annonces_vues"));
  };

  const chargerSondages = async () => {
    const { data: s } = await supabase.from("sondages").select("*").order("created_at", { ascending: true });
    if (s) setSondages(s);
    const { data: v } = await supabase.from("sondage_votes").select("*");
    if (v) setVotes(v);
  };

  const ajouterOption = () => setOptionsSondage(prev => [...prev, ""]);
  const modifierOption = (i: number, val: string) => setOptionsSondage(prev => prev.map((o, idx) => idx === i ? val : o));
  const retirerOption = (i: number) => setOptionsSondage(prev => prev.filter((_, idx) => idx !== i));

  const creerSondage = async () => {
    const options = optionsSondage.map(o => o.trim()).filter(o => o.length > 0);
    if (!questionSondage.trim() || options.length < 2) { alert("Ajoute une question et au moins 2 options."); return; }
    const { data: { session } } = await supabase.auth.getSession();
    const { data: profil } = await supabase.from("profiles").select("nom").eq("id", session?.user.id).single();
    const { error } = await supabase.from("sondages").insert({
      question: questionSondage.trim(),
      options,
      auteur_nom: profil?.nom || "Admin",
    });
    if (error) { alert("Erreur : " + error.message); return; }
    setQuestionSondage(""); setOptionsSondage(["", ""]); setCreationSondage(false);
    chargerSondages();
  };

  const supprimerSondage = async (id: string) => {
    if (!confirm("Supprimer ce sondage ?")) return;
    const { error } = await supabase.from("sondages").delete().eq("id", id);
    if (error) { alert("Erreur : " + error.message); return; }
    setSondages(prev => prev.filter(s => s.id !== id));
  };

  const voter = async (sondageId: string, optionIndex: number) => {
    const monVote = votes.find(v => v.sondage_id === sondageId && v.user_id === userId);
    if (monVote) {
      if (monVote.option_index === optionIndex) {
        const { error } = await supabase.from("sondage_votes").delete().eq("id", monVote.id);
        if (error) { alert("Erreur : " + error.message); return; }
        setVotes(prev => prev.filter(v => v.id !== monVote.id));
      } else {
        const { error } = await supabase.from("sondage_votes").update({ option_index: optionIndex }).eq("id", monVote.id);
        if (error) { alert("Erreur : " + error.message); return; }
        setVotes(prev => prev.map(v => v.id === monVote.id ? { ...v, option_index: optionIndex } : v));
      }
    } else {
      const { data, error } = await supabase.from("sondage_votes").insert({ sondage_id: sondageId, user_id: userId, option_index: optionIndex }).select().single();
      if (error) { alert("Erreur : " + error.message); return; }
      if (data) setVotes(prev => [...prev, data]);
    }
  };

  const chargerReactions = async () => {
    const { data } = await supabase.from("annonce_reactions").select("*");
    if (data) setReactions(data);
  };

  const toggleReaction = async (annonceId: string, emoji: string) => {
    const existe = reactions.find(r => r.annonce_id === annonceId && r.user_id === userId && r.emoji === emoji);
    if (existe) {
      await supabase.from("annonce_reactions").delete().eq("id", existe.id);
      setReactions(prev => prev.filter(r => r.id !== existe.id));
    } else {
      const { data } = await supabase.from("annonce_reactions").insert({ annonce_id: annonceId, user_id: userId, emoji }).select().single();
      if (data) setReactions(prev => [...prev, data]);
    }
  };

  const supprimer = async (id: string) => {
    if (!confirm("Supprimer cette annonce ?")) return;
    const { error } = await supabase.from("annonces").delete().eq("id", id);
    if (error) { alert("Erreur lors de la suppression : " + error.message); return; }
    setAnnonces(prev => prev.filter(a => a.id !== id));
  };

  const choisirImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const envoyer = async () => {
    if (!contenu.trim() && !imageFile) return;
    setEnvoi(true);
    let imageUrl = "";
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `annonces/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, imageFile);
      if (!upErr) {
        const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
        imageUrl = pub.publicUrl;
      }
    }
    const { data: { session } } = await supabase.auth.getSession();
    const { data: profil } = await supabase.from("profiles").select("nom,avatar_url").eq("id", session?.user.id).single();

    // Marquer comme vu AVANT l'insertion pour eviter la notif sur soi-meme
    if (session) {
      await supabase.from("annonces_vu").upsert({ user_id: session.user.id, derniere_visite: new Date(Date.now() + 5000).toISOString() });
    }
    window.dispatchEvent(new Event("annonces_vues"));

    await supabase.from("annonces").insert({
      contenu: contenu.trim(),
      image_url: imageUrl,
      auteur_nom: profil?.nom || "Admin",
      auteur_avatar: profil?.avatar_url || "",
    });
    setContenu(""); setImageFile(null); setImagePreview(""); setEnvoi(false);
    chargerAnnonces();
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + " a " + date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };



  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar active="/annonces" />
      <main className="flex-1 ml-64 flex flex-col h-screen">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">📢 Annonces</h1>
          <p className="text-sm text-gray-400">{isAdmin ? "Publie une annonce pour tous les membres" : "Les annonces de l'equipe Nezro Academy"}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {isAdmin && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              {!creationSondage ? (
                <button onClick={() => setCreationSondage(true)} className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-2">
                  📊 Creer un sondage
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <input value={questionSondage} onChange={e => setQuestionSondage(e.target.value)} placeholder="Ta question..." className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
                  {optionsSondage.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={opt} onChange={e => modifierOption(i, e.target.value)} placeholder={`Option ${i + 1}`} className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                      {optionsSondage.length > 2 && <button onClick={() => retirerOption(i)} className="text-gray-500 hover:text-red-400">✕</button>}
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                    <button onClick={ajouterOption} className="text-gray-400 hover:text-white text-xs font-semibold">+ Ajouter une option</button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={creerSondage} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Publier le sondage</button>
                    <button onClick={() => { setCreationSondage(false); setQuestionSondage(""); setOptionsSondage(["", ""]); }} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Annuler</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {[...annonces.map(a => ({ ...a, _type: "annonce" })), ...sondages.map(s => ({ ...s, _type: "sondage" }))]
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .map((item) => {
              if (item._type === "sondage") {
                const s = item;
                const votesSondage = votes.filter(v => v.sondage_id === s.id);
                const total = votesSondage.length;
                const monVote = votesSondage.find(v => v.user_id === userId);
                return (
                  <div key={"sondage-" + s.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 relative">
                    {isAdmin && (
                      <button onClick={() => supprimerSondage(s.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 text-sm transition-colors">🗑️</button>
                    )}
                    <p className="text-xs text-blue-400 font-semibold mb-2">📊 Sondage</p>
                    <p className="text-white font-semibold mb-4 pr-8">{s.question}</p>
                    <div className="flex flex-col gap-2">
                      {s.options.map((opt: string, i: number) => {
                        const count = votesSondage.filter((v: any) => v.option_index === i).length;
                        const pourcent = total > 0 ? Math.round((count / total) * 100) : 0;
                        const choisi = monVote?.option_index === i;
                        return (
                          <button key={i} onClick={() => voter(s.id, i)} className={`relative w-full text-left rounded-xl border overflow-hidden transition-colors ${choisi ? "border-blue-500" : "border-gray-700 hover:border-gray-600"}`}>
                            <div className="absolute inset-0 bg-blue-600/20" style={{ width: `${pourcent}%` }} />
                            <div className="relative flex items-center justify-between px-4 py-2.5">
                              <span className="text-sm text-white">{choisi ? "✓ " : ""}{opt}</span>
                              <span className="text-xs text-gray-400">{pourcent}% ({count})</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">{total} vote{total !== 1 ? "s" : ""}</p>
                  </div>
                );
              }
              const a = item;
              return (
                <div key={"annonce-" + a.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 relative">
                  {isAdmin && (
                    <button onClick={() => supprimer(a.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 text-sm transition-colors">🗑️</button>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {a.auteur_avatar ? <img src={a.auteur_avatar} className="w-9 h-9 object-cover rounded-full" alt="" /> : <span className="text-white text-sm font-bold">N</span>}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{a.auteur_nom} <span className="text-yellow-400 text-xs">👑 Admin</span></p>
                      <p className="text-xs text-gray-500">{formatDate(a.created_at)}</p>
                    </div>
                  </div>
                  {a.contenu && <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed mb-3">{a.contenu}</p>}
                  {a.image_url && <img src={a.image_url} className="rounded-xl max-h-96 w-auto mb-3" alt="" />}
                  <div className="flex items-center gap-2 mt-2">
                    {["❤️","🔥","👍","🎉"].map(emoji => {
                      const ceux = reactions.filter(r => r.annonce_id === a.id && r.emoji === emoji);
                      const jaiReagi = ceux.some(r => r.user_id === userId);
                      return (
                        <button key={emoji} onClick={() => toggleReaction(a.id, emoji)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${jaiReagi ? "bg-blue-600/20 border-blue-500 text-blue-400" : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"}`}>
                          <span>{emoji}</span>
                          {ceux.length > 0 && <span>{ceux.length}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {!loading && annonces.length === 0 && sondages.length === 0 && (
            <div className="text-center text-gray-500 mt-16">
              <p className="text-4xl mb-3">📢</p>
              <p>Aucune annonce pour le moment</p>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="p-4 border-t border-gray-800 relative">
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img src={imagePreview} className="h-24 rounded-lg" alt="" />
                <button onClick={() => { setImagePreview(""); setImageFile(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">✕</button>
              </div>
            )}
            {showEmojis && (
              <div className="absolute bottom-20 left-4 bg-gray-800 border border-gray-700 rounded-xl p-3 grid grid-cols-6 gap-2 shadow-2xl z-50">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => { setContenu(contenu + e); setShowEmojis(false); }} className="text-2xl hover:scale-125 transition-transform">{e}</button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input ref={fileRef} type="file" accept="image/*" onChange={choisirImage} className="hidden" />
              <button onClick={() => fileRef.current?.click()} className="text-gray-400 hover:text-white p-2 text-xl">📷</button>
              <button onClick={() => setShowEmojis(!showEmojis)} className="text-gray-400 hover:text-white p-2 text-xl">😀</button>
              <input
                value={contenu}
                onChange={e => setContenu(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); envoyer(); } }}
                placeholder="Ecris une annonce..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
              />
              <button onClick={envoyer} disabled={envoi || (!contenu.trim() && !imageFile)} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors">
                {envoi ? "..." : "Publier"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
