import express from 'express';
import cors from 'cors';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import db from './db/database.js'; // Le chemin d'accès à votre fichier database.ts
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Logger Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Utilisation des routes
app.use('/api', orderRoutes);
app.use('/api', productRoutes);
app.use('/api', customerRoutes);

// Écouteur pour l'arrêt de l'application
process.on('exit', async () => {
    console.log('Fermeture des connexions au pool PostgreSQL...');
    await db.end(); // Ferme toutes les connexions du pool proprement
    console.log('Toutes les connexions ont été fermées');
});

// Pour capturer d'autres types de fin de processus (par ex., Ctrl+C)
process.on('SIGINT', async () => {
    console.log('Arrêt de l’application avec Ctrl+C');
    await db.end();
    process.exit();
});


// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
