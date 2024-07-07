import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAdherents from '../hooks/useAdherents';
import useEvenements from '../hooks/useEvenements';

const DashboardPage = () => {
  const { adherents, loading: loadingAdherents, error: errorAdherents } = useAdherents();
  const { evenements, loading: loadingEvenements, error: errorEvenements } = useEvenements();
  const [evenementParticipants, setEvenementParticipants] = useState({});
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const [errorParticipants, setErrorParticipants] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoadingParticipants(true);
      try {
        const participantsData = {};
        for (let evenement of evenements) {
          const response = await fetch(`http://localhost:5001/api/evenements/${evenement.id}/participants`);
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'An error occurred while fetching participants');
          }
          participantsData[evenement.id] = data;
        }
        setEvenementParticipants(participantsData);
      } catch (err) {
        setErrorParticipants(err.message);
      } finally {
        setLoadingParticipants(false);
      }
    };

    if (evenements.length > 0) {
      fetchParticipants();
    }
  }, [evenements]);

  const calculateTotalProfits = () => {
    return evenements.reduce((total, evenement) => {
      const participants = evenementParticipants[evenement.id] || [];
      return total + (participants.length * evenement.cout);
    }, 0);
  };

  const completeEvents = evenements.filter(evenement => {
    const participants = evenementParticipants[evenement.id] || [];
    return participants.length >= evenement.capacite;
  }).length;

  if (loadingAdherents || loadingEvenements || loadingParticipants) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  if (errorAdherents || errorEvenements || errorParticipants) {
    return <p className="text-center text-red-500">Erreur: {errorAdherents || errorEvenements || errorParticipants}</p>;
  }

  const totalProfits = calculateTotalProfits();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Adhérents</h2>
        <ul className="list-disc list-inside">
          {adherents.slice(0, 10).map(adherent => (
            <li key={adherent.id}>
              {adherent.nom} {adherent.prenom}
            </li>
          ))}
        </ul>
        <Link to="/adherents" className="text-blue-500 hover:underline">Voir tous les adhérents</Link>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Événements</h2>
        <ul className="list-disc list-inside">
          {evenements.slice(0, 10).map(evenement => (
            <li key={evenement.id}>
              {evenement.nom} - {new Date(evenement.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
        <Link to="/evenements" className="text-blue-500 hover:underline">Voir tous les événements</Link>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Statistiques</h2>
        <p>Total des adhérents: {adherents.length}</p>
        <p>Total des événements: {evenements.length}</p>
        <p>Événements complets: {completeEvents}/{evenements.length}</p>
        <p>Total des profits: {totalProfits}€</p>
      </section>
    </div>
  );
};

export default DashboardPage;
