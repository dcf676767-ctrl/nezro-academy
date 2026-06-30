"use client";
import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Sidebar from "../components/Sidebar";

declare global {
  interface Window { puter: any; }
}

const MESSAGE_INITIAL = { role: "assistant" as const, content: "Salut ! Je suis ton assistant YMA 🎯 Je suis là pour t'aider avec YouTube, le montage, les miniatures, l'algo... Pose-moi n'importe quelle question !" };

export default function Assistant() {
  const [messages, setMessages] = useState<{role:"user"|"assistant", content:string}[]>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("assistant_messages");
      if (saved) {
        try { return JSON.parse(saved); } catch { return [MESSAGE_INITIAL]; }
      }
    }
    return [MESSAGE_INITIAL];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    sessionStorage.setItem("assistant_messages", JSON.stringify(messages));
  }, [messages]);

  const envoyer = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const historique = [...messages, { role: "user", content: userMsg }].map(m => ({ role: m.role, content: m.content }));
      const response = await window.puter.ai.chat(
        [
          { role: "system", content: "Tu es l'assistant YMA. Réponds toujours en français avec des emojis et des conseils pratiques sur YouTube, montage, miniatures, algorithme." },
          ...historique
        ],
        { model: "meta-llama/llama-4-maverick" }
      );
      const reply = response?.message?.content || "Désolé, je n'ai pas pu répondre.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "❌ Erreur de connexion. Réessaie !" }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />
      <Sidebar active="/assistant" />
      <main className="flex-1 ml-64 flex flex-col h-screen">
        <div className="border-b border-gray-800 px-8 py-4 flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h1 className="font-bold text-lg">Assistant YMA</h1>
            <p className="text-xs text-gray-400">Ton coach IA pour tout ce qui est YouTube & contenu</p>
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
