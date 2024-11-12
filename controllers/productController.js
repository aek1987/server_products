
import db from '../db/database.js'; // Le chemin d'accès à votre fichier database.ts

// Récupérer tous les produits
export const getAllProducts = (req, res) => {
    db.query('SELECT * FROM products', (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result.rows);
    });
};

// Ajouter un nouveau produit
export const addProduct = (req, res) => {
    const { name, description, price, image, category, ecran, processor, os,  storage, ram, battery, wirelessCharging, color, dualSim } = req.body;
    
    const query = `
        INSERT INTO products 
        (name, description, price, image, category, ecran,processor,os,storage, ram, battery, wirelessCharging, color, dualSim)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 ,$13 ,$14) 
        RETURNING id, name, description, price, image, category;
    `;
    const values = [name, description, price, image, category, ecran, processor, os, storage, ram, battery, wirelessCharging, color, dualSim];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(result.rows[0]); // Envoie le produit ajouté
    });
};

// Supprimer un produit
export const deleteProduct = (req, res) => {
    const productId = req.params.id;

    db.query('DELETE FROM products WHERE id = $1', [productId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
        }
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Produit non trouvé id =' + productId });
        }
        res.status(204).send(); // Produit supprimé
    });
};

// Obtenir un produit spécifique par ID
export const getProductById = (req, res) => {
    const productId = req.params.id;

    db.query('SELECT * FROM products WHERE id = $1', [productId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json(result.rows[0]);
    });
};
