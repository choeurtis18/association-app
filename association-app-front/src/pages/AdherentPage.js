import React from 'react';
import { useParams, Link } from 'react-router-dom';
import useAdherent from '../hooks/useAdherent';
import useEvenements from '../hooks/useEvenements';
import useEvenementsAdherent from '../hooks/useEvenementsAdherent';
import useInscriptionEvenement from '../hooks/useInscriptionEvenement';
import useDesinscriptionEvenement from '../hooks/useDesinscriptionEvenement';

const AdherentPage = () => {
  const { id } = useParams();
  const { adherent, loadingAdherent, errorAdherent } = useAdherent(id);
  const { evenements, loadingEvenements, errorEvenements } = useEvenements([]);
  const { evenementsAdherent, loadingEvenementsAdherent, errorEvenementsAdherent } = useEvenementsAdherent(id);
  const { handleInscription, loadingInscription, errorInscription } = useInscriptionEvenement(id);
  const { handleDesinscription, loadingDesinscription, errorDesinscription } = useDesinscriptionEvenement();

  if (loadingAdherent || loadingEvenements || loadingEvenementsAdherent) return <p className="text-center text-gray-500">Chargement...</p>;
  if (errorAdherent || errorEvenements || errorEvenementsAdherent) return <p className="text-center text-red-500">Erreur sur les données</p>;

  // Filtrer les événements disponibles pour exclure ceux auxquels l'adhérent est déjà inscrit
  const evenementsDisponibles = evenements.filter(evenement =>
    !evenementsAdherent.some(e => e.id === evenement.id)
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Détails de l'Adhérent</h1>
      <div className="mb-4">
        <p><span className="font-semibold">ID:</span> {adherent.id}</p>
        <p><span className="font-semibold">Nom:</span> {adherent.nom}</p>
        <p><span className="font-semibold">Prénom:</span> {adherent.prenom}</p>
        <p><span className="font-semibold">Email:</span> {adherent.mail}</p>
        <p><span className="font-semibold">Catégorie d'âge:</span> {adherent.categorie_age}</p>
        <p><span className="font-semibold">Cotisation Payée:</span> {adherent.cotisationpayee.toString()}</p>
        <p><span className="font-semibold">Licencier:</span> {adherent.licencier.toString()}</p>
        <p><span className="font-semibold">Catégorie:</span> {adherent.categorie}</p>
        <p><span className="font-semibold">Niveau:</span> {adherent.niveau}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Événements</h2>
      <ul className="list-disc list-inside mb-4">
        {evenementsAdherent.length > 0 ? (
          evenementsAdherent.map((evenement) => (
            <li key={evenement.id} className="flex justify-between items-center">
              <div>
                {evenement.nom} - {evenement.date}
              </div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleDesinscription(adherent.id, evenement.id)}
                disabled={loadingDesinscription}
              >
                {loadingDesinscription ? 'Désinscription...' : 'Se désinscrire'}
              </button>
            </li>
          ))
        ) : (
          <p className="text-red-500">pas d'événements pour cet adhérent</p>
        )}
      </ul>
      <h2 className="text-xl font-semibold mb-2">Personnes Tierces</h2>
      <ul className="list-disc list-inside mb-4">
        {adherent.personnesTierces.map((personne) => (
          <li key={personne.id}>
            {personne.nom} {personne.prenom}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Événements Disponibles</h2>
      <ul className="list-disc list-inside mb-4">
        {evenementsDisponibles.map((evenement) => (
          <li key={evenement.id} className="flex justify-between items-center">
            <div>
              {evenement.nom} - {evenement.date}
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => handleInscription(evenement.id)}
              disabled={loadingInscription}
            >
              {loadingInscription ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </li>
        ))}
      </ul>

      {errorInscription && <p className="text-red-500">{errorInscription}</p>}
      {errorDesinscription && <p className="text-red-500">{errorDesinscription}</p>}

      <Link to={`/adherents/update/${adherent.id}`} className="text-blue-500 hover:underline">
        Mettre à jour l'adhérent
      </Link>
    </div>
  );
};

export default AdherentPage;
