
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