import { useState, useEffect } from 'react';

const useEvenement = (id) => {
  const [evenement, setEvenement] = useState(null);
  const [loadingEvenement, setLoading] = useState(true);
  const [errorEvenement, setError] = useState(null);

  useEffect(() => {
    const fetchEvenement = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5001/api/evenements/${id}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'An error occurred while fetching the event');
        }
        setEvenement(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvenement();
  }, [id]);

  return { evenement, loadingEvenement, errorEvenement  };
};

export default useEvenement;
