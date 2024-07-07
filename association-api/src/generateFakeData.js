const { faker } = require('@faker-js/faker');
const pool = require('./db');
const bcrypt = require('bcryptjs');

const clearDatabase = async () => {
  try {
    await pool.query('DELETE FROM EvenementParticipants');
    await pool.query('DELETE FROM EvenementSpectateurs');
    await pool.query('DELETE FROM PersonneTierce');
    await pool.query('DELETE FROM Evenement');
    await pool.query('DELETE FROM Salle');
    await pool.query('DELETE FROM Adherent');
    await pool.query('DELETE FROM Administrateur');
    console.log('Database cleared.');
  } catch (err) {
    console.error('Error clearing database:', err);
  }
};

const generateAdherents = async (num) => {
  const adherents = [];
  for (let i = 0; i < num; i++) {
    const nom = faker.person.lastName();
    const prenom = faker.person.firstName();
    const mail = faker.internet.email();
    const mot_de_passe = await bcrypt.hash('password', 10);
    const nom_parent = faker.person.lastName();
    const age = faker.date.past({ years: 10, refDate: '2002-01-01' }).toISOString().split('T')[0];
    const cotisationpayee = faker.datatype.boolean();
    const licencier = faker.datatype.boolean();
    const categorie = faker.helpers.arrayElement(['classique', 'modern jazz', 'contemporain', 'hip-hop']);
    const niveau = faker.helpers.arrayElement(['éveil/initiation', 'débutant', 'intermédiaire', 'confirmé', 'avancé']);
    const categorie_age = calculateCategorieAge(age);

    const result = await pool.query(
      'INSERT INTO adherent (nom, prenom, mail, mot_de_passe, nom_parent, age, cotisationpayee, licencier, categorie, niveau, categorie_age) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [nom, prenom, mail, mot_de_passe, nom_parent, age, cotisationpayee, licencier, categorie, niveau, categorie_age]
    );
    adherents.push(result.rows[0]);
  }
  return adherents;
};

const generateAdministrateurs = async () => {
  const nom = faker.person.lastName();
  const prenom = faker.person.firstName();
  const mail = faker.internet.email();
  const mot_de_passe = await bcrypt.hash('adminpassword', 10);

  await pool.query(
    'INSERT INTO administrateur (nom, prenom, mail, mot_de_passe) VALUES ($1, $2, $3, $4)',
    [nom, prenom, mail, mot_de_passe]
  );
};

const generatePersonnesTierces = async (adherents) => {
  for (let adherent of adherents) {
    for (let i = 0; i < 2; i++) {
      const nom = faker.person.lastName();
      const prenom = faker.person.firstName();

      await pool.query(
        'INSERT INTO PersonneTierce (nom, prenom, adherent_id) VALUES ($1, $2, $3)',
        [nom, prenom, adherent.id]
      );
    }
  }
};

const generateEvenements = async (num, type) => {
  const evenements = [];
  for (let i = 0; i < num; i++) {
    const nom = faker.company.name();
    const description = faker.lorem.sentence();
    const date = faker.date.future().toISOString().split('T')[0];
    const salle = faker.location.streetAddress();
    const capacite = faker.number.int({ min: 10, max: 100 });
    const cout = faker.number.int({ min: 0, max: 100 });

    const result = await pool.query(
      'INSERT INTO evenement (nom, description, date, salle, type, capacite, cout) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nom, description, date, salle, type, capacite, cout]
    );

    evenements.push(result.rows[0]);
  }
  return evenements;
};

const assignAdherentsToEvenements = async (evenements, adherents) => {
  for (let evenement of evenements) {
    const shuffledAdherents = faker.helpers.shuffle(adherents);
    const numParticipants = faker.number.int({ min: 1, max: Math.min(10, adherents.length) });

    for (let i = 0; i < numParticipants; i++) {
      await pool.query(
        'INSERT INTO EvenementParticipants (evenement_id, adherent_id, presence) VALUES ($1, $2, $3)',
        [evenement.id, shuffledAdherents[i].id, faker.datatype.boolean()]
      );
    }
  }
};

const assignSpectateursToEvenements = async (evenements, spectateurs) => {
  for (let evenement of evenements) {
    const shuffledSpectateurs = faker.helpers.shuffle(spectateurs);
    const numSpectateurs = faker.number.int({ min: 1, max: Math.min(10, spectateurs.length) });

    for (let i = 0; i < numSpectateurs; i++) {
      await pool.query(
        'INSERT INTO EvenementSpectateurs (evenement_id, personne_tierce_id) VALUES ($1, $2)',
        [evenement.id, shuffledSpectateurs[i].id]
      );
    }
  }
};

const calculateCategorieAge = (age) => {
  const birthDate = new Date(age);
  const today = new Date();
  let ageYears = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    ageYears--;
  }

  if (ageYears < 12) return 'Enfant';
  if (ageYears >= 12 && ageYears < 18) return 'Adolescent';
  if (ageYears >= 18 && ageYears < 22) return 'Jeune Adulte';
  return 'Adulte';
};

const generateData = async () => {
  try {
    await clearDatabase();

    const adherents = await generateAdherents(50);
    await generateAdministrateurs();
    await generatePersonnesTierces(adherents);

    const evenementsSpectacle = await generateEvenements(2, 'spectacle');
    const evenementsCours = await generateEvenements(20, 'cours');
    const evenementsStage = await generateEvenements(8, 'stage');

    const allEvenements = [...evenementsSpectacle, ...evenementsCours, ...evenementsStage];

    await assignAdherentsToEvenements(allEvenements, adherents);

    const spectateurs = await pool.query('SELECT id FROM PersonneTierce');
    await assignSpectateursToEvenements(allEvenements, spectateurs.rows);

    console.log('Data generation completed.');
  } catch (err) {
    console.error('Error generating data:', err);
  } finally {
    pool.end();
  }
};

generateData();
