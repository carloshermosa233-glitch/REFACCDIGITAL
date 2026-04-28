const express = require("express");
const router = express.Router();
const { agregarProducto, listarInventario, actualizarProducto, eliminarProducto } = require("../controllers/productoController");

// Ruta para agregar un nuevo producto
router.post("/productos", agregarProducto);

// Ruta para obtener todos los productos del inventario
router.get("/inventario", listarInventario);

// Ruta para actualizar inventario
router.put("/productos/:id", actualizarProducto);

// Ruta para eliminar producto
router.delete("/productos/:id", eliminarProducto);

module.exports = router;