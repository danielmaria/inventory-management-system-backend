const express = require('express');
const router = express.Router();
const Storage = require('../db/storageModal');
const Product = require('../db/productModal');
const Location = require('../db/locationModal');
const auth = require("./auth");
const cache = require('memory-cache');

// Endpoint to add a storage entry
router.post('/', auth('operator'), async (req, res) => {
    const { items, locationId } = req.body;

    try {
        const location = await Location.findById(locationId);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        let products = [];

        // Check for cached products
        const cachedProducts = cache.get('products');
        if (cachedProducts) {
            console.info('Retornando produtos do cache.');
            products = cachedProducts;
        } else {
            // If there are no products in cache, search the database
            console.info('Buscando produtos no banco de dados.');
            products = await Product.find({ deleted: false });
            // Armazena os produtos em cache
            cache.put('products', products);
        }

        // Updates the quantity of products in memory
        const productUpdates = Object.values(productsMap).map(async product => {
            const amountToDeduct = product.amountToDeduct;
            console.info(amountToDeduct);
            if (amountToDeduct > 0) {
                product.amount -= amountToDeduct;
                await Product.findByIdAndUpdate(product._id, { amount: product.amount });
            }
        });

        await Promise.all(productUpdates);

        // Creates an entry in collection Storage
        const storageEntry = new Storage({
            location: locationId,
            products: items.map(item => ({
                product: item.productId,
                amount: item.amount
            })),
            createdDate: Date.now()
        });

        await storageEntry.save();

        cache.clear();
        res.status(201).json(storageEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Endpoint to execute a storage entry
router.patch('/:id/execute', auth('operator'), async (req, res) => {
    const executedBy  = req.user.userId;
    console.log(executedBy);
    try {
        const storageEntry = await Storage.findById(req.params.id);
        if (!storageEntry) {
            return res.status(404).json({ message: 'Storage entry not found' });
        }

        storageEntry.executedDate = Date.now();
        storageEntry.executedBy = executedBy;

        await storageEntry.save();
        res.json(storageEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/', auth('observer', 'operator'), async (req, res) => {
    try {
        const products = await Storage.find().populate('location').populate('products.product');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
