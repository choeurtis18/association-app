import { useState, useEffect } from 'react';

const useEvenements = () => {
  const [evenements, setEvenements] = useState([]);
  const [loadingEvenements, setLoading] = useState(true);
  const [errorEvenements, setError] = useState(null);

  useEffect(() => {
    const fetchEvenements = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/evenements');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'An error occurred while fetching evenements');
        }
        setEvenements(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvenements();
  }, []);

  return { evenements, loadingEvenements, errorEvenements };
};

export default useEvenements;
