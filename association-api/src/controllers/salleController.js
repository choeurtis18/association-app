const pool = require('../db');

const getSalles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Salle');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSalleById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Salle WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Salle not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createSalle = async (req, res) => {
  const { nom, statut } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Salle (nom, statut) VALUES ($1, $2) RETURNING *',
      [nom, statut]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSalle = async (req, res) => {
  const { id } = req.params;
  const { nom, statut } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Salle SET nom = $1, statut = $2 WHERE id = $3 RETURNING *',
      [nom, statut, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSalle = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Salle WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getSalles,
  getSalleById,
  createSalle,
  updateSalle,
  deleteSalle,
};
