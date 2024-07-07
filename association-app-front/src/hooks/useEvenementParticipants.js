import { useState, useEffect } from 'react';

const useEvenementParticipants = (evenementId) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/evenements/${evenementId}/participants`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'An error occurred while fetching participants');
        }
        setParticipants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [evenementId]);

  return { participants, loading, error };
};

export default useEvenementParticipants;
