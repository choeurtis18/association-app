import { useState, useEffect } from 'react';

const useAdherent = (id) => {
  const [adherent, setAdherent] = useState(null);
  const [loadingAdherent, setLoading] = useState(true);
  const [errorAdherent, setError] = useState(null);

  useEffect(() => {
    const fetchAdherent = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5001/api/adherents/${id}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'An error occurred while fetching the adherent');
        }
        setAdherent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdherent();
  }, [id]);

  return { adherent, loadingAdherent, errorAdherent };
};

export default useAdherent;
