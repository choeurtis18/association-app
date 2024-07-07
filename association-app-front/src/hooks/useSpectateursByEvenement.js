import { useState, useEffect } from 'react';

const useSpectateursByEvenement = (evenementId) => {
  const [spectateurs, setSpectateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpectateurs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5001/api/evenements/${evenementId}/spectateurs`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'An error occurred while fetching the spectateurs');
        }
        setSpectateurs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpectateurs();
  }, [evenementId]);

  return { spectateurs, loading, error };
};

export default useSpectateursByEvenement;
