// Order.js
class Order {
    constructor(id, customerId, totalPrice, status, orderDate, panier) {
        this.id = id;
        this.customerId = customerId;
        this.totalPrice = totalPrice;
        this.status = status;
        this.orderDate = orderDate;
        this.panier = panier; // Utilisation de 'panier' pour stocker la liste des produits
    }
}

module.exports = Order;

// Panier.js
export interface Panier {
    product: Product;  // Assurez-vous que 'Product' est défini quelque part dans votre code
    quantity: number;
}

