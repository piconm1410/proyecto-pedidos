const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});

// Ruta para obtener todos los productos
app.get('/api/inventario', (req, res) => {
    db.query('SELECT * FROM inventario', (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

// Ruta para agregar un producto
app.post('/api/inventario', (req, res) => {
    const { nombre_producto, descripcion, precio, cantidad, categoria, imagen_url } = req.body;
    const query = 'INSERT INTO inventario (nombre_producto, descripcion, precio, cantidad, categoria, imagen_url) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [nombre_producto, descripcion, precio, cantidad, categoria, imagen_url], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send('Producto agregado exitosamente.');
        }
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});