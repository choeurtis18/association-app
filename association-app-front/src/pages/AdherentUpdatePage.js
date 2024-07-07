import React from 'react';
import { useParams } from 'react-router-dom';
import useFetchAdherent from '../hooks/useFetchAdherent';
import useUpdateAdherent from '../hooks/useUpdateAdherent';

const AdherentUpdatePage = () => {
  const { id } = useParams();
  const { adherent, setAdherent, loading: loadingFetch, error: errorFetch } = useFetchAdherent(id);
  const { handleSubmit, loading: loadingUpdate, error: errorUpdate } = useUpdateAdherent(id, adherent);

  const calculateCategorieAge = (age) => {
    const birthDate = new Date(age);
    const today = new Date();
    const ageYears = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      ageYears--;
    }

    if (ageYears < 12) return 'Enfant';
    if (ageYears >= 12 && ageYears < 18) return 'Adolescent';
    if (ageYears >= 18 && ageYears < 22) return 'Jeune Adulte';
    return 'Adulte';
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return [year, month, day].join('-');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdherent((prevAdherent) => {
      const updatedAdherent = {
        ...prevAdherent,
        [name]: type === 'checkbox' ? checked : value,
      };
      if (name === 'age') {
        updatedAdherent.categorie_age = calculateCategorieAge(value);
      }
      return updatedAdherent;
    });
  };

  if (loadingFetch) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  if (errorFetch) {
    return <p className="text-center text-red-500">Erreur: {errorFetch}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mettre à jour l'Adhérent</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <label className="block">
            <span className="text-gray-700">Nom:</span>
            <input
              type="text"
              name="nom"
              value={adherent.nom}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Prénom:</span>
            <input
              type="text"
              name="prenom"
              value={adherent.prenom}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Email:</span>
            <input
              type="email"
              name="mail"
              value={adherent.mail}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Mot de passe:</span>
            <input
              type="password"
              name="mot_de_passe"
              value={adherent.mot_de_passe}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Nom Parent:</span>
            <input
              type="text"
              name="nom_parent"
              value={adherent.nom_parent}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Age:</span>
            <input
              type="date"
              name="age"
              value={formatDate(adherent.age)}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Cotisation Payée:</span>
            <input
              type="checkbox"
              name="cotisationpayee"
              checked={adherent.cotisationpayee}
              onChange={handleChange}
              className="mt-1 block"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Licencier:</span>
            <input
              type="checkbox"
              name="licencier"
              checked={adherent.licencier}
              onChange={handleChange}
              className="mt-1 block"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Catégorie:</span>
            <select
              name="categorie"
              value={adherent.categorie}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="classique">Classique</option>
              <option value="modern jazz">Modern Jazz</option>
              <option value="contemporain">Contemporain</option>
              <option value="hip-hop">Hip-Hop</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Niveau:</span>
            <select
              name="niveau"
              value={adherent.niveau}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="éveil/initiation">Éveil/Initiation</option>
              <option value="débutant">Débutant</option>
              <option value="intermédiaire">Intermédiaire</option>
              <option value="confirmé">Confirmé</option>
              <option value="avancé">Avancé</option>
            </select>
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

export default AdherentUpdatePage;
