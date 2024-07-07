import React, { useState } from 'react';
import useEvenements from '../hooks/useEvenements';
import { Link } from 'react-router-dom';

const EvenementsPage = () => {
  const { evenements, loading, error } = useEvenements();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/evenements/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
      window.location.reload(); // Refresh page to reflect changes
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const filteredEvenements = evenements.filter(evenement => {
    return (
      (evenement.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evenement.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === '' || evenement.type === filterType)
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Événements</h1>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 mr-2"
        />
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Types</option>
          <option value="stage">Stage</option>
          <option value="spectacle">Spectacle</option>
          <option value="cours">Cours</option>
        </select>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nom</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Salle</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Capacité</th>
            <th className="py-2 px-4 border-b">Coût</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvenements.map((evenement) => (
            <tr key={evenement.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{evenement.id}</td>
              <td className="py-2 px-4 border-b">{evenement.nom}</td>
              <td className="py-2 px-4 border-b">{evenement.description}</td>
              <td className="py-2 px-4 border-b">{new Date(evenement.date).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{evenement.salle}</td>
              <td className="py-2 px-4 border-b">{evenement.type}</td>
              <td className="py-2 px-4 border-b">{evenement.capacite}</td>
              <td className="py-2 px-4 border-b">{evenement.cout}</td>
              <td className="py-2 px-4 border-b">
                <Link to={`/evenements/${evenement.id}`} className="text-blue-500 hover:underline mr-2">View</Link>
                <button 
                  onClick={() => handleDelete(evenement.id)} 
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

export default EvenementsPage;
