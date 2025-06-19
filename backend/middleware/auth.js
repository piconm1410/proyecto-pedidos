const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Middleware para verificar el token y el rol
function verificarRol(rolRequerido) {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Acceso no autorizado' });
        }

        jwt.verify(token, 'secreto', (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido' });
            }

            const userId = decoded.id;
            const query = 'SELECT rol FROM usuarios WHERE id = ?';
            db.query(query, [userId], (err, results) => {
                if (err || results.length === 0) {
                    return res.status(500).json({ error: 'Error al verificar el rol' });
                }

                const userRole = results[0].rol;
                if (userRole !== rolRequerido) {
                    return res.status(403).json({ error: 'No tienes permiso para acceder a esta ruta' });
                }

                req.user = decoded; // Adjuntar datos del usuario al request
                next();
            });
        });
    };
}

module.exports = { verificarRol };