const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const usuariosRoutes = require('./routes/usuarios');
const productosRoutes = require('./routes/productos');
const pedidosRoutes = require('./routes/pedidos');
const path = require('path');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos de /public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta base: pantalla de bienvenida
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inicio.html'));
});

// Servir archivos estáticos de carpetas raíz
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')));
app.use('/imagenes', express.static(path.join(__dirname, '..', 'imagenes')));
app.use('/engine1', express.static(path.join(__dirname, '..', 'engine1')));
app.use('/data1', express.static(path.join(__dirname, '..', 'data1')));
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));

// Si tienes más carpetas (como contacto.html, objetos.html, etc.) en la raíz,
// sirve la raíz del proyecto para archivos .html:
app.use(express.static(path.join(__dirname, '..')));

// Rutas API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



