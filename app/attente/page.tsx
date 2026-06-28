export default function Attente() {
  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
        <span className="text-4xl">⏳</span>
        <h1 className="text-2xl font-bold mt-4 mb-2 text-gray-900">Demande en cours</h1>
        <p className="text-gray-500">En attente de validation par l'admin.</p>
      </div>
    </main>
  );
}