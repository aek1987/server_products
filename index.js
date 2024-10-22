const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Chemin vers le fichier db.json
const dbPath = path.resolve(__dirname, 'db.json');

// Middleware pour servir les fichiers statiques
app.use(express.static('public')); // si vous avez des fichiers statiques
// Middleware pour analyser les requêtes JSON
app.use(express.json());
// Route pour obtenir tous les produits
// Route pour obtenir tous les produits
app.get('/api/products', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la lecture du fichier' });
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData.products); // Renvoie la liste des produits
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

// Route pour ajouter un nouveau produit
app.post('/api/products', (req, res) => {
  const newProduct = req.body; // Assurez-vous d'envoyer le corps de la requête au format JSON
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la lecture du fichier' });
    }
    const jsonData = JSON.parse(data);
    // Ajoutez un nouvel ID
    newProduct.id = (jsonData.products.length + 1).toString();
    jsonData.products.push(newProduct);
    
    fs.writeFile(dbPath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de l\'écriture du fichier' });
      }
      res.status(201).json(newProduct); // Renvoie le nouveau produit
    });
  });
});