const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todos los productos
router.get('/', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener productos' });
    }
    res.json(results);
  });
});

// Crear un producto
router.post('/', (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_base64 } = req.body;
  console.log('Imagen recibida:', imagen_base64 ? imagen_base64.substring(0, 50) : 'No image'); // <-- Agrega esto
  if (!nombre || !precio || !stock) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }
  const imagen = imagen_base64 && imagen_base64.startsWith('data:image') ? imagen_base64 : null;
  const query = 'INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nombre, descripcion, precio, stock, imagen], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear producto' });
    }
    res.json({ message: 'Producto creado con éxito' });
  });
});

// Actualizar un producto
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion, precio, stock, imagen_base64 } = req.body;
  if (!nombre || !precio || !stock) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }
  // Si no hay imagen nueva, conserva la anterior (debe enviarse desde el frontend)
  const imagen = imagen_base64 && imagen_base64.startsWith('data:image') ? imagen_base64 : null;
  const query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ? WHERE id = ?';
  db.query(query, [nombre, descripcion, precio, stock, imagen, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar producto' });
    }
    res.json({ message: 'Producto actualizado con éxito' });
  });
});

// Eliminar un producto
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM productos WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar producto' });
    }
    res.json({ message: 'Producto eliminado con éxito' });
  });
});

module.exports = router;