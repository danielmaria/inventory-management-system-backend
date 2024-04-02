const express = require('express');
const router = express.Router();
const Product = require('../db/productModal');
const auth = require("./auth");
const cache = require('memory-cache');

// Endpoint to create a new product
router.post('/', auth('operator'), async (req, res) => {
    try {
        const product = await Product.create(req.body);
        cache.clear();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Endpoint to get all products
router.get('/', auth('observer', 'operator'), async (req, res) => {
    try {
        const cachedProducts = cache.get("products");
        if (cachedProducts) {
            console.log("Retornando produtos do cache.");
            return res.json(cachedProducts);
        }

        const products = await Product.find({ deleted: false });

        cache.put("products", products, CACHE_EXPIRATION);

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Endpoint to get a specific product by ID
router.get('/:id', getProduct, auth('observer', 'operator'), (req, res) => {
    res.json(res.product);
});

// Endpoint to edit an existing product
router.patch('/:id', getProduct, auth('operator'), async (req, res) => {
    if (req.body.name != null) {
        res.product.name = req.body.name;
    }
    if (req.body.description != null) {
        res.product.description = req.body.description;
    }
    if (req.body.amount != null) {
        res.product.amount = req.body.amount;
    }
    if (req.body.price != null) {
        res.product.price = req.body.price;
    }
    try {
        const updatedProduct = await res.product.save();
        cache.clear();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Endpoint to "delete" a product (mark as deleted)
router.delete('/:id', getProduct, auth('operator'), async (req, res) => {
    res.product.deleted = true;
    try {
        await res.product.save();
        cache.clear();
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getProduct(req, res, next) {
    try {
        const product = await Product.findById(req.params.id);
        if (product == null || product.deleted) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.product = product;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = router;
