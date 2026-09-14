"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";

const _sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const ADMIN_ID = "cc055cc7-0c49-44e4-a81b-bd3f7dc74f55";

export default function Communaute() {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any>({});
  const [newMsg, setNewMsg] = useState("");
  const [moiId, setMoiId] = useState("");
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    _sb.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push("/auth"); return; }
      _sb.from("profiles").select("statut").eq("id", session.user.id).single().then(({ data }) => {
        if (!data || data.statut !== "accepte") router.push("/bloque");
      });
      setMoiId(session.user.id);
      chargerMessages();
    });

    const sub = _sb.channel("community-realtime-" + Math.random())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "community_messages" }, () => {
        chargerMessages();
      }).subscribe();
    return () => { _sb.removeChannel(sub); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chargerMessages = async () => {
    const { data } = await _sb.from("community_messages").select("*").order("created_at", { ascending: true }).limit(100);
    if (data) {
      setMessages(data);
      const ids = [...new Set(data.map((m: any) => m.user_id))];
      if (ids.length > 0) {
        const { data: profs } = await _sb.from("profiles").select("id, nom, avatar_url").in("id", ids);
        if (profs) {
          const map: any = {};
          profs.forEach((p: any) => map[p.id] = p);
          setProfiles(map);
        }
      }
    }
  };

  const envoyer = async () => {
    if (!newMsg.trim()) return;
    const msg = { user_id: moiId, content: newMsg.trim(), image_url: null, created_at: new Date().toISOString(), id: Math.random().toString() };
    setMessages(prev => [...prev, msg]);
    setNewMsg("");
    await _sb.from("community_messages").insert({ user_id: moiId, content: msg.content });
  };

  const envoyerPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `community/${Date.now()}-${file.name}`;
    await _sb.storage.from("chat-images").upload(path, file);
    const { data } = _sb.storage.from("chat-images").getPublicUrl(path);
    await _sb.from("community_messages").insert({ user_id: moiId, content: "", image_url: data.publicUrl });
    setUploading(false);
  };

  const supprimerMessage = async (id: string) => {
    await _sb.from("community_messages").delete().eq("id", id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const formatHeure = (ts: string) => new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-gray-950 text-white flex" style={{height:"100svh", overflow:"hidden"}}>
      <Sidebar active="communaute" />
      <main className="flex-1 md:ml-64 flex flex-col overflow-hidden" style={{height:"100svh", paddingBottom:"env(safe-area-inset-bottom)"}}>
        <div className="border-b border-gray-800 px-4 py-4 pt-16 md:pt-4 flex items-center gap-3">
          <div className="text-2xl">👥</div>
          <div>
            <p className="font-bold text-white">Chat Communauté</p>
            <p className="text-xs text-gray-400">Tous les membres</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {messages.map((msg) => {
            const isMe = msg.user_id === moiId;
            const prof = profiles[msg.user_id];
            return (
              <div key={msg.id} className="flex gap-3 items-start w-full">
                <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                  {prof?.avatar_url ? <img src={prof.avatar_url} className="w-full h-full object-cover" /> : prof?.nom?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isMe ? "text-blue-400" : "text-white"}`}>{prof?.nom || "Membre"}</span>
                    <span className="text-xs text-gray-500">{formatHeure(msg.created_at)}</span>
                  </div>
                  {msg.image_url ? (
                    <img src={msg.image_url} className="max-w-sm rounded-2xl border border-gray-700 cursor-pointer" onClick={() => window.open(msg.image_url)} />
                  ) : (
                    <p className="text-gray-200 text-sm">{msg.content}</p>
                  )}
                  {moiId === ADMIN_ID && (
                    <button onClick={() => supprimerMessage(msg.id)} className="text-xs text-red-500 hover:text-red-400 mt-1">🗑 Supprimer</button>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-gray-800 px-4 py-3 flex gap-2 items-center">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={envoyerPhoto} />
          <button onClick={() => fileRef.current?.click()} className="text-gray-400 hover:text-white text-xl shrink-0">📷</button>
          <input
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => e.key === "Enter" && envoyer()}
            placeholder={uploading ? "Upload en cours..." : "Écris un message..."}
            disabled={uploading}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
            style={{fontSize:"16px"}}
          />
          <button onClick={envoyer} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-3 font-bold shrink-0">➤</button>
        </div>
      </main>
    </div>
  );
}
