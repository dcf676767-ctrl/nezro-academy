import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nezro-academy.vercel.app",
        "X-Title": "Nezro Academy"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        stream: false,
        messages: [
          { role: "user", content: "Tu es l'assistant YMA. Réponds toujours en français avec des emojis et des conseils pratiques sur YouTube, montage, miniatures, algorithme." },
          { role: "assistant", content: "Compris ! Je suis l'assistant YMA, prêt à t'aider 🎯" },
          ...messages
        ]
      })
    });

    const text = await response.text();
    const data = JSON.parse(text);
    if (!data.choices) console.error("Réponse OpenRouter inattendue:", JSON.stringify(data));
    const reply = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu répondre.";
    return NextResponse.json({ content: [{ text: reply }] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ content: [{ text: "Erreur serveur." }] });
  }
}
