import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useUpdateAdherent = (id, adherent) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5001/api/adherents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adherent),
      });
      if (!response.ok) {
        throw new Error('Failed to update adherent');
      }
      navigate(`/adherents/${id}`);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, error };
};

export default useUpdateAdherent;
