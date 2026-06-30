import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const MODELES_DE_SECOURS = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "deepseek/deepseek-chat-v3-0324:free",
    "qwen/qwen-2.5-72b-instruct:free",
    "mistralai/mistral-small-3.1-24b-instruct:free"
  ];

  for (const modele of MODELES_DE_SECOURS) {
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
          model: modele,
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

      if (data.choices?.[0]?.message?.content) {
        return NextResponse.json({ content: [{ text: data.choices[0].message.content }] });
      }

      console.error(`Modele ${modele} indisponible, on essaie le suivant:`, JSON.stringify(data));
    } catch (e) {
      console.error(`Erreur avec le modele ${modele}:`, e);
    }
  }

  return NextResponse.json({ content: [{ text: "Désolé, je n'ai pas pu répondre." }] });
}
