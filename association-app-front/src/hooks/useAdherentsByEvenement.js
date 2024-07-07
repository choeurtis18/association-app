import { useState, useEffect } from 'react';

const useAdherentsByEvenement = (evenementId) => {
  const [adherents, setAdherents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdherents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5001/api/evenements/${evenementId}/adherents`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'An error occurred while fetching the adherents');
        }
        setAdherents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdherents();
  }, [evenementId]);

  return { adherents, loading, error };
};

export default useAdherentsByEvenement;
