const pool = require('../db');

const getPersonnesTierces = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM PersonneTierce');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPersonneTierce = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM PersonneTierce WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'PersonneTierce not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPersonneTierce = async (req, res) => {
  const { nom, prenom, adherent_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO PersonneTierce (nom, prenom, adherent_id) VALUES ($1, $2, $3) RETURNING *',
      [nom, prenom, adherent_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePersonneTierce = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, adherent_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE PersonneTierce SET nom = $1, prenom = $2, adherent_id = $3 WHERE id = $4 RETURNING *',
      [nom, prenom, adherent_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePersonneTierce = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM PersonneTierce WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const inscrirePersonneTierce = async (req, res) => {
  const { personne_tierce_id, evenement_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO EvenementSpectateurs (evenement_id, personne_tierce_id) VALUES ($1, $2) RETURNING *',
      [evenement_id, personne_tierce_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPersonnesTierces,
  getPersonneTierce,
  createPersonneTierce,
  updatePersonneTierce,
  deletePersonneTierce,
  inscrirePersonneTierce
};
