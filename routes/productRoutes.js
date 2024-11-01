import express from 'express';
import * as productController from '../controllers/productController.js';


const router = express.Router();
// Route pour obtenir tous les produits
router.get('/allproducts', productController.getAllProducts);

// Route pour ajouter un nouveau produit
router.post('/product', productController.addProduct);

// Route pour supprimer un produit
router.delete('/product/:id', productController.deleteProduct);

// Route pour obtenir un produit spécifique par ID
router.get('/product/:id', productController.getProductById);




// Autres routes pour l'ajout et la suppression de produits
export default router

