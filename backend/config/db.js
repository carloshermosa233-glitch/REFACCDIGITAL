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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS productos (
          id_producto INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          descripcion VARCHAR(255)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventario (
          id_producto INT PRIMARY KEY,
          precio DECIMAL(10,2) NOT NULL,
          cantidad INT NOT NULL,
          ubicacion VARCHAR(100),
          FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ventas (
          id_venta INT AUTO_INCREMENT PRIMARY KEY,
          id_usuario INT NOT NULL,
          fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          total DECIMAL(10,2) NOT NULL,
          FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS detalle_venta (
          id_detalle INT AUTO_INCREMENT PRIMARY KEY,
          id_venta INT NOT NULL,
          id_producto INT NOT NULL,
          cantidad INT NOT NULL,
          precio DECIMAL(10,2) NOT NULL,
          total DECIMAL(10,2) NOT NULL,
          FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
          FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
      )
    `);

    await pool.query(`INSERT IGNORE INTO usuarios (id_usuario, nombre, correo, contraseña, rol) VALUES (1, 'Carlos', 'carlos@admin.com', '123456', 'ADMIN')`);
    await pool.query(`INSERT IGNORE INTO usuarios (id_usuario, nombre, correo, contraseña, rol) VALUES (2, 'Arlett', 'arlett@vendedor.com', '123456', 'VENDEDOR')`);

    // 1. Asegurar que existan algunos productos en el inventario para poder hacer la venta de prueba
    await pool.query(`INSERT IGNORE INTO productos (id_producto, nombre, descripcion) VALUES (1, 'Aceite Sintético 5W-30', 'Aceite para motor 1L'), (2, 'Filtro de Aire', 'Filtro estándar')`);
    await pool.query(`INSERT IGNORE INTO inventario (id_producto, precio, cantidad, ubicacion) VALUES (1, 250.00, 20, 'Pasillo 1'), (2, 120.00, 15, 'Pasillo 2')`);

    // 2. Forzar ventas de prueba y actualizar su fecha si ya existen, para que siempre aparezcan en el Corte de Hoy
    // Venta 1 (Hace 2 días - Admin)
    await pool.query(`INSERT INTO ventas (id_venta, id_usuario, fecha, total) VALUES (1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), 620.00) ON DUPLICATE KEY UPDATE fecha = DATE_SUB(NOW(), INTERVAL 2 DAY), total = VALUES(total)`);
    await pool.query(`INSERT INTO detalle_venta (id_detalle, id_venta, id_producto, cantidad, precio, total) VALUES (1, 1, 1, 2, 250.00, 500.00) ON DUPLICATE KEY UPDATE id_venta=VALUES(id_venta), id_producto=VALUES(id_producto), cantidad=VALUES(cantidad), precio=VALUES(precio), total=VALUES(total)`);
    await pool.query(`INSERT INTO detalle_venta (id_detalle, id_venta, id_producto, cantidad, precio, total) VALUES (2, 1, 2, 1, 120.00, 120.00) ON DUPLICATE KEY UPDATE id_venta=VALUES(id_venta), id_producto=VALUES(id_producto), cantidad=VALUES(cantidad), precio=VALUES(precio), total=VALUES(total)`);

    // Venta 2 (Ayer - Vendedor)
    await pool.query(`INSERT INTO ventas (id_venta, id_usuario, fecha, total) VALUES (2, 2, DATE_SUB(NOW(), INTERVAL 1 DAY), 250.00) ON DUPLICATE KEY UPDATE fecha = DATE_SUB(NOW(), INTERVAL 1 DAY), total = VALUES(total)`);
    await pool.query(`INSERT INTO detalle_venta (id_detalle, id_venta, id_producto, cantidad, precio, total) VALUES (3, 2, 1, 1, 250.00, 250.00) ON DUPLICATE KEY UPDATE id_venta=VALUES(id_venta), id_producto=VALUES(id_producto), cantidad=VALUES(cantidad), precio=VALUES(precio), total=VALUES(total)`);

    // Venta 3 (Hoy - Admin - Se mostrará en Corte del Día)
    await pool.query(`INSERT INTO ventas (id_venta, id_usuario, fecha, total) VALUES (3, 1, NOW(), 740.00) ON DUPLICATE KEY UPDATE fecha = NOW(), total = VALUES(total)`);
    await pool.query(`INSERT INTO detalle_venta (id_detalle, id_venta, id_producto, cantidad, precio, total) VALUES (4, 3, 1, 2, 250.00, 500.00) ON DUPLICATE KEY UPDATE id_venta=VALUES(id_venta), id_producto=VALUES(id_producto), cantidad=VALUES(cantidad), precio=VALUES(precio), total=VALUES(total)`);
    await pool.query(`INSERT INTO detalle_venta (id_detalle, id_venta, id_producto, cantidad, precio, total) VALUES (5, 3, 2, 2, 120.00, 240.00) ON DUPLICATE KEY UPDATE id_venta=VALUES(id_venta), id_producto=VALUES(id_producto), cantidad=VALUES(cantidad), precio=VALUES(precio), total=VALUES(total)`);

    console.log("Base de datos inicializada: Usuarios cargados exitosamente.");
  } catch (error) {
    console.error("Error inicializando la base de datos:", error.message);
  }
}

initDB();

module.exports = pool;