import { useState, useEffect } from 'react';

const useFetchAdherent = (id) => {
  const [adherent, setAdherent] = useState({
    nom: '',
    prenom: '',
    mail: '',
    mot_de_passe: '',
    nom_parent: '',
    age: '',
    cotisationpayee: false,
    licencier: false,
    categorie: '',
    niveau: '',
    categorie_age: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdherent = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/adherents/${id}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'An error occurred while fetching the adherent');
        }
        setAdherent(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdherent();
  }, [id]);

  return { adherent, setAdherent, loading, error };
};

export default useFetchAdherent;
