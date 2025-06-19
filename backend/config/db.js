const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'proyectopedidosmiki123.mysql.database.azure.com',
    port: 3306,
    user: 'adminmysql',
    password: 'elfackm_123',
    database: 'proyecto_pedidos',
    ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});

module.exports = db;