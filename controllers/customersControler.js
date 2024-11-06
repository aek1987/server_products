

import db from '../db/database.js';; // Le chemin d'accès à votre fichier database.ts

// Récupérer tous les clients
export const getAllCustomers = (req, res) => {
    db.query('SELECT * FROM customers', (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result.rows);
    });
};

// Obtenir les produits de commande par ID de commande
export const getProductOrder = (req, res) => {
    const orderId = req.params.id; // Utilisez 'orderId' pour plus de clarté
    db.query('SELECT * FROM order_items WHERE order_id = $1', [orderId], (err, result) => { // Utilisez db.query pour récupérer plusieurs lignes
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des articles de commande' });
        }
        if (result.rows.length === 0) { // Vérifiez si aucune ligne n'est renvoyée
            return res.status(404).json({ error: 'Articles de commande non trouvés' });
        }
        res.json(result.rows); // Renvoie un tableau d'articles de commande
    });
};

// Obtenir les commandes du client par ID
export const getOrderCustomer = (req, res) => {
    const customerId = req.params.id;
    db.query('SELECT * FROM orders WHERE customer_id = $1', [customerId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des commandes du client' })+err;
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'aucun Commandes non trouvées pour ce client' });
        }
        res.json(result.rows);
    });
};

// Obtenir un client par ID
export const getCustomerById = (req, res) => {
    const customerId = req.params.id;
    db.query('SELECT * FROM customers WHERE id = $1', [customerId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération du client' });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }
        res.json(result.rows[0]);
    });
};

// Obtenir un client par numéro de téléphone
export const getCustomerByTel = (req, res) => {
    const customerTel = req.params.phone;
    db.query('SELECT * FROM customers WHERE phone = $1', [customerTel], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération du client par téléphone' });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client non trouvé avec le téléphone ' + customerTel });
        }
        res.json(result.rows[0]);
    });
};
