"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Bienvenue() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 2200);
    const t3 = setTimeout(() => setStep(3), 3600);
    const t4 = setTimeout(() => setStep(4), 5000);
    const t5 = setTimeout(() => router.push("/programme"), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Fond animé */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay:"0.5s"}} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-800/10 rounded-full blur-2xl animate-pulse" style={{animationDelay:"1s"}} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
        {/* Logo */}
        <div className={`transition-all duration-700 ${step >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
          <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-5xl font-black shadow-[0_0_40px_rgba(59,130,246,0.6)] mb-2">
            N
          </div>
        </div>

        {/* Titre */}
        <div className={`transition-all duration-700 ${step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h1 className="text-4xl font-black mb-2">Bienvenue dans</h1>
          <h2 className="text-4xl font-black text-blue-400">Nezro Academy 🎯</h2>
        </div>

        {/* Message */}
        <div className={`transition-all duration-700 ${step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-gray-300 text-lg max-w-sm leading-relaxed">
            Tu fais maintenant partie de l'élite YouTube 🚀<br/>
            <span className="text-blue-400 font-semibold">Prêt à exploser sur YouTube ?</span>
          </p>
        </div>

        {/* Bouton */}
        <div className={`transition-all duration-700 ${step >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <button
            onClick={() => router.push("/programme")}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            Accéder à l'académie 🎬
          </button>
          <p className="text-gray-600 text-sm mt-3">Redirection automatique dans quelques secondes...</p>
        </div>
      </div>
    </div>
  );
}
