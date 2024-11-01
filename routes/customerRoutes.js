import express from 'express';
import * as customersControler from '../controllers/customersControler.js'; // Utilisez 'import' pour le contrôleur

const router = express.Router();

router.get('/clientstel/:phone', customersControler.gettCustomerByTel);
router.get('/clients', customersControler.getAllCustumers);
router.get('/clients/:id', customersControler.getcustomerById); 
router.get('/commande_client/:id', customersControler.getorderCustemuer);//tous les comande client
<<<<<<< HEAD
router.get('/products_commande/:id', customersControler.getproductorder);// tous les produit d un commande
=======

>>>>>>> 6cdf5dbee109ce7f7b9925681616ee28b1fdd508
export default router; // Exportation par défaut du routeur
