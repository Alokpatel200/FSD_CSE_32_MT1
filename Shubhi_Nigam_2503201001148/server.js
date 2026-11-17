
const express = require('express');
const app = express();

app.use(express.json());

// Initial product data
let products = [
    { id: 301, name: "Wireless Mouse", category: "Electronics", price: 799, quantity: 25, inStock: true },
    { id: 302, name: "Notebook", category: "Stationery", price: 60, quantity: 100, inStock: true },
    { id: 303, name: "USB Keyboard", category: "Electronics", price: 999, quantity: 0, inStock: false }
];

// Validate product data
function isValidProduct(data) {
    return (
        data &&
        typeof data.name === 'string' &&
        data.name.trim() !== '' &&
        typeof data.category === 'string' &&
        data.category.trim() !== '' &&
        typeof data.price === 'number' &&
        Number.isFinite(data.price) &&
        data.price >= 0 &&
        typeof data.quantity === 'number' &&
        Number.isInteger(data.quantity) &&
        data.quantity >= 0 &&
        typeof data.inStock === 'boolean'
    );
}

// 1. GET all products
app.get('/api/products', (req, res) => {
    res.status(200).json(products);
});

// 2. POST a new product
app.post('/api/products', (req, res) => {
    if (!isValidProduct(req.body)) {
        return res.status(400).json({ message: "Invalid product data" });
    }

    const { name, category, price, quantity, inStock } = req.body;

    const newProduct = {
        id: Math.max(...products.map(p => p.id), 300) + 1,
        name,
        category,
        price,
        quantity,
        inStock
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// 3. GET product by ID
app.get('/api/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
});

// 4. PUT update product
app.put('/api/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    if (!isValidProduct(req.body)) {
        return res.status(400).json({ message: "Invalid product data" });
    }

    products[index] = {
        id,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity,
        inStock: req.body.inStock
    };

    res.status(200).json(products[index]);
});

// 5. DELETE product
app.delete('/api/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    products.splice(index, 1);

    res.status(200).json({
        message: "Product deleted successfully"
    });
});

// 6. GET products by category
app.get('/api/products/filter', (req, res) => {
    const category = req.query.category;

    if (typeof category !== 'string' || category.trim() === '') {
        return res.status(400).json({
            message: "Category query parameter is required"
        });
    }

    const filteredProducts = products.filter(p =>
        p.category.toLowerCase() === category.trim().toLowerCase()
    );

    res.status(200).json(filteredProducts);
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
