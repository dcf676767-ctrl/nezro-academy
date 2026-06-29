"use client";
import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";

export default function Chat() {
  const [messages, setMessages] = useState<{role:string,content:string}[]>([
    {role:"assistant",content:"Salut ! Je suis ton assistant YMA 🎯 Je suis là pour t'aider avec YouTube, le montage, les miniatures, l'algo... Pose-moi n'importe quelle question !"}
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: "Tu es un assistant expert en YouTube, création de contenu, montage vidéo, miniatures, algorithme YouTube, monétisation et growth. Tu réponds en français, de manière concise et actionnable. Tu fais partie de la Nezro Academy - YouTube Money Academy.",
          messages: [...messages, userMsg].filter(m => m.role !== "assistant" || messages.indexOf(m) > 0).map(m => ({role:m.role,content:m.content}))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Désolé, je n'ai pas pu répondre.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Erreur de connexion, réessaie !" }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar active="/chat" />
      <main className="flex-1 ml-64 flex flex-col h-screen">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">💬 Assistant YMA</h2>
          <p className="text-gray-400 text-sm mt-1">Ton coach IA pour tout ce qui est YouTube & contenu</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role==="user"?"justify-end":""}`}>
              {m.role==="assistant" && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">AI</div>
              )}
              <div className={`max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.role==="user"
                  ? "bg-blue-600 text-white rounded-tr-sm"
                  : "bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-sm"
              }`}>
                {m.content}
              </div>
              {m.role==="user" && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 text-sm font-bold">Toi</div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">AI</div>
              <div className="bg-gray-900 border border-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"0ms"}} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"300ms"}} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && !e.shiftKey && send()}
              placeholder="Pose ta question sur YouTube, le montage, les miniatures..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button onClick={send} disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-bold transition-all">
              ➤
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
