const express = require("express");

const app = express();

app.use(express.json());

let products = [
    {
        id: 301,
        name: "Wireless Mouse",
        category: "Electronics",
        price: 799,
        quantity: 25,
        inStock: true
    },
    {
        id: 302,
        name: "Notebook",
        category: "Stationery",
        price: 60,
        quantity: 100,
        inStock: true
    },
    {
        id: 303,
        name: "USB Keyboard",
        category: "Electronics",
        price: 999,
        quantity: 0,
        inStock: false
    }
];

function isValidProduct(data) {
    return (
        typeof data.name === "string" &&
        data.name.trim() !== "" &&
        typeof data.category === "string" &&
        data.category.trim() !== "" &&
        typeof data.price === "number" &&
        Number.isFinite(data.price) &&
        typeof data.quantity === "number" &&
        Number.isInteger(data.quantity) &&
        data.quantity >= 0 &&
        typeof data.inStock === "boolean"
    );
}


app.get("/api/products", (req, res) => {
    res.status(200).json(products);
});


app.post("/api/products", (req, res) => {
    const { name, category, price, quantity, inStock } = req.body;

    if (!isValidProduct(req.body)) {
        return res.status(400).json({
            message: "Invalid product data"
        });
    }

    const newId = Math.max(...products.map(p => p.id), 300) + 1;

    const newProduct = {
        id: newId,
        name: name.trim(),
        category: category.trim(),
        price,
        quantity,
        inStock
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
});

app.get("/api/products/filter", (req, res) => {
    const category = req.query.category;

    if (typeof category !== "string" || !category.trim()) {
        return res.status(400).json({
            message: "Category query parameter is required"
        });
    }

    const filteredProducts = products.filter(
        p => p.category.toLowerCase() === category.trim().toLowerCase()
    );

    res.status(200).json(filteredProducts);
});


app.get("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.status(200).json(product);
});


app.put("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const updatedProduct = {
        ...products[index],
        ...req.body,
        id
    };

    if (!isValidProduct(updatedProduct)) {
        return res.status(400).json({
            message: "Invalid product data"
        });
    }

    products[index] = updatedProduct;

    res.status(200).json(updatedProduct);
});


app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    products.splice(index, 1);

    res.status(200).json({
        message: "Product deleted successfully"
    });
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});