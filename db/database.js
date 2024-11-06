import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    connectionString: process.env.DATABASE_URL, // URL de connexion PostgreSQL, à définir dans les variables d'environnement
    ssl: { rejectUnauthorized: false }
});

// Connexion à PostgreSQL avec async/await
const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Base de données PostgreSQL connectée avec succès');
    } catch (err) {
        console.error('Erreur lors de la connexion à la base de données PostgreSQL', err);
    }
};

// Création des tables avec async/await
const createTables = async () => {
    try {
        await client.query(`CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            image TEXT,
            category TEXT,
            resolution TEXT,
            storage TEXT,
            ram TEXT,
            battery TEXT,
            wirelessCharging TEXT,
            color TEXT,
            dualSim BOOLEAN DEFAULT FALSE
        )`);

        await client.query(`CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            customerId INTEGER,
            totalPrice REAL,
            status TEXT,
            orderDate TEXT,
            FOREIGN KEY (customerId) REFERENCES customers(id)
        )`);

        await client.query(`CREATE TABLE IF NOT EXISTS customers (
            id SERIAL PRIMARY KEY,
            name TEXT,
            phone TEXT,
            wilaya TEXT,
            commune TEXT,
            address TEXT
        )`);

        await client.query(`CREATE TABLE IF NOT EXISTS order_items (
            id SERIAL PRIMARY KEY,
            orderId INTEGER,
            productId INTEGER,
            quantity INTEGER NOT NULL,
            FOREIGN KEY (orderId) REFERENCES orders(id),
            FOREIGN KEY (productId) REFERENCES products(id)
        )`);

        console.log("Tables créées avec succès dans PostgreSQL");
    } catch (error) {
        console.error("Erreur lors de la création des tables", error);
    }
};

// Appel de la fonction pour établir la connexion et créer les tables
const initializeDatabase = async () => {
    await connectToDatabase();
    await createTables();
};

// Appel de la fonction d'initialisation
initializeDatabase();

// Exemple d'insertion de produits à partir d'un fichier JSON (si besoin)
import fs from 'fs';

const insertProductsFromJSON = async (jsonFilePath) => {
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    const jsonData = JSON.parse(data);

    for (const product of jsonData.products) {
        try {
            await client.query(
                'INSERT INTO products (name, description, price, image, category, resolution, storage, ram, battery, wirelessCharging, color, dualSim) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
                [product.name, product.description, product.price, product.image, product.category, product.resolution, product.storage, product.ram, product.battery, product.wirelessCharging, product.color, product.dualSim]
            );
            console.log(`Produit ajouté avec succès: ${product.name}`);
        } catch (error) {
            console.error('Erreur lors de l\'insertion du produit:', error);
        }
    }
};

// Exemple d'utilisation : insertProductsFromJSON('chemin/vers/votre/fichier.json');

// Assurez-vous de fermer la connexion après les opérations (par exemple à la fin de l'application)
client.end();

export default client;
