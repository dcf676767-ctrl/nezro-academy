import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Nezro Academy"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [
          { role: "system", content: "Tu es l'assistant YMA. Tu aides sur YouTube en français avec des emojis." },
          ...messages.map((m: any) => ({ role: m.role, content: m.content }))
        ]
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu répondre.";
    return NextResponse.json({ content: [{ text }] });
  } catch(e) {
    return NextResponse.json({ content: [{ text: "Erreur: " + String(e) }] });
  }
}
