"use client";
export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <a href="/auth" className="text-blue-400 hover:underline text-sm mb-8 block">← Retour</a>
        <h1 className="text-3xl font-bold text-white mb-2">Mentions légales</h1>
        <p className="text-gray-400 mb-10">Dernière mise à jour : juillet 2025</p>
        <div className="flex flex-col gap-8">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Éditeur du site</h2>
            <ul className="text-gray-400 flex flex-col gap-1">
              <li><strong className="text-white">Nom / Responsable :</strong> Iurceac Julien</li>
              <li><strong className="text-white">Contact :</strong> <a href="mailto:cookeddog67@gmail.com" className="text-blue-400 hover:underline">cookeddog67@gmail.com</a></li>
              <li><strong className="text-white">Pays :</strong> France</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Hébergement et infrastructure</h2>
            <div className="flex flex-col gap-3">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">Hébergement de l'application</p>
                <p className="text-gray-400 text-sm">Vercel Inc. — <a href="https://vercel.com" target="_blank" className="text-blue-400 hover:underline">vercel.com</a></p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">Stockage et gestion des données</p>
                <p className="text-gray-400 text-sm">Supabase — <a href="https://supabase.com" target="_blank" className="text-blue-400 hover:underline">supabase.com</a></p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">Service d'intelligence artificielle</p>
                <p className="text-gray-400 text-sm">OpenRouter — <a href="https://openrouter.ai" target="_blank" className="text-blue-400 hover:underline">openrouter.ai</a></p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Nature du site</h2>
            <p className="text-gray-400 leading-relaxed">Nezro Academy est une plateforme privée de formation en ligne. L'accès est réservé aux personnes ayant acquis le Programme YMA via la plateforme Beacons. Aucun paiement n'est effectué directement sur ce site. Toutes les transactions sont réalisées via Beacons.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Services externes utilisés</h2>
            <p className="text-gray-400 mb-3">Nezro Academy utilise des services appartenant à des tiers pour assurer son fonctionnement :</p>
            <ul className="text-gray-400 list-disc pl-6 flex flex-col gap-1">
              <li><strong className="text-white">Vercel</strong> — hébergement de l'application web</li>
              <li><strong className="text-white">Supabase</strong> — base de données et authentification</li>
              <li><strong className="text-white">OpenRouter</strong> — traitement des requêtes de l'assistant IA</li>
              <li><strong className="text-white">Beacons</strong> — plateforme de paiement et de vente du Programme YMA</li>
            </ul>
            <p className="text-gray-400 mt-3">Chacun de ces services dispose de ses propres conditions d'utilisation et politiques de confidentialité, indépendantes de celles de Nezro Academy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Propriété intellectuelle</h2>
            <p className="text-gray-400 leading-relaxed">L'ensemble des contenus présents sur Nezro Academy (vidéos, documents PDF, textes, images, structure du programme) est la propriété exclusive de Iurceac Julien. Toute reproduction, diffusion, revente ou utilisation non autorisée des contenus peut engager la responsabilité de son auteur conformément aux dispositions légales applicables.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Données personnelles</h2>
            <p className="text-gray-400 leading-relaxed">Les informations relatives à la collecte, au traitement et à la protection des données personnelles des membres sont disponibles dans la <a href="/legal/confidentialite" className="text-blue-400 hover:underline">Politique de confidentialité</a> de Nezro Academy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Limitation de responsabilité</h2>
            <ul className="text-gray-400 list-disc pl-6 flex flex-col gap-2">
              <li>Les contenus du Programme YMA sont fournis à titre pédagogique uniquement. Aucun résultat financier, revenu ou performance particulière n'est garanti.</li>
              <li>Les performances dépendent entièrement de l'investissement personnel de chaque membre.</li>
              <li>Les réponses générées par l'assistant IA peuvent contenir des erreurs ou être incomplètes. Elles ne constituent pas un conseil professionnel.</li>
              <li>Nezro Academy n'est pas responsable du contenu des sites externes vers lesquels des liens peuvent rediriger.</li>
              <li>Les membres restent seuls responsables de l'utilisation qu'ils font des informations et ressources proposées sur la plateforme.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Contact</h2>
            <p className="text-gray-400">Pour toute question relative au site : <a href="mailto:cookeddog67@gmail.com" className="text-blue-400 hover:underline">cookeddog67@gmail.com</a></p>
          </section>

        </div>
      </div>
    </main>
  );
}
