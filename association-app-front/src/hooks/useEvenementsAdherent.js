import { useState, useEffect } from 'react';

const useEvenementsAdherent = (id) => {
  const [evenementsAdherent, setEvenements] = useState([]);
  const [loadingEvenementsAdherent, setLoading] = useState(true);
  const [errorEvenementsAdherent, setError] = useState(null);

  useEffect(() => {
    const fetchEvenements = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5001/api/adherents/${id}/evenements`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'An error occurred while fetching the events');
        }
        setEvenements(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvenements();
  }, [id]);

  return { evenementsAdherent, loadingEvenementsAdherent, errorEvenementsAdherent };
};

export default useEvenementsAdherent;
