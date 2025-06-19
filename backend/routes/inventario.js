const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todos los productos
router.get('/', (req, res) => {
    const query = `
        SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.imagen, c.nombre_categoria 
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

module.exports = router;