import express from 'express';
import * as customersControler from '../controllers/customersControler.js'; // Utilisez 'import' pour le contrôleur

const router = express.Router();

router.get('/clientstel/:phone', customersControler.gettCustomerByTel);
router.get('/clients', customersControler.getAllCustumers);
router.get('/clients/:id', customersControler.getcustomerById); 
router.get('/commande_client/:id', customersControler.getorderCustemuer);//tous les comande client

export default router; // Exportation par défaut du routeur
