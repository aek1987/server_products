import express from 'express';
import * as customersControler from '../controllers/customersControler.js'; // Utilisez 'import' pour le contrôleur

const router = express.Router();

//router.post('/orders', orderController.addOrder);
router.get('/clients', customersControler.getAllCustumers); // Assurez-vous d'avoir cette méthode dans votre contrôleur
//router.get('/produit_commandes/:id', orderController.getOrderItemsById); // Assurez-vous également d'avoir cette méthode

export default router; // Exportation par défaut du routeur
