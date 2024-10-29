const express = require('express');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const dbPath = path.resolve(__dirname, 'db.json');
//const db = new sqlite3.Database('db/database.db');

app.use(express.json());
app.use(cors()); // Active CORS pour toutes les routes
// Créer les tables si elles n'existent pas
const db = new sqlite3.Database('db/database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données', err);
    } else {
        console.log('Base de données ouverte avec succès');
    }
});
// Créer les tables si elles n'existent pas
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    category TEXT
)`);
   db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER ,
        customerId INTEGER PRIMARY KEY AUTOINCREMENT,
        totalPrice REAL,
        status TEXT,
        orderDate TEXT,
        FOREIGN KEY(customerId) REFERENCES customers(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEX,
        wilaya TEXT,
        commune TEXT,
        address text
        
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,   -- Identifiant unique de la ligne
    orderId INTEGER,                         -- Référence à l'ID de la commande
    productId INTEGER,                       -- Référence à l'ID du produit
    quantity INTEGER NOT NULL,               -- Quantité du produit commandé
    FOREIGN KEY (orderId) REFERENCES orders(id),    -- Lien avec la table des commandes
    FOREIGN KEY (productId) REFERENCES products(id) -- Lien avec la table des produits
  )`);
});



// Insérer les produits depuis le fichier JSON si la table est vide
 /*   fs.readFile(dbPath, 'utf8', (err, data) => {
  if (err) {
      console.error('Erreur lors de la lecture du fichier JSON', err);
      return;  }
  
  const jsonData = JSON.parse(data);
  const insertStmt = db.prepare('INSERT INTO products (id, name, description, price, image, category) VALUES (?, ?, ?, ?, ?, ?)');

  jsonData.products.forEach(product => {
      insertStmt.run(product.id, product.name, product.description, product.price, product.image, product.category, function(err) {
          if (err) {
              console.error('Erreur lors de l\'insertion du produit:', err);
          } else {
             console.log(`Produit ajouté avec succès: ${product.name}`);
          }
      });
  });

  insertStmt.finalize(); // Finaliser la déclaration préparée
});
*/
// Route pour obtenir tous les produits
app.get('/api/allproducts', (req, res) => {
  console.log("Requête pour tous les produits reçue");
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
        }
        res.json(rows);
    });
});

// Route pour ajouter un nouveau produit
app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    db.run(`INSERT INTO products (id, name, description, price, image, category) VALUES (?, ?, ?, ?, ?, ?)`,
        [newProduct.id, newProduct.name, newProduct.description, newProduct.price, newProduct.image, newProduct.category],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de l\'ajout du produit' });
            }
            res.status(201).json(newProduct);
        });
});

// Route pour supprimer un produit
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  console.log(`Tentative de suppression du produit avec l'ID: ${productId}`);

  db.run('DELETE FROM products WHERE id = ?', productId, function(err) {
      if (err) {
          return res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
      }
      console.log('Nombre de produits supprimés:', this.changes); // Log number of changes
      if (this.changes === 0) {
          return res.status(404).json({ error: 'Produit non trouvé id ='+productId });
      }
      res.status(204).send(); // Produit supprimé
  });
});
// Route pour  un produit
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  console.log(`ID du produit demandé: ${productId}`);

  db.get('SELECT * FROM products WHERE id = ?', productId, (err, row) => {
      if (err) {
          return res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
      }
      if (!row) {
          return res.status(404).json({ error: 'Produit non trouvé' });
      }
      res.json(row);
  });
});

app.get('/api/produit_commandes/:id', (req, res) => {
    const orderId = req.params.id;
    console.log(`ID du produit commande: ${orderId}`);
  
    db.get('SELECT * FROM order_items WHERE orderId = ?', orderId, (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération du comande' });
        }
        if (!row) {
            return res.status(404).json({ error: 'comande non trouvé' });
        }
        res.json(row);
    });
  });




// Route pour obtenir tous les custumers
app.get('/api/client', (req, res) => {
    console.log("Requête pour tous les produits reçue");
      db.all('SELECT * FROM customers', [], (err, rows) => {
          if (err) {
              return res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
          }
          res.json(rows);
      });
  });

// Route pour obtenir tous les commande
app.get('/api/allorders', (req, res) => {
    console.log("Requête pour tous les produits reçue");
      db.all('SELECT * FROM orders', [], (err, rows) => {
          if (err) {
              return res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
          }
          res.json(rows);
      });
  });
/********* */
// Route pour ajouter une nouvelle commande
// Insertion des informations du client
app.post('/api/orders', (req, res) => {
     console.log("Requête pour une nouvelle commande");
    const { name, phone, wilaya, commune, address, totalPrice, status, orderDate, panier } = req.body;

    if (!name || !phone || !wilaya || !commune || !address || !totalPrice || !status || !orderDate || !panier) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!phone) missingFields.push('phone');
      if (!wilaya) missingFields.push('wilaya');
      if (!commune) missingFields.push('commune');
      if (!address) missingFields.push('address');
      if (!totalPrice) missingFields.push('totalPrice');
      if (!status) missingFields.push('status');
      if (!orderDate) missingFields.push('orderDate');
      if (!panier) missingFields.push('panier');
      
      return res.status(400).json({ error: 'Données manquantes: ' + missingFields.join(', ') });
  }
  

    // Insérer le client
    db.run(`INSERT INTO customers (name, phone, wilaya, commune, address) VALUES (?, ?, ?, ?, ?)`,    
        [name, phone, wilaya, commune, address],
        function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erreur lors de l\'ajout du client' });
            }

            const customerId = this.lastID; // ID du client nouvellement créé

            // Insérer la commande
            db.run(`INSERT INTO orders (customerId, totalPrice, status, orderDate) VALUES (?, ?, ?, ?)`,
                [customerId, totalPrice, status, orderDate],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: 'Erreur lors de l\'ajout de la commande' });
                    }

                    const orderId = this.lastID; // ID de la commande nouvellement créée

                    // Insérer les éléments du panier dans une table séparée
                    const insertPanierStmt = db.prepare('INSERT INTO order_items (orderId, productId, quantity) VALUES (?, ?, ?)');
                    panier.forEach(item => {
                        insertPanierStmt.run(orderId, item.product.id, item.quantity, (err) => {
                            if (err) {
                                console.error('Erreur lors de l\'insertion du produit dans le panier:', err);
                            }
                        });
                    });

                    insertPanierStmt.finalize();
                    res.status(201).json({ orderId, message: 'Commande ajoutée avec succès' });
                }
            );
        }
    );
});


// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.url}`);
      next();
  });
  
});
