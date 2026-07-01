"use client";
export default function Confidentialite() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <a href="/auth" className="text-blue-400 hover:underline text-sm mb-8 block">← Retour</a>
        <h1 className="text-3xl font-bold text-white mb-2">Politique de confidentialité</h1>
        <p className="text-gray-400 mb-10">Dernière mise à jour : juillet 2025</p>
        <div className="flex flex-col gap-8">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Responsable du traitement</h2>
            <p className="text-gray-400 leading-relaxed">Le responsable du traitement des données personnelles est Iurceac Julien, accessible à l'adresse : <a href="mailto:cookeddog67@gmail.com" className="text-blue-400 hover:underline">cookeddog67@gmail.com</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Données collectées</h2>
            <p className="text-gray-400 mb-2">Lors de l'inscription et de l'utilisation de la plateforme, les données suivantes sont collectées :</p>
            <ul className="text-gray-400 list-disc pl-6 flex flex-col gap-1">
              <li>Prénom (et nom si renseigné volontairement)</li>
              <li>Adresse e-mail</li>
              <li>Mot de passe (stocké de manière sécurisée par le système d'authentification, jamais accessible en clair par l'administrateur)</li>
              <li>Photo de profil (facultative)</li>
              <li>Biographie (facultative)</li>
              <li>Progression dans le programme et pourcentage d'avancement</li>
              <li>Badges obtenus</li>
              <li>Date d'inscription</li>
              <li>Préférences de notifications</li>
              <li>Paramètres du compte</li>
              <li>Réseaux sociaux renseignés volontairement par l'utilisateur</li>
              <li>Informations liées aux interactions avec la plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Finalités du traitement</h2>
            <p className="text-gray-400 mb-2">Les données sont utilisées exclusivement pour :</p>
            <ul className="text-gray-400 list-disc pl-6 flex flex-col gap-1">
              <li>Permettre l'accès au Programme YMA</li>
              <li>Vérifier la validité de l'inscription (paiement confirmé)</li>
              <li>Gérer le compte membre</li>
              <li>Assurer le bon fonctionnement du site</li>
              <li>Personnaliser l'expérience utilisateur</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Accès aux données</h2>
            <p className="text-gray-400 mb-2">Seul l'administrateur (Julien) a accès aux données suivantes :</p>
            <ul className="text-gray-400 list-disc pl-6 flex flex-col gap-1 mb-3">
              <li>Prénom et nom</li>
              <li>Adresse e-mail</li>
              <li>Photo de profil</li>
              <li>Biographie</li>
              <li>Statut du compte</li>
            </ul>
            <p className="text-gray-400 mb-2">⚠️ Le mot de passe n'est jamais accessible, ni par l'administrateur, ni par aucun tiers.</p>
            <p className="text-gray-400">Les autres membres ne voient jamais les adresses e-mail. Ils voient uniquement le prénom (ou prénom + nom si choisi) et la photo de profil.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Hébergement et sous-traitants</h2>
            <p className="text-gray-400 mb-3">Les données sont traitées par les services suivants :</p>
            <ul className="text-gray-400 list-disc pl-6 flex flex-col gap-2">
              <li><strong className="text-white">Supabase (supabase.com)</strong> — stockage et gestion des données membres, authentification et base de données. Supabase dispose de sa propre politique de confidentialité.</li>
              <li><strong className="text-white">Vercel (vercel.com)</strong> — hébergement de l'application web. Vercel dispose de sa propre politique de confidentialité.</li>
              <li><strong className="text-white">OpenRouter (openrouter.ai)</strong> — traitement des requêtes envoyées à l'assistant IA. Les conversations ne sont pas conservées par Nezro Academy. OpenRouter dispose de sa propre politique de confidentialité.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Assistant IA</h2>
            <p className="text-gray-400 leading-relaxed mb-2">Nezro Academy intègre un assistant IA alimenté par OpenRouter. Les éléments suivants s'appliquent :</p>
            <ul className="text-gray-400 list-disc pl-6 flex flex-col gap-1">
              <li>Les conversations avec l'assistant IA ne sont pas conservées par Nezro Academy</li>
              <li>Une limite d'utilisation quotidienne est appliquée</li>
              <li>Les réponses générées peuvent contenir des erreurs ou être incomplètes</li>
              <li>L'utilisateur est seul responsable des informations qu'il choisit de transmettre à l'assistant IA</li>
              <li>Il est déconseillé de partager des informations personnelles sensibles ou confidentielles via l'assistant IA</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Durée de conservation</h2>
            <p className="text-gray-400 leading-relaxed">Les données sont conservées tant que le compte est actif. En cas de suppression de compte, l'accès est immédiatement révoqué. Certaines données peuvent être conservées temporairement dans Supabase pour des raisons administratives ou légales, conformément aux conditions d'utilisation de ce service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Suppression du compte</h2>
            <p className="text-gray-400 leading-relaxed">Le membre peut supprimer son compte depuis la section Paramètres. Une confirmation est demandée avant toute suppression définitive. L'accès à la plateforme est immédiatement révoqué. Certaines données peuvent être conservées temporairement pour des raisons administratives ou légales.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Sécurité des données</h2>
            <p className="text-gray-400 leading-relaxed mb-2">Nezro Academy met en œuvre des mesures techniques pour protéger les données des membres. Le membre est également responsable de la sécurité de son compte :</p>
            <ul className="text-gray-400 list-disc pl-6 flex flex-col gap-1">
              <li>Le membre doit conserver ses identifiants de connexion confidentiels</li>
              <li>Le partage des identifiants avec des tiers est strictement interdit</li>
              <li>En cas de compromission du compte, le membre doit contacter l'administrateur immédiatement à <a href="mailto:cookeddog67@gmail.com" className="text-blue-400 hover:underline">cookeddog67@gmail.com</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Vos droits (RGPD)</h2>
            <p className="text-gray-400 mb-2">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="text-gray-400 list-disc pl-6 flex flex-col gap-1 mb-3">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit de suppression (droit à l'oubli)</li>
              <li>Droit à la portabilité de vos données</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit d'opposition au traitement (selon les cas)</li>
            </ul>
            <p className="text-gray-400">Pour exercer ces droits, contactez : <a href="mailto:cookeddog67@gmail.com" className="text-blue-400 hover:underline">cookeddog67@gmail.com</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Cookies</h2>
            <p className="text-gray-400 leading-relaxed">Nezro Academy utilise uniquement des cookies techniques nécessaires au fonctionnement de l'authentification. Aucun cookie publicitaire ou de tracking n'est utilisé.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">12. Contact</h2>
            <p className="text-gray-400">Pour toute question relative à vos données personnelles : <a href="mailto:cookeddog67@gmail.com" className="text-blue-400 hover:underline">cookeddog67@gmail.com</a></p>
          </section>

        </div>
      </div>
    </main>
  );
}
