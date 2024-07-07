import React from 'react';
import { useParams } from 'react-router-dom';
import useFetchEvenement from '../hooks/useFetchEvenement';
import useUpdateEvenement from '../hooks/useUpdateEvenement';

const EvenementUpdatePage = () => {
  const { id } = useParams();
  const { evenement, setEvenement, loading: loadingFetch, error: errorFetch } = useFetchEvenement(id);
  const { handleSubmit, loading: loadingUpdate, error: errorUpdate } = useUpdateEvenement(id, evenement);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvenement((prevEvenement) => ({
      ...prevEvenement,
      [name]: value,
    }));
  };

  if (loadingFetch) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  if (errorFetch) {
    return <p className="text-center text-red-500">Erreur: {errorFetch}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mettre à jour l'Événement</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <label className="block">
            <span className="text-gray-700">Nom:</span>
            <input
              type="text"
              name="nom"
              value={evenement.nom}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Description:</span>
            <textarea
              name="description"
              value={evenement.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Date:</span>
            <input
              type="date"
              name="date"
              value={evenement.date.split('T')[0]} // Convert to YYYY-MM-DD format
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Salle:</span>
            <input
              type="text"
              name="salle"
              value={evenement.salle}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Type:</span>
            <select
              name="type"
              value={evenement.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="stage">Stage</option>
              <option value="spectacle">Spectacle</option>
              <option value="cours">Cours</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Capacité:</span>
            <input
              type="number"
              name="capacite"
              value={evenement.capacite}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Coût:</span>
            <input
              type="number"
              name="cout"
              value={evenement.cout}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loadingUpdate ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </div>
        {errorUpdate && <p className="text-red-500 mt-4">{errorUpdate}</p>}
      </form>
    </div>
  );
};

export default EvenementUpdatePage;
