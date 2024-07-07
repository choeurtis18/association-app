import { useState } from 'react';

const useInscriptionEvenement = (adherentId) => {
  const [loadingInscription, setLoadingInscription] = useState(false);
  const [errorInscription, setErrorInscription] = useState(null);

  const handleInscription = async (evenementId) => {
    setLoadingInscription(true);
    setErrorInscription(null);

    try {
      const response = await fetch('http://localhost:5001/api/adherents/inscrire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adherent_id: adherentId, evenement_id: evenementId, presence: true }),
      });
      if (!response.ok) {
        throw new Error('Failed to register for event');
      }
      alert('Inscription réussie');
      window.location.reload();
    } catch (err) {
      setErrorInscription(err.message);
      console.error(err);
    } finally {
      setLoadingInscription(false);
    }
  };

  return { handleInscription, loadingInscription, errorInscription };
};

export default useInscriptionEvenement;
