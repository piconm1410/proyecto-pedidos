const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Crear un pedido
router.post('/', (req, res) => {
  const { usuario_id, producto_id, cantidad } = req.body;
  console.log('Datos recibidos:', { usuario_id, producto_id, cantidad }); // <-- Agrega esto
  if (!usuario_id || !producto_id || !cantidad) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }
  const query = 'INSERT INTO pedidos (usuario_id, producto_id, cantidad, fecha, estado) VALUES (?, ?, ?, NOW(), "En espera")';
  db.query(query, [usuario_id, producto_id, cantidad], (err, result) => {
    if (err) {
      console.error('Error MySQL:', err); // <-- Agrega esto
      return res.status(500).json({ message: 'Error al crear pedido' });
    }
    res.json({ message: 'Pedido creado con éxito' });
  });
});

// Obtener todos los pedidos
router.get('/', (req, res) => {
    const query = `
        SELECT 
            pedidos.id,
            pedidos.usuario_id,
            usuarios.nombre AS nombre_usuario,
            productos.nombre AS nombre_producto,
            pedidos.cantidad,
            pedidos.estado,
            pedidos.fecha,
            (pedidos.cantidad * productos.precio) AS precio_total
        FROM pedidos
        INNER JOIN usuarios ON pedidos.usuario_id = usuarios.id
        INNER JOIN productos ON pedidos.producto_id = productos.id
        ORDER BY pedidos.fecha DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener pedidos' });
        }
        res.json(results);
    });
});

// Obtener productos (puedes usar tu ruta de productos existente)
router.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener productos' });
    }
    res.json(results);
  });
});

// Actualizar estado de un pedido
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { estado } = req.body;
    const query = 'UPDATE pedidos SET estado = ? WHERE id = ?';
    db.query(query, [estado, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error al actualizar el estado del pedido' });
        }
        res.json({ message: 'Estado actualizado correctamente' });
    });
});

// Obtener pedidos agrupados por usuario y producto
router.get('/agrupados', (req, res) => {
    const query = `
        SELECT 
            pedidos.usuario_id,
            usuarios.nombre AS nombre_usuario,
            pedidos.producto_id,
            productos.nombre AS nombre_producto,
            SUM(pedidos.cantidad) AS cantidad_total,
            pedidos.estado,
            MAX(pedidos.fecha) AS fecha_ultima,
            (SUM(pedidos.cantidad) * productos.precio) AS precio_total
        FROM pedidos
        INNER JOIN usuarios ON pedidos.usuario_id = usuarios.id
        INNER JOIN productos ON pedidos.producto_id = productos.id
        GROUP BY pedidos.usuario_id, pedidos.producto_id, pedidos.estado
        ORDER BY fecha_ultima DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener pedidos agrupados' });
        }
        res.json(results);
    });
});

module.exports = router;