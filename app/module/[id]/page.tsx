"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

const modulesData: {[key:number]:{titre:string;chapitres:{id:number;titre:string;duree:string;videoId:string;description:string;lien?:string;lienlabel?:string;liens?:{label:string;url:string}[]}[]}} = {
  8:{titre:"Niche GTA 6",chapitres:[
    {id:1,titre:"Niche GTA 6",duree:"-",videoId:"",description:"Contenu secret en cours de préparation..."},
  ]},
  18:{titre:"Outils pour faire plus d'argent et être plus productif",chapitres:[
    {id:1,titre:"Outils pour faire plus d'argent et être plus productif",duree:"3min36",videoId:"9YIjSqpT66U",description:"",liens:[
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
    {id:1,titre:"Organisation et planification",duree:"2min06",videoId:"jDOyduSjKCU",description:"<strong style=\"font-size:1.1rem\">ORGANISATION:</strong>\n\n- Faire une to-do liste tous les soirs\n\n- Quand tu fais ta vidéo, mets un timer de 15-20min (ça crée du sentiment d'urgence)\n\n- Essayer de faire les vidéos pendant le week-end pour les poster durant la semaine (beaucoup plus productif)\n\n- Programmer les vidéos (expliqué dans la suite du programme)"},
    {id:2,titre:"Mind set",duree:"1min20",videoId:"GddLPbqCu4o",description:"JAMAIS ABANDONNER !"},
  ]},
  12:{titre:"Comprendre les réseaux et comment être monétisé",chapitres:[
    {id:1,titre:"Les bases",duree:"3min05",videoId:"sWJpgbE0xz4",description:"<strong style=\"font-size:1.1rem\">À retenir :</strong>\n\nL'algorithme est un robot. Son but, c'est de faire rester les gens le plus longtemps possible sur l'application. Donc il ne pousse une vidéo que si elle est intéressante — et il juge ça avec 3 critères :\n\n• Watch Time (temps de visionnage total)\n• Stay to Watch (rétention, est-ce qu'on reste jusqu'à la fin)\n• Commentaires (engagement)\n\n→ Si ta vidéo n'est pas intéressante selon ces critères, l'algorithme n'a aucun intérêt à la faire pousser. Si elle l'est, même en partant de 200-300 vues, il peut te placer comme un compte \"élite\"."},
    {id:3,titre:"Critères de monétisation",duree:"2min40",videoId:"NlT-edRHGlI",description:"<strong style=\"font-size:1.1rem\">À retenir :</strong>\n\nCritères de monétisation par plateforme\n\n• YouTube (premier palier) : 500 abonnés + 3 millions de vues sur les 90 derniers jours\n• YouTube : 1 000 abonnés + 10 millions de vues sur les 90 derniers jours\n• TikTok : 10 000 abonnés + 100 000 vues sur les 30 derniers jours\n• Facebook : accès sur invitation uniquement."},
    {id:4,titre:"10 niches pour monter à 10K abonnés sur TikTok",duree:"5min21",videoId:"MvRTKDKnwRg",description:"<strong style=\"font-size:1.1rem\">À retenir :</strong>\n\nVoici les niches les plus efficaces pour atteindre 10 000 abonnés sur TikTok rapidement :\n\n• Fruits IA — contenu généré par IA, très viral\n• Football React — réactions à des moments de foot\n• Religion — forte communauté et engagement élevé\n• Reportage — contenu informatif qui retient l'attention\n• Team Boys / Team Girls — contenu de divertissement communautaire\n\n→ Ces niches ont toutes un point commun : elles créent de l'émotion et poussent au partage."},
  ]},
  13:{titre:"Contenu 100% anonyme",chapitres:[
    {id:1,titre:"Contenu anonyme, c'est quoi ?",duree:"1min12",videoId:"VQjm1hA2euU",description:"<strong style=\"font-size:1.1rem\">À retenir :</strong>\n\nLe contenu anonyme, c'est créer des vidéos sans jamais montrer ton visage ni utiliser ta vraie voix. Concrètement :\n\n• Les clips vidéo sont trouvés sur Internet et remontés\n• La voix est générée par une IA\n• Le montage fait toute la différence\n\n→ Résultat : un contenu professionnel, viral, et 100% anonyme."},
    {id:2,titre:"Exemple de contenu anonyme",duree:"1min36",videoId:"E7QuR44xUBA",description:"Voici un exemple d'une vidéo anonyme."},
    {id:3,titre:"Faire du contenu sans tête et sans voix de qualité",duree:"5min13",videoId:"p31WL_jKXI0",description:"Comment faire du contenu anonyme de qualité."},
    {id:4,titre:"Voix off anonyme sur TikTok",duree:"1min03",videoId:"cRwpZ9f54qM",description:"Voix off anonyme sur TikTok."},
    {id:5,titre:"Voix off facile sur CapCut",duree:"1min33",videoId:"zLvmkMyPO5I",description:"Voix off facile et voix IA sur CapCut."},
    {id:6,titre:"Faire du contenu Allemand, Espagnol, Italien",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:10,titre:"Faire vidéo étranger pour les 10k abos TikTok",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:7,titre:"Contenu étranger avec CapCut",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:8,titre:"Avoir une bonne voix off IA",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:9,titre:"Retirer les sous-titres d'une vidéo",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},
  14:{titre:"Trouver sa niche, être efficace et monétiser",chapitres:[
    {id:1,titre:"Trouver TA niche",duree:"1min01",videoId:"cBv_CKgzeIk",description:"Reste focus sur une seule niche par compte ! Ne pas faire plusieurs niches sur un seul compte."},
    {id:2,titre:"Que faire quand tu as trouvé ta niche ?",duree:"0min55",videoId:"Lc2QQj1fo8U",description:"Utilise un compte déjà chauffé!"},
    {id:6,titre:"Comment s'inspirer des autres ?",duree:"2min19",videoId:"-PoWlgE-y2A",description:"Pour t'inspirer d'autres créateurs, il faut que tu aies une vision d'un vrai créateur, et non d'un simple consommateur. Quand tu regardes des vidéos d'autres créateurs, analyse leur contenu et vérifie s'ils sont monétisés."},
    {id:7,titre:"Faire du contenu grâce aux autres",duree:"1min48",videoId:"MjnVjY2kFXI",description:"Tu n'es pas obligé de tout créer toi-même : réagis à du contenu existant, fais des compilations ou des commentaires sur des vidéos populaires de ta niche. C'est une méthode rapide pour produire régulièrement sans t'épuiser."},
    {id:8,titre:"Trouver des idées avec l'IA",duree:"1min30",videoId:"YzXxrjOo8dc",description:"Utilise l'IA (ChatGPT, Gemini...) pour générer rapidement des idées de sujets, de titres et d'angles dans ta niche. Ça te permet de ne jamais tomber en panne d'inspiration."},
    {id:3,titre:"Branding et identité du compte",duree:"2min22",videoId:"3E38_Qbpi0Q",description:"Ton compte doit donner envie de te suivre dès la première seconde : choisis un pseudo, une photo de profil et une bio cohérents avec ta niche. Garde la même identité visuelle sur tous tes réseaux pour que les gens te reconnaissent facilement."},
    {id:5,titre:"Recevoir des collaborations",duree:"2min54",videoId:"RI0PjGe9_dI",description:"Pour recevoir des propositions de collaboration, crée un email pro dédié et mets-le dans ta bio TikTok et dans l'onglet À propos de ta chaîne YouTube. Les propositions arrivent surtout quand ton compte grandit, alors reste patient. Et si tu es payé pour parler d'un produit, signale-le toujours clairement (partenariat commercial)."},
  ]},
  15:{titre:"30 exemples de niches à faire",chapitres:[
    {id:1,titre:"30 exemples de niches à faire",duree:"6min27",videoId:"JaOHbK6O4dg",description:"<strong style='font-size:1.4em;display:block;margin-bottom:8px;'>Niche avec peu de concurrence à faire :</strong><br/><br/><strong>1. Technologie (Apple, Samsung)</strong><br/><strong>2. Voyages</strong><br/><strong>3. Immobilier</strong><br/><strong>4. Le droit</strong><br/><strong>5. Éducation</strong><br/><strong>6. Covering / moto / réparation moto</strong><br/><strong>7. Cuisine / dégustation (réaction du contenu US / Espagnol)</strong><br/><strong>8. Chaussures de mode</strong><br/><strong>9. Sport peu connu / lutte / judo / basket / tennis</strong><br/><strong>10. Les dinosaures</strong><br/><strong>11. Le gaming (GTA 6 bientôt)</strong><br/><strong>12. Histoire (humanité, seconde guerre mondiale)</strong><br/><strong>13. La coiffure</strong><br/><strong>14. Musique</strong><br/><strong>15. Bateau</strong><br/><strong>16. Armée</strong><br/><strong>17. Innovation</strong><br/><strong>18. Accident (route, incendie, inondations)</strong><br/><strong>19. Animaux (comparaison des animaux sous format réaction)</strong><br/><strong>20. Salaire (footballeur, acteur, combattant)</strong><br/><strong>21. Crime</strong><br/><strong>22. Les transports</strong><br/><strong>23. Séduction / drague</strong><br/><strong>24. Les métiers (docteur, chirurgien)</strong><br/><strong>25. Les pays</strong><br/><strong>26. Autour d\'un style de musique (parler des artistes, des sons)</strong><br/><strong>27. Les prisons</strong><br/><strong>28. La loi</strong><br/><strong>29. L\'actualité</strong><br/><strong>30. Les boissons (Coca, Monster)</strong><br/><strong>31. Décoration d\'intérieur</strong>"},
    {id:2,titre:"Utiliser l'IA pour trouver des sous-niches",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},
  26:{titre:"Présentation de CapCut téléphone et PC",chapitres:[
    {id:1,titre:"Présentation de CapCut sur téléphone",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:2,titre:"Présentation de CapCut sur PC",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},
  16:{titre:"Exemple de montage CapCut sur téléphone et PC",chapitres:[
    {id:1,titre:"Exemple de montage sur téléphone",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:2,titre:"Exemple de montage sur PC",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},
  17:{titre:"Commencer à poster",chapitres:[
    {id:1,titre:"Créer et chauffer son compte",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:2,titre:"Importation, Publication et problème de droit d'auteur sur YouTube",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:3,titre:"Outils importation automatique",duree:"0min43",videoId:"MA_6t7sMykQ",description:"",liens:[
      {label:"Repurpose.io",url:"https://repurpose.io/?fpr=545571"},
    ]},
  ]},
  25:{titre:"Analyser pourquoi une vidéo a percé",chapitres:[
    {id:1,titre:"Analyser le Stayed to Watch et la rétention d'audience sur YouTube",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:2,titre:"Analyser la rétention sur TikTok",duree:"-",videoId:"",description:"Contenu à venir."},
    {id:3,titre:"Savoir en avance si une vidéo va percer ou pas",duree:"-",videoId:"",description:"Contenu à venir."},
  ]},

  19:{titre:"Problèmes de compte et de monétisation",chapitres:[
    {id:1,titre:"Rester monétisé",duree:"2min15",videoId:"0Kz1DkQJ7xc",description:"À retenir :\n\n• Transformer vraiment la vidéo\n• Éviter l'effet « usine à vidéos »\n• Ne pas supprimer ses vidéos TikTok\n• Respecter les droits d'auteur\n• Éviter les sujets sensibles\n• Si c'est du contenu IA, le faire savoir à la plateforme"},
    {id:2,titre:"Contestation de monétisation pour YouTube/TikTok/Facebook",duree:"0min28",videoId:"9RlQLv6kF7E",description:"Voici la contestation à envoyer sur YouTube, TikTok et Facebook pour avoir encore une chance d'être monétisé :<br/><br/><strong>\"Je ne comprends pas pourquoi mon compte a été refusé pour le programme de rémunération. Mon compte respecte toutes vos règles. Pouvez-vous réexaminer votre décision ? Je trouve cette disqualification injustifiée.\"</strong>"},
    {id:3,titre:"Récupérer un compte banni sur TikTok et YouTube",duree:"1min37",videoId:"9672Dimb2-0",description:"Si ta vidéo, ta chaîne ou ta monétisation est bloquée, signale le problème directement aux plateformes avec les liens ci-dessous. Explique clairement la situation, reste poli, et donne un maximum de détails (nom du compte, date, message reçu).",liens:[{label:"Signaler un problème à TikTok",url:"https://www.tiktok.com/legal/report/feedback?lang=fr"},{label:"Aide YouTube",url:"https://support.google.com/youtube/?hl=fr#topic=9257498"},{label:"Assistance YouTube (chaîne ou vidéo bloquée)",url:"https://support.google.com/youtube/troubleshooter/13572679?hl=fr"},{label:"Centre d'aide Facebook",url:"https://www.facebook.com/help/"}]},
    {id:4,titre:"Contestation pour une vidéo TikTok banni",duree:"0min36",videoId:"W2DVUQCPltM",description:"Voici la contestation à mettre si une vidéo TikTok a été bannie :<br/><br/><strong>\"Je pense que cette vidéo a été supprimée par erreur. Elle respecte les règles de la communauté TikTok. Pouvez-vous la réexaminer manuellement, s'il vous plaît ?\"</strong>"},
  ]},
  20:{titre:"Augmenter son RPM",chapitres:[
    {id:1,titre:"Comment augmenter son RPM sur les réseaux ?",duree:"4min35",videoId:"IkDnXZBozfw",description:"<strong style='font-size:1.4em;display:block;margin-bottom:8px;'>Comment augmenter son RPM ?</strong><br/><br/><strong>• Faire des plans dynamiques</strong><br/><strong>• Cibler une audience plus âgée (meilleur pouvoir d'achat)</strong><br/><strong>• Rester sur une seule et unique thématique par compte (récompense supplémentaire)</strong><br/><strong>• Cibler des personnes qui vivent dans des pays éligibles à la monétisation (France, Allemagne, USA, Espagne, etc.)</strong><br/><strong>• Moins d'images, plus de vidéos</strong><br/><strong>• Améliorer la rétention et le temps de visionnage</strong><br/><strong>• Travailler le hook dès les premières secondes</strong><br/><strong>• Publier régulièrement</strong><br/><strong>• Analyser ses statistiques pour identifier ce qui génère le meilleur RPM</strong><br/><strong>• Privilégier les formats qui favorisent l'engagement et le temps de visionnage</strong><br/><strong>• Éviter les contenus qui peuvent limiter la monétisation</strong>"},
  ]},
  21:{titre:"Astuces",chapitres:[
    {id:1,titre:"Créer des e-mails facilement en illimité",duree:"1min22",videoId:"jP6kluEbED8",description:"",liens:[{label:"Firefox Relay",url:"https://relay.firefox.com/accounts/profile/"}]},
    {id:2,titre:"Outils pour analyser les concurrents",duree:"1min28",videoId:"Jcg80S8eSWY",description:"Voici quelques outils utiles pour analyser des vidéos d'autres personnes sur TikTok et YouTube.",liens:[{label:"vidIQ",url:"https://vidiq.com/fr/extension/"}]},
    {id:4,titre:"Améliorer l'accroche et le hook",duree:"2min02",videoId:"gz9g-5xe30E",description:"Le hook, c'est les 3 premières secondes de ta vidéo. Son rôle : capter l'attention du spectateur pour qu'il reste jusqu'à la fin.\n\n→ Un bon hook = plus de rétention = l'algorithme pousse ta vidéo. C'est l'élément le plus important de ta vidéo, soigne-le !"},
    {id:5,titre:"Heure / hashtags pour poster",duree:"2min40",videoId:"yWpILVupjqM",description:"L'heure pour poster n'est pas très importante : le plus important, c'est que ton contenu soit bon. Les hashtags sont un peu importants car ils servent à cibler l'audience avec ta niche."},
    {id:6,titre:"Programmer ses vidéos",duree:"1min11",videoId:"aVgvnh2p35I",description:"Dans ce module, je te montre comment programmer ta vidéo sur TikTok, Facebook et YouTube."},
    {id:7,titre:"Que faire si la vidéo a du potentiel mais qu'elle ne perce pas ?",duree:"1min55",videoId:"ls3FfpivImc",description:"À RETENIR : ne jamais supprimer une vidéo TikTok, cela casse l'algorithme ! Mets-la juste en privé."},
    {id:8,titre:"Reposter une ancienne vidéo de 3 mois",duree:"1min24",videoId:"T8sVboI1CiY",description:"Tu peux reposter les anciennes vidéos que tu as postées sur ton compte ou ta chaîne YouTube qui datent d'il y a trois mois, si tu as la flemme de faire de nouvelles vidéos !"},
  ]},
  22:{titre:"Retirer L'argent et compte Adsense",chapitres:[
    {id:1,titre:"Configurer son compte AdSense et déclaration",duree:"1min58",videoId:"MfcAMouV7lQ",description:"",liens:[{label:"Aide Google AdSense",url:"https://support.google.com/adsense/answer/1709858?hl=fr"}]},
    {id:2,titre:"Retirer l'argent sur TikTok et YouTube",duree:"2min27",videoId:"VLtrXXOLsW0",description:"",liens:[{label:"Aide Google AdSense",url:"https://support.google.com/adsense/answer/1709858?hl=fr"}]},
  ]},
  24:{titre:"Bien maîtriser sa chaîne YouTube",chapitres:[
    {id:1,titre:"Personnaliser sa chaîne YouTube",duree:"2min08",videoId:"ouNtOvzX76c",description:"Comment bien personnaliser sa chaîne YouTube et donner envie aux gens de regarder ton contenu ?"},
    {id:2,titre:"IA qui peut t'aider à devenir viral sur YouTube Studio",duree:"0min35",videoId:"yFdqVaEQQdc",description:"L'IA est directement intégrée sur YouTube!"},
    {id:3,titre:"Créer des posts spéciaux pour faire une communauté sur YouTube",duree:"0min45",videoId:"YCPMsZZJ5B8",description:"Voici comment créer des posts pour votre communauté et interagir avec elle."},
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

  const [chapRestaure, setChapRestaure] = useState<number | null>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chapitre_actif_" + moduleId);
      const n = Number(saved);
      const max = moduleData?.chapitres.length ?? 0;
      if (saved !== null && Number.isInteger(n) && n >= 0 && n < max) setChapitreActif(n);
    } catch {}
    setChapRestaure(moduleId);
  }, [moduleId]);
  useEffect(() => {
    if (chapRestaure !== moduleId) return;
    try { localStorage.setItem("chapitre_actif_" + moduleId, String(chapitreActif)); } catch {}
  }, [chapitreActif, chapRestaure, moduleId]);



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
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{chapitre.titre}</h2>
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-medium min-w-0 break-words ${i===chapitreActif?"text-blue-400":"text-gray-300"}`}>{chap.titre}</p>
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
