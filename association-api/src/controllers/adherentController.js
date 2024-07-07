const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAdherents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM adherent');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAdherent = async (req, res) => {
  const { nom, prenom, mail, mot_de_passe, nom_parent, age, cotisationpayee, licencier, categorie, niveau, categorie_age } = req.body;
  const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
  try {
    const result = await pool.query('INSERT INTO adherent (nom, prenom, mail, mot_de_passe, nom_parent, age, cotisationpayee, licencier, categorie, niveau, categorie_age) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *', [nom, prenom, mail, hashedPassword, nom_parent, age, cotisationpayee, licencier, categorie, niveau, categorie_age]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAdherent = async (req, res) => {
  const { id } = req.params;
  try {
    const adherentResult = await pool.query('SELECT * FROM adherent WHERE id = $1', [id]);
    if (adherentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Adherent not found' });
    }

    const personnesTiercesResult = await pool.query('SELECT * FROM PersonneTierce WHERE adherent_id = $1', [id]);

    const adherent = adherentResult.rows[0];
    adherent.personnesTierces = personnesTiercesResult.rows;

    res.json(adherent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAdherent = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, mail, mot_de_passe, nom_parent, age, cotisationpayee, licencier, categorie, niveau, categorie_age } = req.body;
  const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
  try {
    const result = await pool.query('UPDATE adherent SET nom = $1, prenom = $2, mail = $3, mot_de_passe = $4, nom_parent = $5, age = $6, cotisationpayee = $7, licencier = $8, categorie = $9, niveau = $10, categorie_age = $11 WHERE id = $12 RETURNING *', [nom, prenom, mail, hashedPassword, nom_parent, age, cotisationpayee, licencier, categorie, niveau, categorie_age, id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAdherent = async (req, res) => {
  const { id } = req.params;
  try {
    // Supprimer les enregistrements liés dans PersonneTierce
    await pool.query('DELETE FROM PersonneTierce WHERE adherent_id = $1', [id]);

    // Supprimer les enregistrements liés dans EvenementParticipants
    await pool.query('DELETE FROM EvenementParticipants WHERE adherent_id = $1', [id]);

    // Supprimer l'adhérent
    await pool.query('DELETE FROM adherent WHERE id = $1', [id]);

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const authenticateAdherent = async (req, res) => {
  const { mail, mot_de_passe } = req.body;
  try {
    const result = await pool.query('SELECT * FROM adherent WHERE mail = $1', [mail]);
    const adherent = result.rows[0];
    if (!adherent) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(mot_de_passe, adherent.mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ adherentId: adherent.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const inscrireEvenement = async (req, res) => {
  const { adherent_id, evenement_id, presence } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO EvenementParticipants (evenement_id, adherent_id, presence) VALUES ($1, $2, $3) RETURNING *',
      [evenement_id, adherent_id, presence]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEvenementsAdherent = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT e.* FROM EvenementParticipants ep JOIN evenement e ON ep.evenement_id = e.id WHERE ep.adherent_id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(200).json([]);
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const desinscrireEvenement = async (req, res) => {
  const { adherent_id, evenement_id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM EvenementParticipants WHERE evenement_id = $1 AND adherent_id = $2 RETURNING *',
      [evenement_id, adherent_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inscription non trouvée' });
    }
    res.status(200).json({ message: 'Désinscription réussie' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAdherents,
  createAdherent,
  getAdherent,
  updateAdherent,
  deleteAdherent,
  authenticateAdherent,
  inscrireEvenement,
  getEvenementsAdherent,
  desinscrireEvenement
};
