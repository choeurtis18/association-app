import { useState } from 'react';

const useDesinscriptionEvenement = () => {
  const [loadingDesinscription, setLoadingDesinscription] = useState(false);
  const [errorDesinscription, setErrorDesinscription] = useState(null);

  const handleDesinscription = async (adherentId, evenementId) => {
    setLoadingDesinscription(true);
    setErrorDesinscription(null);

    try {
      const response = await fetch(`http://localhost:5001/api/adherents/${adherentId}/evenements/${evenementId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to unregister from event');
      }
      alert('Désinscription réussie');
      window.location.reload();
    } catch (err) {
      setErrorDesinscription(err.message);
      console.error(err);
    } finally {
      setLoadingDesinscription(false);
    }
  };

  return { handleDesinscription, loadingDesinscription, errorDesinscription };
};

export default useDesinscriptionEvenement;
