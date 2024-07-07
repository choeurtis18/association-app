import React, { useState } from 'react';
import useAdherents from '../hooks/useAdherents';
import { Link } from 'react-router-dom';

const AdherentsPage = () => {
  const { adherents, loading, error } = useAdherents();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('');
  const [filterNiveau, setFilterNiveau] = useState('');

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/adherents/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete adherent');
      }
      window.location.reload(); // Refresh page to reflect changes
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const filteredAdherents = adherents.filter(adherent => {
    return (
      adherent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adherent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adherent.mail.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (filterCategorie === '' || adherent.categorie === filterCategorie) &&
    (filterNiveau === '' || adherent.niveau === filterNiveau)
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Adherents</h1>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 mr-2"
        />
        <select 
          value={filterCategorie} 
          onChange={(e) => setFilterCategorie(e.target.value)}
          className="border rounded p-2 mr-2"
        >
          <option value="">All Categories</option>
          <option value="classique">Classique</option>
          <option value="modern jazz">Modern Jazz</option>
          <option value="contemporain">Contemporain</option>
          <option value="hip-hop">Hip-Hop</option>
        </select>
        <select 
          value={filterNiveau} 
          onChange={(e) => setFilterNiveau(e.target.value)}
          className="border rounded p-2 mr-2"
        >
          <option value="">All Levels</option>
          <option value="éveil/initiation">Éveil/Initiation</option>
          <option value="débutant">Débutant</option>
          <option value="intermédiaire">Intermédiaire</option>
          <option value="confirmé">Confirmé</option>
          <option value="avancé">Avancé</option>
        </select>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nom</th>
            <th className="py-2 px-4 border-b">Prénom</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdherents.map((adherent) => (
            <tr key={adherent.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{adherent.id}</td>
              <td className="py-2 px-4 border-b">{adherent.nom}</td>
              <td className="py-2 px-4 border-b">{adherent.prenom}</td>
              <td className="py-2 px-4 border-b">{adherent.mail}</td>
              <td className="py-2 px-4 border-b">
                <Link to={`/adherents/${adherent.id}`} className="text-blue-500 hover:underline mr-2">View</Link>
                <button 
                  onClick={() => handleDelete(adherent.id)} 
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdherentsPage;
