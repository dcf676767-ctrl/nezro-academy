export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <a href="/auth" className="text-blue-400 hover:underline text-sm mb-8 inline-block">← Retour</a>
        <h1 className="text-4xl font-bold mb-2">Mentions légales</h1>
        <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : juillet 2025</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Éditeur du site</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-gray-400 space-y-1">
            <p><span className="text-white font-medium">Nom :</span> Iurceac Julien</p>
            <p><span className="text-white font-medium">Site :</span> Nezro Academy</p>
            <p><span className="text-white font-medium">Contact :</span> cookeddog67@gmail.com</p>
            <p><span className="text-white font-medium">Pays :</span> France</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Hébergement</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-gray-400 space-y-1">
            <p><span className="text-white font-medium">Hébergeur :</span> Vercel Inc.</p>
            <p><span className="text-white font-medium">Site :</span> vercel.com</p>
            <p><span className="text-white font-medium">Base de données :</span> Supabase (supabase.com)</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Nature du site</h2>
          <p className="text-gray-400 leading-relaxed">Nezro Academy est un site privé de formation en ligne. L'accès est réservé aux personnes ayant acquis le programme YMA via la plateforme Beacons. Aucun paiement n'est effectué directement sur ce site.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Propriété intellectuelle</h2>
          <p className="text-gray-400 leading-relaxed">L'ensemble des contenus présents sur Nezro Academy (vidéos, documents PDF, textes, images, structure du programme) est la propriété exclusive de Julien Iurceac. Toute reproduction, diffusion, revente ou partage non autorisé est strictement interdit et susceptible d'engager la responsabilité civile et pénale de son auteur.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Limitation de responsabilité</h2>
          <p className="text-gray-400 leading-relaxed">Nezro Academy fournit des méthodes, conseils et ressources à titre informatif. Aucun résultat financier n'est garanti. Les performances dépendent entièrement du travail personnel de chaque membre. Nezro Academy ne saurait être tenu responsable des décisions prises sur la base des contenus du programme.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
          <p className="text-gray-400">Pour toute question relative au site : <a href="mailto:cookeddog67@gmail.com" className="text-blue-400 hover:underline">cookeddog67@gmail.com</a></p>
        </section>
      </div>
    </main>
  );
}