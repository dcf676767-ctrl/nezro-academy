"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
const jours = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const mois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
export default function Calendrier() {
  const aujourd_hui = new Date();
  const [moisActuel, setMoisActuel] = useState(aujourd_hui.getMonth());
  const [annee, setAnnee] = useState(aujourd_hui.getFullYear());
  const premierJour = new Date(annee, moisActuel, 1).getDay();
  const decalage = premierJour === 0 ? 6 : premierJour - 1;
  const nbJours = new Date(annee, moisActuel + 1, 0).getDate();
  const cases = Array(decalage).fill(null).concat(Array.from({length: nbJours}, (_,i) => i+1));
  const precedent = () => { if (moisActuel === 0) { setMoisActuel(11); setAnnee(a => a-1); } else setMoisActuel(m => m-1); };
  const suivant = () => { if (moisActuel === 11) { setMoisActuel(0); setAnnee(a => a+1); } else setMoisActuel(m => m+1); };
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar active="/calendrier" />
      <main className="flex-1 ml-64 p-8">
        <h2 className="text-5xl font-bold text-white mb-2 text-center">📅 Calendrier</h2>
        <p className="text-gray-400 mb-8 text-center">Les événements de la communauté</p>
        <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={precedent} className="text-gray-400 hover:text-white px-3 py-1 rounded-lg hover:bg-gray-800">←</button>
            <h3 className="text-xl font-bold text-white">{mois[moisActuel]} {annee}</h3>
            <button onClick={suivant} className="text-gray-400 hover:text-white px-3 py-1 rounded-lg hover:bg-gray-800">→</button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {jours.map(j => <div key={j} className="text-center text-xs text-gray-500 font-semibold py-2">{j}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cases.map((jour, i) => (
              <div key={i} className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                jour === null ? "" :
                jour === aujourd_hui.getDate() && moisActuel === aujourd_hui.getMonth() && annee === aujourd_hui.getFullYear()
                  ? "bg-blue-600 text-white font-bold"
                  : "text-gray-300 hover:bg-gray-800 cursor-pointer"
              }`}>
                {jour}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
