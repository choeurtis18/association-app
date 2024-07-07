# Association App

## Description
Association App est une application web de gestion pour une association. Elle permet de gérer les adhérents, les événements, les salles et les administrateurs. Les adhérents peuvent s'inscrire et se désinscrire des événements, et les administrateurs peuvent gérer les adhérents, les événements, les salles et les personnes tierces.

## Table des matières
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Pages](#pages)
- [Génération de Données Factices](#génération-de-données-factices)

## Installation

1. Clonez le repository :
    ```sh
    git clone https://github.com/choeurtis18/association-app.git
    ```

2. Accédez au dossier du projet :
    ```sh
    cd association-app
    ```

3. Installez les dépendances pour le serveur backend :
    ```sh
    cd association-api
    npm install
    ```

4. Installez les dépendances pour le client frontend :
    ```sh
    cd ../association-client
    npm install
    ```

## Usage

### Démarrer le serveur backend
1. Configurez votre base de données PostgreSQL dans `association-api/db.js`.
    ```sh
    sudo -u postgres psql
    psql -U postgres
    ```

    ```sql
    CREATE DATABASE my_association_db;
    CREATE USER myuser WITH PASSWORD 'password';
    GRANT ALL PRIVILEGES ON DATABASE my_association_db TO myuser;

    CREATE TABLE administrateur (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(50),
        prenom VARCHAR(50),
        mail VARCHAR(100) UNIQUE,
        mot_de_passe VARCHAR(255)
    );

    CREATE TABLE adherent (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(50),
        prenom VARCHAR(50),
        mail VARCHAR(100) UNIQUE,
        mot_de_passe VARCHAR(255),
        nom_parent VARCHAR(50),
        age DATE,
        cotisationpayee BOOLEAN,
        licencier BOOLEAN,
        categorie VARCHAR(50),
        niveau VARCHAR(50),
        categorie_age VARCHAR(50)
    );

    CREATE TABLE personnetierce (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(50),
        prenom VARCHAR(50),
        adherent_id INTEGER REFERENCES adherent(id) ON DELETE CASCADE
    );

    CREATE TABLE salle (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(50),
        adresse VARCHAR(255),
        capacite INTEGER
    );

    CREATE TABLE evenement (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(50),
        description TEXT,
        date DATE,
        salle VARCHAR(255),
        type VARCHAR(50),
        capacite INTEGER,
        cout INTEGER
    );

    CREATE TABLE evenementparticipants (
        evenement_id INTEGER REFERENCES evenement(id) ON DELETE CASCADE,
        adherent_id INTEGER REFERENCES adherent(id) ON DELETE CASCADE,
        presence BOOLEAN,
        PRIMARY KEY (evenement_id, adherent_id)
    );

    CREATE TABLE evenementspectateurs (
        evenement_id INTEGER REFERENCES evenement(id) ON DELETE CASCADE,
        personne_tierce_id INTEGER REFERENCES personnetierce(id) ON DELETE CASCADE,
        PRIMARY KEY (evenement_id, personne_tierce_id)
    );
    ```

2. Démarrez le serveur backend :
    ```sh
    cd association-api
    npm start
    ```

### Démarrer le client frontend
1. Démarrez l'application React :
    ```sh
    cd ../association-client
    npm start
    ```

2. Ouvrez votre navigateur à l'adresse suivante :
    ```
    http://localhost:3000
    ```

## API

### Routes

#### Adhérents
- `GET /api/adherents` : Obtenir la liste des adhérents.
- `POST /api/adherents` : Créer un nouvel adhérent.
- `GET /api/adherents/:id` : Obtenir les détails d'un adhérent.
- `PUT /api/adherents/:id` : Mettre à jour un adhérent.
- `DELETE /api/adherents/:id` : Supprimer un adhérent.
- `POST /api/adherents/inscrire` : Inscrire un adhérent à un événement.
- `DELETE /api/adherents/:adherent_id/evenements/:evenement_id` : Désinscrire un adhérent d'un événement.
- `GET /api/adherents/:id/evenements` : Obtenir les événements d'un adhérent.

#### Administrateurs
- `GET /api/administrateurs` : Obtenir la liste des administrateurs.
- `POST /api/administrateurs` : Créer un nouvel administrateur.
- `PUT /api/administrateurs/:id` : Mettre à jour un administrateur.
- `DELETE /api/administrateurs/:id` : Supprimer un administrateur.
- `POST /api/administrateur/auth` : Authentifier un administrateur.

#### Personnes Tierces
- `GET /api/personnes_tierces` : Obtenir la liste des personnes tierces.
- `POST /api/personnes_tierces` : Créer une nouvelle personne tierce.
- `PUT /api/personnes_tierces/:id` : Mettre à jour une personne tierce.
- `DELETE /api/personnes_tierces/:id` : Supprimer une personne tierce.
- `POST /api/personnes_tierces/inscrire` : Inscrire une personne tierce à un événement.

#### Événements
- `GET /api/evenements` : Obtenir la liste des événements.
- `POST /api/evenements` : Créer un nouvel événement.
- `GET /api/evenements/:id` : Obtenir les détails d'un événement.
- `PUT /api/evenements/:id` : Mettre à jour un événement.
- `DELETE /api/evenements/:id` : Supprimer un événement.
- `GET /api/evenements/:id/adherents` : Obtenir les adhérents d'un événement.
- `GET /api/evenements/:id/spectateurs` : Obtenir les spectateurs d'un événement.
- `GET /api/evenements/type/:type` : Obtenir les événements par type.

#### Salles
- `GET /api/salles` : Obtenir la liste des salles.
- `POST /api/salles` : Créer une nouvelle salle.
- `GET /api/salles/:id` : Obtenir les détails d'une salle.
- `PUT /api/salles/:id` : Mettre à jour une salle.
- `DELETE /api/salles/:id` : Supprimer une salle.

## Pages

### AdherentsPage
Affiche la liste des adhérents avec des options pour rechercher, filtrer, afficher et supprimer des adhérents.

### EvenementsPage
Affiche la liste des événements avec des options pour rechercher, filtrer, afficher et supprimer des événements.

### AdherentPage
Affiche les détails d'un adhérent spécifique et les événements auxquels il est inscrit.

### EvenementPage
Affiche les détails d'un événement spécifique et les participants à cet événement.

### DashboardPage
Affiche un aperçu des adhérents, des événements, des statistiques sur les événements complets et les profits totaux.

## Génération de Données Factices

Pour générer des données factices pour tester l'application, exécutez le script `generateFakeData.js` :

```sh
node generateFakeData.js
