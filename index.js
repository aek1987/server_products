const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Connexion à la base de données SQLite
const dbPath = path.resolve(__dirname, 'base.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données', err);
  } else {
    console.log('Connecté à la base de données SQLite');
  }
});

// Route pour obtenir tous les produits
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products';  // Remplace "products" par le nom de ta table
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
