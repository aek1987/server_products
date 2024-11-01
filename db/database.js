import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('db/database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données', err);
    } else {
        console.log('Base de données ouverte avec succès');
    }
});

// Création des tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image TEXT,
        category TEXT,
        resolution TEXT,
        storage TEXT,
        ram   EXT,
        battery TEXT,
        wirelessCharging TEXT,
        color TEXT,
        dualSim false


    )`);

    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerId INTEGER,
        totalPrice REAL,
        status TEXT,
        orderDate TEXT,
        FOREIGN KEY(customerId) REFERENCES customers(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        wilaya TEXT,
        commune TEXT,
        address TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER,
        productId INTEGER,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders(id),
        FOREIGN KEY (productId) REFERENCES products(id)
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

export default db;