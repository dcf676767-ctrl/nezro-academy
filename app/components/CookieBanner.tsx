"use client";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookies_accepted");
    if (!accepted) setVisible(true);
  }, []);

  const accepter = () => {
    localStorage.setItem("cookies_accepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <p className="text-gray-300 text-sm leading-relaxed">
          🍪 Nezro Academy utilise uniquement des cookies techniques nécessaires au fonctionnement de l'authentification. Aucun cookie publicitaire ou de tracking n'est utilisé.{" "}
          <a href="/legal/confidentialite" className="text-blue-400 hover:underline">En savoir plus</a>
        </p>
        <button onClick={accepter}
          className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all">
          J'ai compris
        </button>
      </div>
    </div>
  );
}
