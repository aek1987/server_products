import db from '../db/database.js';

// Récupérer tous les produits
export const getAllProducts = (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
};

// Ajouter un nouveau produit
export const addProduct = (req, res) => {
    const { name, description, price, image, category } = req.body; // Assurez-vous que ces champs existent
    db.run('INSERT INTO products (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)', 
        [name, description, price, image, category], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID, name, description, price, image, category });
        }
    });
};

// Supprimer un produit
export const deleteProduct = (req, res) => {
    const productId = req.params.id;
    db.run('DELETE FROM products WHERE id = ?', productId, function(err) {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Produit non trouvé id =' + productId });
        }
        res.status(204).send(); // Produit supprimé
    });
};

// Obtenir un produit spécifique par ID
export const getProductById = (req, res) => {
    const productId = req.params.id;
    db.get('SELECT * FROM products WHERE id = ?', productId, (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json(row);
    });
};
