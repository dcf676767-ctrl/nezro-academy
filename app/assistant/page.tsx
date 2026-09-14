"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";


declare global {
}

const MESSAGE_INITIAL = { role: "assistant" as const, content: "Salut ! Je suis ton assistant YouTube 🎯 Je suis là pour t'aider avec le montage, les miniatures, l'algo... Pose-moi n'importe quelle question !" };

export default function Assistant() {
  const [messages, setMessages] = useState<{role:"user"|"assistant", content:string}[]>([MESSAGE_INITIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pret, setPret] = useState(false);
  const [userId, setUserId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chargerPourUtilisateur = (id: string) => {
      setUserId(id);
      const saved = sessionStorage.getItem("assistant_messages_" + id);
      if (saved) {
        try { setMessages(JSON.parse(saved)); } catch { setMessages([MESSAGE_INITIAL]); }
      } else {
        setMessages([MESSAGE_INITIAL]);
      }
      setPret(true);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      chargerPourUtilisateur(session?.user.id || "anonyme");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      chargerPourUtilisateur(session?.user.id || "anonyme");
    });

    return () => { listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (pret && userId) sessionStorage.setItem("assistant_messages_" + userId, JSON.stringify(messages));
  }, [messages, pret, userId]);

  const envoyer = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user" as const, content: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Desole, je n'ai pas pu repondre.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Erreur de connexion. Reessaie !" }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <main className="flex-1 md:ml-64 flex flex-col h-screen pt-14 md:pt-0 module-enter-page">
        <div className="border-b border-gray-800 px-8 py-4 pl-16 md:pl-8 flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h1 className="font-bold text-lg">Assistant YouTube</h1>
            <p className="text-xs text-gray-400">Ton coach IA pour tout ce qui est YouTube</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${msg.role === "assistant" ? "bg-blue-600" : "bg-gray-700"}`}>
                {msg.role === "assistant" ? "AI" : "Toi"}
              </div>
              <div className={`max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "assistant" ? "bg-gray-800 text-white rounded-bl-sm" : "bg-blue-600 text-white rounded-br-sm"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">AI</div>
              <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"0ms"}}/>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}}/>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"300ms"}}/>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-gray-800 px-8 py-4 flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && envoyer()}
            placeholder="Pose ta question sur YouTube, le montage, les miniatures..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" />
          <button onClick={envoyer} disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-all">
            ➤
          </button>
        </div>
      </main>
    </div>
  );
}
