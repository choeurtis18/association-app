import { useState, useEffect } from 'react';

const useAdherents = () => {
  const [adherents, setAdherents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdherents = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/adherents');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'An error occurred while fetching adherents');
        }
        setAdherents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdherents();
  }, []);

  return { adherents, loading, error };
};

export default useAdherents;
