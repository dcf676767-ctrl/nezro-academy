import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Tu es l'assistant YouTube de Nezro Academy. Reponds toujours en français avec des emojis et des conseils pratiques sur YouTube, montage, miniatures, algorithme, monetisation." },
          ...messages
        ],
        max_tokens: 1024,
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Desole, je n'ai pas pu repondre.";
    return NextResponse.json({ content: [{ text: reply }] });
  } catch (e) {
    return NextResponse.json({ content: [{ text: "Erreur de connexion. Reessaie !" }] });
  }
}
