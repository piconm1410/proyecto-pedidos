const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost', // Dirección del servidor MySQL
    port: 3309,        // Puerto especificado en tu configuración
    user: 'root',      // Usuario de la base de datos
    password: 'elfackm_1234', // Contraseña de la base de datos
    database: 'proyecto_pedidos'   // Nombre de la base de datos
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});

module.exports = db;