// orderController.js
import db from '../db/database.js';; // Le chemin d'accès à votre fichier database.ts

// Récupérer toutes les commandes
export const getAllOrders = (req, res) => {
    db.query('SELECT * FROM orders', [], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
        }
        res.json(result.rows);  // Utilisation de `result.rows` avec PostgreSQL
    });
};

// Ajouter une commande
export const addOrder = (req, res) => {
    const { name, phone, wilaya, commune, address, totalPrice, status, orderDate, panier } = req.body;

    if (!name || !phone || !wilaya || !commune || !address || !totalPrice || !status || !orderDate || !panier) {
        return res.status(400).json({ error: 'Données manquantes' });
    }

    // Vérifier si le client existe déjà par numéro de téléphone
    db.query('SELECT * FROM customers WHERE phone = $1', [phone], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la recherche du client' });
        }

        const customer = result.rows[0];

        if (customer) {
            // Si le client existe, utiliser son ID pour enregistrer la commande
            const customerId = customer.id;
            saveOrder(customerId);
        } else {
            // Si le client n'existe pas, créer un nouveau client
            db.query(
                'INSERT INTO customers (name, phone, wilaya, commune, address) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [name, phone, wilaya, commune, address],
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Erreur lors de l\'ajout du client' });
                    }
                    const customerId = result.rows[0].id;
                    saveOrder(customerId);
                }
            );
        }
    });

    // Fonction pour sauvegarder la commande
    function saveOrder(customerId) {
        db.query(
            'INSERT INTO orders (customerId, totalPrice, status, orderDate) VALUES ($1, $2, $3, $4) RETURNING id',
            [customerId, totalPrice, status, orderDate],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Erreur lors de l\'ajout de la commande' });
                }

                const orderId = result.rows[0].id;

                // Insertion des produits du panier dans la table 'order_items'
                const insertPanierStmt = 'INSERT INTO order_items (orderId, productId, quantity) VALUES ($1, $2, $3)';
                panier.forEach(item => {
                    db.query(insertPanierStmt, [orderId, item.product.id, item.quantity], (err) => {
                        if (err) {
                            console.error('Erreur lors de l\'ajout des articles dans la commande', err);
                        }
                    });
                });

                res.status(201).json({ orderId, message: 'Commande validée avec succès',commandestate:"succes"});
            }
        );
    }
};

// Récupérer les items d'une commande par ID
export const getOrderItemsById = (req, res) => {
    const orderId = req.params.id;

    db.query('SELECT * FROM order_items WHERE orderId = $1', [orderId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des items de commande' });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        res.json(result.rows);  // Utilisation de `result.rows` avec PostgreSQL
    });
};

// Suppression d'une commande
export const deleteOrder = (req, res) => {
    const orderId = req.params.id;

    db.query('DELETE FROM orders WHERE id = $1', [orderId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression de la commande' });
        }
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        res.status(204).send();  // Commande supprimée
    });
};

// Suppression des items d'une commande
export const deleteOrderItems = (req, res) => {
    const orderId = req.params.id;

    db.query('DELETE FROM order_items WHERE orderId = $1', [orderId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression des items de la commande' });
        }
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Items de la commande non trouvés' });
        }
        res.status(204).send();  // Items supprimés
    });
};
