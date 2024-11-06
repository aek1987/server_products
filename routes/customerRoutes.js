import express from 'express';
import * as customersControler from '../controllers/customersControler.js'; // Utilisez 'import' pour le contrôleur

const router = express.Router();

router.get('/clientstel/:phone', customersControler.getCustomerByTel);
router.get('/clients', customersControler.getAllCustomers);
router.get('/clients/:id', customersControler.getCustomerById); 
router.get('/commande_client/:id', customersControler.getOrderCustomer);//tous les comande client
router.get('/products_commande/:id', customersControler.getProductOrder);// tous les produit d un commande


export default router; // Exportation par défaut du routeur
