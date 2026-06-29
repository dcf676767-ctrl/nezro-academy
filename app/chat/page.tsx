"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const ADMIN_ID = "cc055cc7-0c49-44e4-a81b-bd3f7dc74f55";

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any>({});
  const [membres, setMembres] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newMsg, setNewMsg] = useState("");
  const [moiId, setMoiId] = useState("");
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isAdmin = moiId === ADMIN_ID;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.replace("/auth"); return; }
      const uid = session.user.id;
      setMoiId(uid);
      supabase.from("profiles").select("*").then(({ data }) => {
        const map: any = {};
        (data || []).forEach((x: any) => map[x.id] = x);
        setProfiles(map);
        const autres = (data || []).filter((x: any) => x.id !== uid);
        setMembres(autres);
        if (uid !== ADMIN_ID) {
          const admin = (data || []).find((x: any) => x.id === ADMIN_ID);
          if (admin) setSelectedUser(admin);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!moiId || !selectedUser) return;
    const otherId = selectedUser.id;
    supabase.from("messages")
      .select("*")
      .or(`and(sender_id.eq.${moiId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${moiId})`)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data || []));

    const channel = supabase.channel(`chat-${moiId}-${otherId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const m = payload.new as any;
        if ((m.sender_id === moiId && m.receiver_id === otherId) || (m.sender_id === otherId && m.receiver_id === moiId)) {
          setMessages(prev => [...prev, m]);
        }
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [moiId, selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const envoyer = async () => {
    if (!newMsg.trim() || !selectedUser) return;
    await supabase.from("messages").insert({ sender_id: moiId, receiver_id: selectedUser.id, content: newMsg.trim() });
    setNewMsg("");
  };

  const envoyerPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUser) return;
    setUploading(true);
    const path = `chat/${Date.now()}-${file.name}`;
    await supabase.storage.from("chat-images").upload(path, file);
    const { data } = supabase.storage.from("chat-images").getPublicUrl(path);
    await supabase.from("messages").insert({ sender_id: moiId, receiver_id: selectedUser.id, content: "", image_url: data.publicUrl });
    setUploading(false);
  };

  const formatHeure = (ts: string) => new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar active="/chat" />
      <main className="flex-1 ml-64 flex h-screen overflow-hidden">
        {isAdmin && (
          <div className="w-72 border-r border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <h2 className="font-bold text-white">💬 Conversations</h2>
              <p className="text-xs text-gray-400 mt-1">{membres.length} membres</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {membres.map(m => (
                <button key={m.id} onClick={() => setSelectedUser(m)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-all text-left ${selectedUser?.id === m.id ? "bg-gray-800 border-l-2 border-blue-500" : ""}`}>
                  <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center font-bold shrink-0 overflow-hidden">
                    {m.avatar_url ? <img src={m.avatar_url} className="w-full h-full object-cover" /> : m.nom?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{m.nom || "Sans nom"}</p>
                    <p className="text-gray-400 text-xs">{m.role || "Membre"}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center font-bold overflow-hidden">
                  {selectedUser.avatar_url ? <img src={selectedUser.avatar_url} className="w-full h-full object-cover" /> : selectedUser.nom?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-bold text-white">{selectedUser.nom || "Sans nom"}</p>
                  <p className="text-xs text-gray-400">{selectedUser.id === ADMIN_ID ? "👑 Admin" : "Membre"}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                {messages.length === 0 && (
                  <div className="text-center py-16 text-gray-500">
                    <p className="text-4xl mb-3">💬</p>
                    <p>Aucun message pour l'instant</p>
                    <p className="text-sm mt-1">Dis bonjour !</p>
                  </div>
                )}
                {messages.map((msg, i) => {
                  const isMe = msg.sender_id === moiId;
                  return (
                    <div key={msg.id || i} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                      <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                        {profiles[msg.sender_id]?.avatar_url ? <img src={profiles[msg.sender_id].avatar_url} className="w-full h-full object-cover" /> : profiles[msg.sender_id]?.nom?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className={`max-w-sm flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                        {msg.image_url ? (
                          <img src={msg.image_url} className="max-w-xs rounded-2xl border border-gray-700 cursor-pointer" onClick={() => window.open(msg.image_url)} />
                        ) : (
                          <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-blue-600 rounded-br-sm" : "bg-gray-800 rounded-bl-sm"}`}>
                            {msg.content}
                          </div>
                        )}
                        <span className="text-xs text-gray-600">{formatHeure(msg.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <div className="border-t border-gray-800 px-6 py-4 flex gap-3 items-center">
                <button onClick={() => fileRef.current?.click()} className="text-gray-400 hover:text-white transition-all text-xl">📷</button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={envoyerPhoto} />
                <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && envoyer()}
                  placeholder={uploading ? "Upload en cours..." : "Écris un message..."}
                  disabled={uploading}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" />
                <button onClick={envoyer} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition-all">➤</button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-5xl mb-4">💬</p>
                <p className="font-semibold">Sélectionne un membre</p>
                <p className="text-sm mt-1">pour démarrer une conversation</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
