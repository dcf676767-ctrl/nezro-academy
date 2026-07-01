export default function Confidentialite() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <a href="/auth" className="text-blue-400 hover:underline text-sm mb-8 inline-block">← Retour</a>
        <h1 className="text-4xl font-bold mb-2">Politique de confidentialité</h1>
        <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : juillet 2025</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">1. Responsable du traitement</h2>
          <p className="text-gray-400 leading-relaxed">Le responsable du traitement des données personnelles est Iurceac Julien, accessible à l'adresse : cookeddog67@gmail.com</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">2. Données collectées</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-gray-400 space-y-2">
            <p>Lors de l'inscription, les données suivantes sont collectées :</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Prénom (et nom si renseigné volontairement)</li>
              <li>Adresse e-mail</li>
              <li>Mot de passe (chiffré, jamais accessible à l'administrateur)</li>
              <li>Photo de profil (facultative)</li>
              <li>Biographie (facultative)</li>
              <li>Progression dans le programme</li>
              <li>Date d'inscription</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">3. Finalités du traitement</h2>
          <p className="text-gray-400 leading-relaxed mb-3">Les données sont utilisées exclusivement pour :</p>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Permettre l'accès au programme YMA</li>
            <li>Vérifier la validité de l'inscription (paiement confirmé)</li>
            <li>Gérer le compte membre</li>
            <li>Assurer le bon fonctionnement du site</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">4. Accès aux données</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-gray-400 space-y-2">
            <p>Seul l'administrateur (Julien) a accès aux données suivantes :</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Prénom et nom</li>
              <li>Adresse e-mail</li>
              <li>Photo de profil</li>
              <li>Biographie</li>
            </ul>
            <p className="mt-3 text-yellow-400/80 text-sm">⚠ Le mot de passe n'est jamais accessible, ni par l'administrateur, ni par aucun tiers.</p>
            <p className="mt-2">Les autres membres ne voient jamais les adresses e-mail. Ils voient uniquement le prénom (ou prénom + nom si choisi) et la photo de profil.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">5. Hébergement des données</h2>
          <p className="text-gray-400 leading-relaxed">Les données sont stockées via Supabase (supabase.com) et le site est hébergé sur Vercel (vercel.com). Ces services disposent de leurs propres politiques de confidentialité.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">6. Durée de conservation</h2>
          <p className="text-gray-400 leading-relaxed">Les données sont conservées tant que le compte est actif. En cas de suppression de compte, l'accès est immédiatement révoqué. Certaines données peuvent être conservées temporairement dans Supabase pour des raisons administratives.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">7. Vos droits</h2>
          <p className="text-gray-400 leading-relaxed">Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez : <a href="mailto:cookeddog67@gmail.com" className="text-blue-400 hover:underline">cookeddog67@gmail.com</a></p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">8. Cookies</h2>
          <p className="text-gray-400 leading-relaxed">Nezro Academy utilise uniquement des cookies techniques nécessaires au fonctionnement de l'authentification. Aucun cookie publicitaire ou de tracking n'est utilisé.</p>
        </section>
      </div>
    </main>
  );
}