import React from 'react';
import { useParams, Link } from 'react-router-dom';
import useEvenement from '../hooks/useEvenement';
import useAdherentsByEvenement from '../hooks/useAdherentsByEvenement';
import useSpectateursByEvenement from '../hooks/useSpectateursByEvenement';
import useDesinscriptionEvenement from '../hooks/useDesinscriptionEvenement';

const EvenementPage = () => {
  const { id } = useParams();
  const { evenement, loadingEvenement, errorEvenement } = useEvenement(id);
  const { adherents, loadingAdherents, errorAdherents } = useAdherentsByEvenement(id);
  const { spectateurs, loadingSpectateurs, errorSpectateurs } = useSpectateursByEvenement(id);
  const { handleDesinscription, loadingDesinscription, errorDesinscription } = useDesinscriptionEvenement();

  if (loadingEvenement || loadingAdherents || loadingSpectateurs) return <p className="text-center text-gray-500">Chargement...</p>;
  if (errorEvenement || errorAdherents || errorSpectateurs) return <p className="text-center text-red-500">Erreur: {errorEvenement || errorAdherents || errorSpectateurs}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Détails de l'Événement</h1>
      <div className="mb-4">
        <p><span className="font-semibold">ID:</span> {evenement.id}</p>
        <p><span className="font-semibold">Nom:</span> {evenement.nom}</p>
        <p><span className="font-semibold">Description:</span> {evenement.description}</p>
        <p><span className="font-semibold">Date:</span> {new Date(evenement.date).toLocaleDateString()}</p>
        <p><span className="font-semibold">Salle:</span> {evenement.salle}</p>
        <p><span className="font-semibold">Type:</span> {evenement.type}</p>
        <p><span className="font-semibold">Capacité:</span> {evenement.capacite}</p>
        <p><span className="font-semibold">Coût:</span> {evenement.cout}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Participants</h2>
      <ul className="list-disc list-inside mb-4">
        {adherents.map((adherent) => (
          <li key={adherent.id} className="flex justify-between items-center">
            <div>
              {adherent.nom} {adherent.prenom}
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => handleDesinscription(adherent.id, evenement.id)}
              disabled={loadingDesinscription}
            >
              {loadingDesinscription ? 'Désinscription...' : 'Désinscrire'}
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Spectateurs</h2>
      <ul className="list-disc list-inside mb-4">
        {spectateurs.map((spectateur) => (
          <li key={spectateur.id}>
            {spectateur.nom} {spectateur.prenom}
          </li>
        ))}
      </ul>

      <Link to={`/evenements/update/${evenement.id}`} className="text-blue-500 hover:underline">
        Mise à jour de l'événement
      </Link>

      <Link to="/evenements" className="text-blue-500 hover:underline">
        Retour aux événements
      </Link>
    </div>
  );
};

export default EvenementPage;
