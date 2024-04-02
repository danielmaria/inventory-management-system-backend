const express = require('express');
const router = express.Router();
const Location = require('../db/locationModal');
const auth = require("./auth");

// Endpoint to create a new location
router.post('/', auth('operator'), async (req, res) => {
    try {
        const location = await Location.create(req.body);
        res.status(201).json(location);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Endpoint to get all locations
router.get('/', auth('observer', 'operator'), async (req, res) => {
    try {
        const locations = await Location.find({ deleted: false });
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Endpoint to get a specific location by ID
router.get('/:id', auth('observer', 'operator'), getLocation, (req, res) => {
    res.json(res.location);
});

// Endpoint to edit an existing location
router.patch('/:id', auth('operator'), getLocation, async (req, res) => {
    if (req.body.name != null) {
        res.location.name = req.body.name;
    }
    if (req.body.description != null) {
        res.location.description = req.body.description;
    }
    if (req.body.adress != null) {
        res.location.adress = req.body.adress;
    }
    try {
        const updatedLocation = await res.location.save();
        res.json(updatedLocation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Endpoint to "delete" a location (marking as deleted)
router.delete('/:id', getLocation, auth('operator'), async (req, res) => {
    res.location.deletado = true;
    try {
        await res.location.save();
        res.json({ message: 'Localização deletada com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getLocation(req, res, next) {
    try {
        const location = await Location.findById(req.params.id);
        if (location == null || location.deletado) {
            return res.status(404).json({ message: 'Localização não encontrada' });
        }
        res.location = location;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = router;
