import { useState, useEffect } from 'react';

const useFetchEvenement = (id) => {
  const [evenement, setEvenement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return { evenement, setEvenement, loading, error };
};

export default useFetchEvenement;
