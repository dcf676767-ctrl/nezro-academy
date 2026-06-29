import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  
  const contents = messages.map((m: any) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: "Tu es l'assistant YMA (YouTube Money Academy). Tu aides les membres à progresser sur YouTube : montage vidéo, miniatures, algorithme, monétisation, growth hacking, TikTok, Instagram Reels. Tu réponds en français, de manière claire, pratique et motivante. Tu utilises des emojis. Tu donnes des conseils concrets et actionnables." }] },
        contents
      })
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas pu répondre.";
  return NextResponse.json({ content: [{ text }] });
}
