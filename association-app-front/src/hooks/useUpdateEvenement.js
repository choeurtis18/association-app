import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useUpdateEvenement = (id, evenement) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5001/api/evenements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(evenement)
      });
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
      navigate(`/evenements/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, error };
};

export default useUpdateEvenement;
