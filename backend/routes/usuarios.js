const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config/db');

const generarHash = async () => {
    const contrasena = '123456'; // Cambia esto por la contraseña deseada
    const hash = await bcrypt.hash(contrasena, 10);
    console.log(hash);
};

generarHash();

// Ruta para registrar un nuevo usuario
router.post('/register', (req, res) => {
    const { nombre, correo, contrasena } = req.body; // No se incluye el rol, será predeterminado como 'usuario'

    // Validar que todos los campos estén presentes
    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el correo ya está registrado
    const queryCheck = 'SELECT * FROM usuarios WHERE correo = ?';
    db.query(queryCheck, [correo], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Insertar el nuevo usuario en la base de datos con rol predeterminado 'usuario'
        const queryInsert = 'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)';
        db.query(queryInsert, [nombre, correo, contrasena, 'usuario'], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al registrar el usuario' });
            }
            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        });
    });
});

// Login de usuario
router.post('/login', (req, res) => {
    const { correo, contrasena } = req.body;

    console.log('Correo recibido:', correo);
    console.log('Contraseña recibida:', contrasena);

    const query = 'SELECT * FROM usuarios WHERE correo = ?';
    db.query(query, [correo], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (results.length === 0) {
            console.log('Correo no encontrado en la base de datos');
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        const user = results[0];
        console.log('Usuario encontrado:', user);

        // Comparar la contraseña directamente (sin hash)
        if (contrasena !== user.contrasena) {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        // Generar token
        const token = jwt.sign(
            { id: user.id, nombre: user.nombre, rol: user.rol },
            'secreto', // Cambia esto por una clave secreta segura
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            rol: user.rol,
            usuario: { id: user.id, nombre: user.nombre, rol: user.rol }
        });
    });
});

module.exports = router;