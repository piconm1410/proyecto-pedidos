const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todas las categorías
router.get('/', (req, res) => {
    const query = 'SELECT * FROM categorias';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

module.exports = router;