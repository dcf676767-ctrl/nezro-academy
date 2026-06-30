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

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/auth"); return; }
      const { data } = await supabase.from("profiles").select("email").eq("id", session.user.id).single();
      setIsAdmin(data?.email === "dcf676767@gmail.com");
      chargerAnnonces();

      const sub = supabase.channel("annonces-realtime")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "annonces" }, () => {
          chargerAnnonces();
        }).subscribe();
      return () => { supabase.removeChannel(sub); };
    });
  }, []);

  const chargerAnnonces = async () => {
    const { data } = await supabase.from("annonces").select("*").order("created_at", { ascending: false });
    if (data) setAnnonces(data);
    setLoading(false);
    localStorage.setItem("dernier_vu_annonces", new Date().toISOString());
    window.dispatchEvent(new Event("annonces_vues"));
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

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Chargement...</div>;

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar active="/annonces" />
      <main className="flex-1 ml-64 flex flex-col h-screen">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">📢 Annonces</h1>
          <p className="text-sm text-gray-400">{isAdmin ? "Publie une annonce pour tous les membres" : "Les annonces de l'equipe Nezro Academy"}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {annonces.length === 0 && (
            <div className="text-center text-gray-500 mt-16">
              <p className="text-4xl mb-3">📢</p>
              <p>Aucune annonce pour le moment</p>
            </div>
          )}
          {annonces.map((a) => (
            <div key={a.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
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
              {a.image_url && <img src={a.image_url} className="rounded-xl max-h-96 w-auto" alt="" />}
            </div>
          ))}
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
