// orderController.ts
import db from '../db/database.js';



export const getAllOrders = (req, res) => {
    db.all('SELECT * FROM orders', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
        }
        res.json(rows);
    });
};

// Assurez-vous d'exporter toutes les méthodes que vous utilisez dans vos routes


// Ajouter une commande

// Ajouter une commande
export const addOrder = (req, res) => {
    const { name, phone, wilaya, commune, address, totalPrice, status, orderDate, panier } = req.body;

    if (!name || !phone || !wilaya || !commune || !address || !totalPrice || !status || !orderDate || !panier) {
        return res.status(400).json({ error: 'Données manquantes' });
    }

    // Vérifier si le client existe déjà par numéro de téléphone
    db.get('SELECT * FROM customers WHERE phone = ?', [phone], (err, customer) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la recherche du client' });
        }

        if (customer) {
            // Si le client existe, utiliser son ID pour enregistrer la commande
            const customerId = customer.id;
            saveOrder(customerId);
        } else {
            // Si le client n'existe pas, créer un nouveau client
            db.run(`INSERT INTO customers (name, phone, wilaya, commune, address) VALUES (?, ?, ?, ?, ?)`,
                [name, phone, wilaya, commune, address],
                function(err) {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Erreur lors de l\'ajout du client' });
                    }

                    const customerId = this.lastID;
                    saveOrder(customerId); // Appeler la fonction pour sauvegarder la commande après avoir ajouté le client
                });
        }
    });

    // Fonction pour sauvegarder la commande
    function saveOrder(customerId) {
        db.run(`INSERT INTO orders (customerId, totalPrice, status, orderDate) VALUES (?, ?, ?, ?)`,
            [customerId, totalPrice, status, orderDate],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Erreur lors de l\'ajout de la commande' });
                }

                const orderId = this.lastID;
                const insertPanierStmt = db.prepare('INSERT INTO order_items (orderId, productId, quantity) VALUES (?, ?, ?)');
                
                // Insérer les produits du panier
                panier.forEach(item => {
                    insertPanierStmt.run(orderId, item.product.id, item.quantity);
                });
                insertPanierStmt.finalize();
                
                res.status(201).json({ orderId, message: 'Commande validée avec succès',rep:"succes" });
            });
    }
};

    

// Route pour obtenir une commande par ID
export const getOrderItemsById = (req, res) => {
    const orderId = req.params.id;
  
    db.all('SELECT * FROM order_items WHERE orderId = ?', orderId, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des items de commande' });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        res.json(rows);
    });


  


};
