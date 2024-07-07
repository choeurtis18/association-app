const express = require('express');
const router = express.Router();
const { getAdherents, createAdherent, updateAdherent, deleteAdherent, authenticateAdherent, getAdherent, inscrireEvenement, getEvenementsAdherent, desinscrireEvenement } = require('./controllers/adherentController');
const { getAdministrateurs, createAdministrateur, updateAdministrateur, deleteAdministrateur, authenticateAdministrateur } = require('./controllers/administrateurController');
const { getPersonnesTierces, getPersonneTierce, createPersonneTierce, updatePersonneTierce, deletePersonneTierce, inscrirePersonneTierce } = require('./controllers/personneTierceController');
const { getEvenements, getEvenement, getAdherentsByEvenement, getSpectateursByEvenement, getEvenementByType, createEvenement, updateEvenement, deleteEvenement, getParticipantsByEvenement } = require('./controllers/evenementController');
const { getSalles, getSalleById, createSalle, updateSalle, deleteSalle } = require('./controllers/salleController');

// Routes pour les adhérents
router.get('/adherents', getAdherents);
router.post('/adherents', createAdherent);
router.put('/adherents/:id', updateAdherent);
router.delete('/adherents/:id', deleteAdherent);
router.post('/adherent/auth', authenticateAdherent);
router.get('/adherents/:id', getAdherent);
router.post('/adherents/inscrire', inscrireEvenement);
router.delete('/adherents/:adherent_id/evenements/:evenement_id', desinscrireEvenement);
router.get('/adherents/:id/evenements', getEvenementsAdherent);

// Routes pour les administrateurs
router.get('/administrateurs', getAdministrateurs);
router.post('/administrateurs', createAdministrateur);
router.put('/administrateurs/:id', updateAdministrateur);
router.delete('/administrateurs/:id', deleteAdministrateur);
router.post('/administrateur/auth', authenticateAdministrateur);

// Routes pour les personnes tierces
router.get('/personnes_tierces', getPersonnesTierces);
router.get('/personnes_tierces/:id', getPersonneTierce);
router.post('/personnes_tierces', createPersonneTierce);
router.put('/personnes_tierces/:id', updatePersonneTierce);
router.delete('/personnes_tierces/:id', deletePersonneTierce);
router.post('/personnes_tierces/inscrire', inscrirePersonneTierce);

// Routes pour les événements
router.get('/evenements', getEvenements);
router.get('/evenements/:id', getEvenement);
router.get('/evenements/:id/adherents', getAdherentsByEvenement);
router.get('/evenements/:id/spectateurs', getSpectateursByEvenement);
router.get('/evenements/:id/participants', getParticipantsByEvenement);
router.get('/evenements/type/:type', getEvenementByType);
router.post('/evenements', createEvenement);
router.put('/evenements/:id', updateEvenement);
router.delete('/evenements/:id', deleteEvenement);

// Routes pour les salles
router.get('/salles', getSalles);
router.get('/salles/:id', getSalleById);
router.post('/salles', createSalle);
router.put('/salles/:id', updateSalle);
router.delete('/salles/:id', deleteSalle);

module.exports = router;
