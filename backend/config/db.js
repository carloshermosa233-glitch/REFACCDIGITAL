const mysql = require("mysql2/promise");
require("dotenv").config();

const dbName = process.env.DB_NAME || "RefaccionesDB";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
    database: dbName,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
async function initDB() {
  try {
    const tempConn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await tempConn.end();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
          id_usuario INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          correo VARCHAR(150) UNIQUE,
          contraseña VARCHAR(255) NOT NULL,
          rol ENUM('ADMIN','VENDEDOR') NOT NULL
      )
    `);

    await pool.query(`INSERT IGNORE INTO usuarios (id_usuario, nombre, correo, contraseña, rol) VALUES (1, 'Carlos', 'carlos@admin.com', '123456', 'ADMIN')`);
    await pool.query(`INSERT IGNORE INTO usuarios (id_usuario, nombre, correo, contraseña, rol) VALUES (2, 'Arlett', 'arlett@vendedor.com', '123456', 'VENDEDOR')`);

    console.log("Base de datos inicializada: Usuarios cargados exitosamente.");
  } catch (error) {
    console.error("Error inicializando la base de datos:", error.message);
  }
}

initDB();

module.exports = pool;