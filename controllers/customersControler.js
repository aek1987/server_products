
import db from '../db/database.js';

export const getAllCustumers = (req, res) => {
    db.all('SELECT * FROM customers ', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
};



// Obtenir les produits de commande par id de commande
export const getproductorder = (req, res) => {
    const orderId = req.params.id; // Utilisez 'orderId' pour plus de clarté
    db.all('SELECT * FROM order_items WHERE orderId = ?', orderId, (err, rows) => { // Utilisez db.all pour récupérer plusieurs lignes
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération de la commande par id' });
        }
        if (rows.length === 0) { // Vérifiez si aucune ligne n'est renvoyée
            return res.status(404).json({ error: 'articles deCommande non trouvées' });
        }
        res.json(rows); // Renvoie un tableau d'articles de commande
    });
};

// Obtenir un les commande client par id 
export const getorderCustemuer = (req, res) => {
    const customerid = req.params.id;
    db.get('SELECT * FROM orders  WHERE customerId = ?', customerid, (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération du comande par id' });
        }
        if (!row) {
            return res.status(404).json({ error: 'commandes non trouvé' });
        }
        res.json(row);
    });
};
// Obtenir un  client par id 
export const getcustomerById = (req, res) => {
    const customerid = req.params.id;
    db.get('SELECT * FROM customers  WHERE id = ?', customerid, (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération du comande par id' });
        }
        if (!row) {
            return res.status(404).json({ error: 'customer non trouvé' });
        }
        res.json(row);
    });
};
// Obtenir un les commande client par id 
export const gettCustomerByTel = (req, res) => {
    const customerTel = req.params.phone;
    db.get('SELECT * FROM customers  WHERE phone = ?', customerTel, (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération du id de cleint' });
        }
        if (!row) {
            return res.status(404).json({ error: 'client  non trouvé  par phone:'+customerTel });
        }
        res.json(row);
    });
};