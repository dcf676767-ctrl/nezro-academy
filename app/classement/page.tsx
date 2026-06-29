"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const TOTAL_CHAPITRES = 19;
export default function Classement() {
  const [classement, setClassement] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => {
      const { data: profiles } = await supabase.from("profiles").select("id,nom,avatar_url").eq("statut","accepte");
      if (!profiles) return;
      const { data: prog } = await supabase.from("progression").select("user_id").eq("completed",true);
      if (!prog) return;
      const scores = profiles.map(p => ({
        ...p,
        completed: prog.filter((x:any) => x.user_id === p.id).length,
        pct: Math.round((prog.filter((x:any) => x.user_id === p.id).length / TOTAL_CHAPITRES) * 100)
      })).sort((a,b) => b.pct - a.pct);
      setClassement(scores);
    };
    load();
  }, []);
  const medals = ["🥇","🥈","🥉"];
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar active="/classement" />
      <main className="flex-1 ml-64 p-8">
        <h2 className="text-3xl font-bold text-white mb-1">🏆 Classement</h2>
        <p className="text-gray-400 mb-8">Les membres les plus avancés</p>
        <div className="flex flex-col gap-3 max-w-2xl">
          {classement.map((m,i) => (
            <div key={m.id} className={`flex items-center gap-4 bg-gray-900 border rounded-2xl p-4 transition-all ${i===0?"border-yellow-500":i===1?"border-gray-400":i===2?"border-orange-400":"border-gray-800"}`}>
              <span className="text-2xl w-8 text-center">{medals[i]||`${i+1}`}</span>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                {m.avatar_url ? <img src={m.avatar_url} className="w-10 h-10 object-cover rounded-full" alt="avatar" /> : <span className="text-white font-bold">{m.nom?.[0]?.toUpperCase()||"?"}</span>}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white mb-1">{m.nom||"Membre"}</p>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{width:`${m.pct}%`}} />
                </div>
              </div>
              <div className="text-blue-400 font-bold text-lg">{m.pct}%</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
