export default function CGU() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <a href="/auth" className="text-blue-400 hover:underline text-sm mb-8 inline-block">← Retour</a>
        <h1 className="text-4xl font-bold mb-2">Conditions Générales d'Utilisation</h1>
        <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : juillet 2025</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Article 1 — Présentation</h2>
          <p className="text-gray-400 leading-relaxed">Nezro Academy est une plateforme privée de formation en ligne éditée par Iurceac Julien (France). Le programme proposé s'intitule Programme YMA. L'accès est réservé aux membres ayant effectué un achat via Beacons et dont la demande a été validée manuellement par l'administrateur.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Article 2 — Accès au site</h2>
          <div className="text-gray-400 space-y-3">
            <p>L'accès à Nezro Academy se fait en trois étapes :</p>
            <ol className="list-decimal list-inside space-y-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <li>Achat du programme YMA sur Beacons</li>
              <li>Création d'un compte sur Nezro Academy</li>
              <li>Validation manuelle de la demande par l'administrateur</li>
            </ol>
            <p>Aucun paiement n'est effectué directement sur ce site. Nezro Academy ne traite aucune transaction financière.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Article 3 — Inscription</h2>
          <p className="text-gray-400 leading-relaxed mb-3">Lors de l'inscription, le membre renseigne un prénom (et nom s'il le souhaite), une adresse e-mail et un mot de passe. Il doit obligatoirement accepter les présentes CGU et la Politique de confidentialité. Sans cette acceptation, l'inscription est impossible.</p>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-gray-400 space-y-2">
            <p className="font-medium text-white">Règles obligatoires :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Un seul compte par personne</li>
              <li>Le partage de compte est strictement interdit</li>
              <li>Deux connexions simultanées sont tolérées pour le même utilisateur</li>
              <li>Toute tentative de contournement peut entraîner un bannissement immédiat</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Article 4 — Propriété intellectuelle</h2>
          <p className="text-gray-400 leading-relaxed mb-3">L'ensemble des contenus du Programme YMA (vidéos, PDF, textes, structure) est la propriété exclusive de Julien Iurceac.</p>
          <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-6 text-gray-400 space-y-2">
            <p className="font-medium text-red-400">Sont strictement interdits :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>La copie, reproduction ou duplication de tout contenu</li>
              <li>La diffusion, le partage ou la mise à disposition à des tiers</li>
              <li>La revente ou commercialisation des contenus</li>
              <li>Le téléchargement des vidéos ou des PDF</li>
            </ul>
          </div>
          <p className="text-gray-400 leading-relaxed mt-3">Les méthodes et connaissances acquises peuvent être librement appliquées dans vos projets personnels. Seule la reproduction ou revente du contenu en lui-même est interdite.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Article 5 — Espace membre</h2>
          <p className="text-gray-400 leading-relaxed mb-3">L'espace membre donne accès aux fonctionnalités suivantes :</p>
          <div className="grid grid-cols-2 gap-3">
            {['Programme YMA','Dashboard','Annonces','Membres','Ressources','Classement','Calendrier','Assistant IA','Chat privé','Paramètres'].map(f => (
              <div key={f} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-gray-300 text-sm">{f}</div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Article 6 — Assistant IA</h2>
          <p className="text-gray-400 leading-relaxed">L'assistant IA utilise OpenRouter. Les conversations ne sont pas conservées. Une limite quotidienne d'utilisation est appliquée. Les réponses fournies par l'IA ne constituent en aucun cas une garantie de résultat. Les utilisateurs restent seuls responsables de leurs décisions.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Article 7 — Chat privé</h2>
          <p className="text-gray-400 leading-relaxed">Le chat permet uniquement de communiquer avec l'administrateur (Julien). Les membres ne peuvent pas discuter entre eux. Les messages peuvent être supprimés automatiquement après quelques jours.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Article 8 — Bannissement</h2>
          <p className="text-gray-400 leading-relaxed mb-3">L'administrateur se réserve le droit de bannir tout membre sans préavis dans les cas suivants :</p>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Partage de compte</li>
            <li>Création de plusieurs comptes</li>
            <li>Copie, diffusion ou revente de contenu</li>
            <li>Non-respect des présentes CGU</li>
            <li>Comportement abusif</li>
          </ul>
          <p className="text-gray-400 mt-3">Un membre banni peut contacter l'administrateur à cookeddog67@gmail.com. L'administrateur reste libre d'accepter ou non une réintégration.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Article 9 — Résultats et garanties</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-gray-400">
            <p className="leading-relaxed">Le Programme YMA fournit des méthodes, conseils et ressources. <span className="text-white font-medium">Aucun résultat financier n'est garanti.</span> Les performances dépendent entièrement de l'investissement personnel de chaque membre. Nezro Academy ne peut être tenu responsable des décisions prises sur la base des contenus du programme.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Article 10 — Ressources externes</h2>
          <p className="text-gray-400 leading-relaxed">Certaines ressources proposées redirigent vers des sites externes. Nezro Academy n'est pas responsable du contenu de ces sites. Aucun partenariat ni affiliation n'est en vigueur.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Article 11 — Évolution du site</h2>
          <p className="text-gray-400 leading-relaxed">Nezro Academy se réserve le droit de modifier à tout moment les contenus, fonctionnalités, design et conditions d'utilisation du site, sans préavis. L'utilisation continue du site vaut acceptation des modifications.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Article 12 — Suppression de compte</h2>
          <p className="text-gray-400 leading-relaxed">Le membre peut supprimer son compte depuis les paramètres. Une confirmation est demandée avant suppression définitive. L'accès est immédiatement révoqué. Certaines données peuvent être conservées temporairement pour des raisons administratives.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Article 13 — Contact</h2>
          <p className="text-gray-400">Pour toute question : <a href="mailto:cookeddog67@gmail.com" className="text-blue-400 hover:underline">cookeddog67@gmail.com</a></p>
        </section>
      </div>
    </main>
  );
}