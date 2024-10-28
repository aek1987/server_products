class Product {
    constructor(id, name, description, price, image, category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price; // prix au lieu de l'image
        this.image = image;
        this.category = category; // ajout de category
    }
}
module.exports = Product;
