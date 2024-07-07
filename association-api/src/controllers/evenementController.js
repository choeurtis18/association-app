const pool = require('../db');

const getEvenements = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Evenement');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEvenement = async (req, res) => {
  const { id } = req.params;
  try {
    const evenementResult = await pool.query('SELECT * FROM Evenement WHERE id = $1', [id]);
    if (evenementResult.rows.length === 0) {
      return res.status(404).json({ error: 'Evenement not found' });
    }

    const participantsResult = await pool.query('SELECT * FROM EvenementParticipants WHERE evenement_id = $1', [id]);
    const spectateursResult = await pool.query('SELECT * FROM EvenementSpectateurs WHERE evenement_id = $1', [id]);

    const evenement = evenementResult.rows[0];
    evenement.participants = participantsResult.rows;
    evenement.spectateurs = spectateursResult.rows;

    res.json(evenement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAdherentsByEvenement = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT adherent.* FROM adherent JOIN EvenementParticipants ON adherent.id = EvenementParticipants.adherent_id WHERE EvenementParticipants.evenement_id = $1',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSpectateursByEvenement = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT PersonneTierce.* FROM PersonneTierce JOIN EvenementSpectateurs ON PersonneTierce.id = EvenementSpectateurs.personne_tierce_id WHERE EvenementSpectateurs.evenement_id = $1',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEvenementByType = async (req, res) => {
  const { type } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Evenement WHERE type = $1', [type]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEvenement = async (req, res) => {
  const { nom, description, date, salle, type, capacite, cout } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Evenement (nom, description, date, salle, type, capacite, cout) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nom, description, date, salle, type, capacite, cout]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEvenement = async (req, res) => {
  const { id } = req.params;
  const { nom, description, date, salle, type, capacite, cout } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Evenement SET nom = $1, description = $2, date = $3, salle = $4, type = $5, capacite = $6, cout = $7 WHERE id = $8 RETURNING *',
      [nom, description, date, salle, type, capacite, cout, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEvenement = async (req, res) => {
  const { id } = req.params;
  try {
    // Supprimer les enregistrements liés dans EvenementParticipants
    await pool.query('DELETE FROM EvenementParticipants WHERE evenement_id = $1', [id]);

    // Supprimer les enregistrements liés dans EvenementSpectateurs
    await pool.query('DELETE FROM EvenementSpectateurs WHERE evenement_id = $1', [id]);

    // Supprimer l'événement
    await pool.query('DELETE FROM Evenement WHERE id = $1', [id]);

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getParticipantsByEvenement = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT adherent.* FROM adherent JOIN EvenementParticipants ON adherent.id = EvenementParticipants.adherent_id WHERE EvenementParticipants.evenement_id = $1',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getEvenements,
  getEvenement,
  getAdherentsByEvenement,
  getSpectateursByEvenement,
  getEvenementByType,
  createEvenement,
  updateEvenement,
  deleteEvenement,
  getParticipantsByEvenement
};
