const db = require('../db/database.db');

exports.getAllProducts = (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
};

exports.addProduct = (req, res) => {
    const { name, description, price, quantity } = req.body;
    db.run('INSERT INTO products (name, description, price, quantity) VALUES (?, ?, ?, ?)', [name, description, price, quantity], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID, name, description, price, quantity });
        }
    });
};
