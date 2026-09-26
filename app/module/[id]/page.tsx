"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

const modulesData: {[key:number]:{titre:string;chapitres:{id:number;titre:string;duree:string;videoId:string;description:string;lien?:string;lienlabel?:string;liens?:{label:string;url:string}[]}[]}} = {
  8:{titre:"Niche GTA 6",chapitres:[
    {id:1,titre:"Niche GTA 6",duree:"-",videoId:"",description:"Contenu secret en cours de préparation..."},
  ]},
  18:{titre:"Outils pour faire plus d'argent et être plus productif",chapitres:[
    {id:1,titre:"Outils pour faire plus d'argent et être plus productif",duree:"-",videoId:"",description:"",liens:[
      {label:"SnapTik - Télécharger vidéos TikTok",url:"https://snaptik.app/en2"},
      {label:"SSS Instagram - Télécharger vidéos Instagram",url:"https://sssinstagram.com/fr"},
      {label:"YTDown - Télécharger vidéos YouTube",url:"https://app.ytdown.to/en27/"},
      {label:"YouTube to Transcript",url:"https://youtubetotranscript.com"},
      {label:"Saveto AI - TikTok Transcript",url:"https://saveto.ai/tiktok-transcript-generator/"},
      {label:"Repurpose.io",url:"https://repurpose.io/?fpr=545571"},
      {label:"VidIQ - Extension YouTube",url:"https://vidiq.com/fr/extension/"},
    ]},
  ]},
  10:{titre:"Introduction",chapitres:[
    {id:1,titre:"Introduction",duree:"5min28",videoId:"CiEdH9O2g0o",description:"BIENVENUE DANS LE PROGRAMME !"},
  ]},
  11:{titre:"Mind-set et organisation",chapitres:[
    {id:1,titre:"Organisation et planification",duree:"2min06",videoId:"jDOyduSjKCU",description:"<strong style=\"font-size:1.1rem\">ORGANISATION:</strong>\n\n- FAIRE UNE TO-DO LISTE TOUS LES SOIRS\n\n- QUAND TU FAIS TA VIDÉO, METS UN TIMER DE 15-20MIN (ÇA CRÉER DU SENTIMENT D'URGENCE)\n\n- ESSAYER DE FAIRE LES VIDÉOS PENDANT LE WEEK END POUR LES POSTER DURANT LA SEMAINE (BEAUCOUP PLUS PRODUCTIF)\n\n- PROGRAMMER LES VIDÉOS (EXPLIQUÉ DANS LA SUITE DU PROGRAMME)"},
    {id:2,titre:"Mind set",duree:"1min20",videoId:"GddLPbqCu4o",description:"JAMAIS ABANDONNER !"},
  ]},
  12:{titre:"Comprendre les réseaux et comment être monétisé",chapitres:[
    {id:1,titre:"Les bases",duree:"3min05",videoId:"sWJpgbE0xz4",description:"<strong style=\"font-size:1.1rem\">À retenir :</strong>\n\nL'algorithme est un robot. Son but, c'est de faire rester les gens le plus longtemps possible sur l'application. Donc il ne pousse une vidéo que si elle est intéressante — et il juge ça avec 3 critères :\n\n• Watch Time (temps de visionnage total)\n• Stay to Watch (rétention, est-ce qu'on reste jusqu'à la fin)\n• Commentaires (engagement)\n\n→ Si ta vidéo n'est pas intéressante selon ces critères, l'algorithme n'a aucun intérêt à la faire pousser. Si elle l'est, même en partant de 200-300 vues, il peut te placer comme un compte \"élite\"."},
    {id:3,titre:"Critères de monétisation",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:4,titre:"10 niches pour monter à 10K abonnés sur TikTok",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},
  13:{titre:"Contenu 100% anonyme",chapitres:[
    {id:1,titre:"Contenu anonyme, c'est quoi ?",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:2,titre:"Exemple de contenu anonyme",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:3,titre:"Faire du contenu sans tête et sans voix de qualité",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:4,titre:"Voix off anonyme sur TikTok",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:5,titre:"Voix off facile sur CapCut",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:6,titre:"Faire du contenu Allemand, Espagnol, Italien",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:7,titre:"Contenu étranger avec CapCut",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:8,titre:"Avoir une bonne voix off IA",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:9,titre:"Retirer les sous-titres d'une vidéo",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},
  14:{titre:"Trouver sa niche, être efficace et monétiser",chapitres:[
    {id:1,titre:"Trouver TA niche",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:2,titre:"Que faire quand tu as trouvé ta niche ?",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:6,titre:"Comment s'inspirer des autres ?",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:7,titre:"Faire du contenu grâce aux autres",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:8,titre:"Trouver des idées avec l'IA",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:3,titre:"Branding et identité du compte",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:4,titre:"Conseils pour être viral sans effort",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:5,titre:"Faire de l'argent avec les collaborations/affiliations",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},
  15:{titre:"30 exemples de niches à faire",chapitres:[
    {id:1,titre:"30 exemples de niches à faire",duree:"-",videoId:"",description:"<strong style='font-size:1.4em;display:block;margin-bottom:8px;'>Niche avec peu de concurrence à faire :</strong><br/><br/><strong>1. Technologie (Apple, Samsung)</strong><br/><strong>2. Voyages</strong><br/><strong>3. Immobilier</strong><br/><strong>4. Le droit</strong><br/><strong>5. Éducation</strong><br/><strong>6. Covering / moto / réparation moto</strong><br/><strong>7. Cuisine / dégustation (réaction du contenu US / Espagnol)</strong><br/><strong>8. Chaussures de mode</strong><br/><strong>9. Sport peu connu / lutte / judo / basket / tennis</strong><br/><strong>10. Les dinosaures</strong><br/><strong>11. Le gaming (GTA 6 bientôt)</strong><br/><strong>12. Histoire (humanité, seconde guerre mondiale)</strong><br/><strong>13. La coiffure</strong><br/><strong>14. Musique</strong><br/><strong>15. Bateau</strong><br/><strong>16. Armée</strong><br/><strong>17. Innovation</strong><br/><strong>18. Accident (route, incendie, inondations)</strong><br/><strong>19. Animaux (comparaison des animaux sous format réaction)</strong><br/><strong>20. Salaire (footballeur, acteur, combattant)</strong><br/><strong>21. Crime</strong><br/><strong>22. Les transports</strong><br/><strong>23. Séduction / drague</strong><br/><strong>24. Les métiers (docteur, chirurgien)</strong><br/><strong>25. Les pays</strong><br/><strong>26. Autour d\'un style de musique (parler des artistes, des sons)</strong><br/><strong>27. Les prisons</strong><br/><strong>28. La loi</strong><br/><strong>29. L\'actualité</strong><br/><strong>30. Les boissons (Coca, Monster)</strong><br/><strong>31. Décoration d\'intérieur</strong>"},
  ]},
  16:{titre:"Exemple de montage sur CapCut",chapitres:[
    {id:1,titre:"Exemple de montage sur CapCut",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},
  23:{titre:"Présentation du montage CapCut sur PC",chapitres:[
    {id:1,titre:"Présentation du montage CapCut sur PC",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},
  17:{titre:"Commencer à poster",chapitres:[
    {id:1,titre:"Chauffer son compte",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:2,titre:"Importation des vidéos sur YouTube et tous les réseaux",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:3,titre:"Outils importation automatique",duree:"-",videoId:"",description:"",liens:[
      {label:"Repurpose.io",url:"https://repurpose.io/?fpr=545571"},
    ]},
  ]},
  25:{titre:"Analyser pourquoi une vidéo a percé",chapitres:[
    {id:1,titre:"Analyser le Stayed to Watch et la rétention d'audience sur YouTube",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:2,titre:"Analyser la rétention sur TikTok",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:3,titre:"Savoir en avance si une vidéo va percer ou pas",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},

  19:{titre:"Problèmes de monétisation",chapitres:[
    {id:1,titre:"Rester monétisé sur TikTok et YouTube",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:2,titre:"Contestation à mettre",duree:"-",videoId:"",description:"Voici la contestation à envoyer sur YouTube, TikTok et Facebook pour avoir encore une chance d'être monétisé :<br/><br/><strong>\"Je ne comprends pas pourquoi mon compte a été refusé pour le programme de rémunération. Mon compte respecte toutes vos règles. Pouvez-vous réexaminer votre décision ? Je trouve cette disqualification injustifiée.\"</strong>"},
    {id:3,titre:"Récupérer un compte banni / une vidéo bannie",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},
  20:{titre:"Augmenter son RPM",chapitres:[
    {id:1,titre:"Comment augmenter son RPM sur les réseaux ?",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},
  21:{titre:"Astuces",chapitres:[
    {id:1,titre:"Créer des e-mails facilement en illimité",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:2,titre:"Outils pour analyser les concurrents",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:3,titre:"Faire une vidéo dans n'importe quelle langue en 5 minutes",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:4,titre:"Améliorer l'accroche et le hook",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:5,titre:"Heure / hashtags pour poster",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:6,titre:"Programmer ses vidéos",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:7,titre:"Que faire si la vidéo a du potentiel mais qu'elle ne perce pas ?",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:8,titre:"Reposter une ancienne vidéo de 3 mois",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},
  22:{titre:"Déclaration et compte AdSense",chapitres:[
    {id:1,titre:"Déclaration et compte AdSense",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:2,titre:"Retirer l'argent",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},
  24:{titre:"Bien maîtriser sa chaîne YouTube",chapitres:[
    {id:1,titre:"Personnaliser sa chaîne YouTube",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:2,titre:"IA qui peut t'aider à devenir viral sur YouTube Studio",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:3,titre:"Créer des posts spéciaux pour faire une communauté sur YouTube",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},
  1:{titre:"Niche Roblox",chapitres:[
    {id:1,titre:"Introduction",duree:"1min",videoId:"_3JxXTY34mM",description:"Programme Exclusive : La Niche YouTube qui m'a Rapporté +5000€ et 10 Millions de Vues\n\n📚 Ce que contient ce programme :\n\n✅ La Niche Révélée : Ma niche secrète qui génère des millions de vues\n✅ Montage Viral : Les techniques exactes de montage pour maximiser la rétention (durée optimale, rythme, hooks)\n✅ Intelligence Artificielle : Comment j'utilise l'IA pour produire du contenu de qualité en un temps record\n✅ YouTube Studio Décrypté : Tous les réglages et astuces pour monétiser et optimiser vos vidéos comme un pro\n✅ Importation 4K + TikTok : La méthode pour exporter en 4K sur YouTube ET recycler sur TikTok pour multiplier votre trafic\n✅ Astuces Avancées : Mes secrets sur la monétisation, l'algorithme YouTube, et les pièges à éviter absolument"},
    {id:2,titre:"Clips Roblox",duree:"3min",videoId:"lUCpFxP9NSo",description:"Comment trouver les meilleurs clips Roblox.",lien:"https://www.roblox.com/share?code=2e18c279d8ce9e4dadb9cace848fbff3&type=ExperienceDetails&stamp=1783802571761",lienlabel:"🎮 LIEN DU JEU"},
    {id:3,titre:"Montage",duree:"15min",videoId:"9jG1_0eL1aU",description:"Les bases du montage vidéo."},
    {id:4,titre:"IA",duree:"10min",videoId:"yS_9RaC-hBc",description:"Utilise l'IA pour tes miniatures."},
    {id:5,titre:"Importation sur Tiktok et Youtube",duree:"5min",videoId:"FiLeCdNQHZw",description:"Comment publier sur YouTube."},
    {id:6,titre:"Astuces",duree:"2min",videoId:"tdnIDErJaqo",description:"Mes astuces miniatures."},
    {id:7,titre:"Conseils",duree:"5min28",videoId:"DZuGYMerKRI",description:"Comment rester consistant."},
  ]},
};

export default function Module() {
  const params = useParams();
  const moduleId = Number(params.id);
  const moduleData = modulesData[moduleId];
  const [completed, setCompleted] = useState<number[]>([]);
  const [userId, setUserId] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [chapitreActif, setChapitreActif] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.replace("/auth"); return; }
      setAuthChecked(true);
      setUserId(session.user.id);
      supabase.from("progression").select("chapitre_id").eq("user_id",session.user.id).eq("module_id",moduleId).eq("completed",true).then(({ data }) => {
        if (data) setCompleted(data.map((p:any) => p.chapitre_id));
      });
    });
  }, []);

  const [animKey, setAnimKey] = useState(0);
  const chapitre = moduleData?.chapitres[chapitreActif];



  const toggleCompleted = async (chapId: number) => {
    if (completed.includes(chapId)) {
      await supabase.from("progression").delete().eq("user_id",userId).eq("module_id",moduleId).eq("chapitre_id",chapId);
      setCompleted(prev => prev.filter(id => id !== chapId));
    } else {
      await supabase.from("progression").upsert({user_id:userId,module_id:moduleId,chapitre_id:chapId,completed:true});
      setCompleted(prev => [...prev, chapId]);
    }
  };

  const suivant = async () => {
    if (!moduleData) return;
    const chap = moduleData.chapitres[chapitreActif];
    if (!completed.includes(chap.id)) {
      await supabase.from("progression").upsert({user_id:userId,module_id:moduleId,chapitre_id:chap.id,completed:true});
      setCompleted(prev => [...prev, chap.id]);
    }
    if (chapitreActif < moduleData.chapitres.length - 1) { setChapitreActif(chapitreActif+1); setAnimKey(k => k + 1); }
    else { window.location.href="/programme#module-"+moduleId; }
  };

  if (!moduleData || !chapitre) {
    if (typeof window !== "undefined") window.location.replace("/programme");
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Redirection...</div>;
  }
  const progression = Math.round((completed.length/moduleData.chapitres.length)*100);
  const estDernier = chapitreActif === moduleData.chapitres.length-1;

  if (!authChecked) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><div className="text-white text-sm">Chargement...</div></div>;

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <main className="flex-1 md:ml-64 p-8 pt-20 md:pt-8 module-enter-page">
        <button onClick={() => window.location.href="/programme#module-"+moduleId} className="text-sm text-gray-400 hover:text-white mb-6 flex items-center gap-1 transition-colors">← Retour au programme</button>
        <h1 className="text-2xl font-bold text-white mb-2">{moduleData.titre}</h1>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 bg-gray-800 rounded-full h-2">
            <div className="h-2 rounded-full transition-all" style={{width:`${progression}%`, background:progression===100?"#22c55e":progression>=50?"#f97316":"#ef4444"}} />
          </div>
          <span className="text-sm text-gray-400">{progression}%</span>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div key={animKey} className="flex-1 module-enter-page">
            <div className="rounded-2xl aspect-video mb-6 overflow-hidden">
              {chapitre.videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${chapitre.videoId}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <p className="text-gray-500 text-sm">🎬 Vidéo à venir</p>
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mb-3">{chapitre.titre}</h2>
            {chapitre.liens && chapitre.liens.length > 0 && (
            <div className="flex flex-col gap-4 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">🔗 Liens et outils</h3>
                <div className="flex flex-col gap-2">
                  {chapitre.liens.map((l, i) => (
                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                      🔗 {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            )}
            {chapitre.description && chapitre.description !== "Contenu à venir." && (
            <div className="flex flex-col gap-4 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{__html: chapitre.description}} />
              </div>
            </div>
            )}
            {chapitre.id === 2 && moduleId === 1 && (
            <div className="flex flex-col gap-4 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">🔗 Lien du jeu ⬇️</h3>
                {chapitre.lien && (
                  <a href={chapitre.lien} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                    {chapitre.lienlabel || "🔗 Lien"}
                  </a>
                )}
              </div>
            </div>
            )}
            {chapitre.id > 2 && (
            <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-2xl p-5 mt-4">
              <h3 className="text-white font-bold mb-3">📝 Mes notes</h3>
              <textarea
                placeholder="Écris tes notes ici..."
                onChange={e => localStorage.setItem(`note-main-${moduleId}-${chapitre.id}`, e.target.value)}
                defaultValue={typeof window !== "undefined" ? localStorage.getItem(`note-main-${moduleId}-${chapitre.id}`) || "" : ""}
                className="w-full min-h-[200px] bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
              />
              <p className="text-xs text-gray-600 mt-1">Tes notes sont sauvegardées automatiquement sur cet appareil</p>
            </div>
            )}
          </div>
          <div className="w-full md:w-72 shrink-0 flex flex-col gap-6">
            <div>
              <h3 className="font-bold text-white mb-4">Chapitres</h3>
              <div className="flex flex-col gap-2">
                {moduleData.chapitres.map((chap,i) => (
                  <div key={chap.id} onClick={() => { setChapitreActif(i); setAnimKey(k => k + 1); }}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${i===chapitreActif?"bg-blue-600/20 border border-blue-500":"bg-gray-900 border border-gray-800 hover:border-gray-600"}`}>
                    <button onClick={(e) => {e.stopPropagation();toggleCompleted(chap.id);}}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${completed.includes(chap.id)?"bg-green-500 border-green-500":"border-gray-600"}`}>
                      {completed.includes(chap.id) && <span className="text-xs text-white">✓</span>}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-medium ${i===chapitreActif?"text-blue-400":"text-gray-300"}`}>{chap.titre}</p>
                        {i===chapitreActif && <button onClick={(e) => { e.stopPropagation(); suivant(); }} className="shrink-0 bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all">{estDernier?"🎉 Terminer":"Suivant →"}</button>}
                      </div>
                      <p className="text-xs text-gray-500">{chap.duree}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex-1 flex flex-col">
              <h3 className="text-white font-bold mb-3">📝 Mes notes</h3>
              <textarea
                placeholder="Écris tes notes ici..."
                onChange={e => localStorage.setItem(`note-${moduleId}-${chapitre.id}`, e.target.value)}
                defaultValue={typeof window !== "undefined" ? localStorage.getItem(`note-${moduleId}-${chapitre.id}`) || "" : ""}
                className="w-full flex-1 min-h-[300px] bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
              />
              <p className="text-xs text-gray-600 mt-1">Tes notes sont sauvegardées automatiquement sur cet appareil</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
