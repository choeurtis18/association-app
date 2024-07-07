const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAdministrateurs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM administrateur');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAdministrateur = async (req, res) => {
  const { nom, prenom, mail, mot_de_passe } = req.body;
  const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
  try {
    const result = await pool.query('INSERT INTO administrateur (nom, prenom, mail, mot_de_passe) VALUES ($1, $2, $3, $4) RETURNING *', [nom, prenom, mail, hashedPassword]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAdministrateur = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM administrateur WHERE id = $1', [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAdministrateur = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, mail, mot_de_passe } = req.body;
  const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
  try {
    const result = await pool.query('UPDATE administrateur SET nom = $1, prenom = $2, mail = $3, mot_de_passe = $4 WHERE id = $5 RETURNING *', [nom, prenom, mail, hashedPassword, id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAdministrateur = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM administrateur WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const authenticateAdministrateur = async (req, res) => {
  const { mail, mot_de_passe } = req.body;
  try {
    const result = await pool.query('SELECT * FROM administrateur WHERE mail = $1', [mail]);
    const administrateur = result.rows[0];
    if (!administrateur) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(mot_de_passe, administrateur.mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ administrateurId: administrateur.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAdministrateurs,
  createAdministrateur,
  getAdministrateur,
  updateAdministrateur,
  deleteAdministrateur,
  authenticateAdministrateur,
};
