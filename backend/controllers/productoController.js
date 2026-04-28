const db = require("../config/db");

const listarInventario = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.id_producto, p.nombre, p.descripcion, i.cantidad, i.ubicacion, i.precio 
            FROM productos p 
            JOIN inventario i ON p.id_producto = i.id_producto
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Error al obtener el inventario:", error);
        res.status(500).json({ success: false, message: "Error al obtener el inventario", error: error.message });
    }
};

const agregarProducto = async (req, res) => {
    const { nombre, descripcion, precio, cantidad, ubicacion } = req.body;

    if (precio <= 0 || cantidad <= 0) {
        return res.status(400).json({ success: false, message: "El precio y la cantidad deben ser valores positivos." });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Verificar si el producto ya existe (ignorando mayúsculas/minúsculas)
        const [existente] = await connection.query("SELECT id_producto FROM productos WHERE LOWER(nombre) = LOWER(?)", [nombre]);
        if (existente.length > 0) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: "Ya existe un producto registrado con ese nombre." });
        }

        // 1. Insertar el producto
        const [resultProducto] = await connection.query(
            "INSERT INTO productos (nombre, descripcion) VALUES (?, ?)",
            [nombre, descripcion]
        );
        const id_producto = resultProducto.insertId;

        // 2. Insertar en el inventario con el id_producto generado
        await connection.query(
            "INSERT INTO inventario (id_producto, precio, cantidad, ubicacion) VALUES (?, ?, ?, ?)",
            [id_producto, precio, cantidad, ubicacion]
        );

        await connection.commit();
        res.status(201).json({ success: true, message: "Producto agregado exitosamente al inventario." });
    } catch (error) {
        await connection.rollback();
        console.error("Error al agregar producto:", error);
        res.status(500).json({ success: false, message: "Error al agregar el producto", error: error.message });
    } finally {
        connection.release();
    }
};

const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, cantidad, ubicacion } = req.body;
    
    if (precio <= 0 || cantidad < 0) {
        return res.status(400).json({ success: false, message: "Valores numéricos inválidos." });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Verificar si el nombre ya existe en otro producto (excluyendo el actual)
        const [existente] = await connection.query("SELECT id_producto FROM productos WHERE LOWER(nombre) = LOWER(?) AND id_producto != ?", [nombre, id]);
        if (existente.length > 0) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: "Ya existe otro producto registrado con ese nombre." });
        }

        // 1. Actualizar la tabla de productos (nombre y descripción)
        await connection.query(
            "UPDATE productos SET nombre = ?, descripcion = ? WHERE id_producto = ?",
            [nombre, descripcion, id]
        );

        // 2. Actualizar la tabla de inventario (precio, cantidad, ubicación)
        await connection.query(
            "UPDATE inventario SET precio = ?, cantidad = ?, ubicacion = ? WHERE id_producto = ?",
            [precio, cantidad, ubicacion, id]
        );

        await connection.commit();
        res.json({ success: true, message: "Producto actualizado exitosamente." });
    } catch (error) {
        await connection.rollback();
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ success: false, message: "Error al actualizar el producto", error: error.message });
    } finally {
        connection.release();
    }
};

const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Eliminar de inventario y luego de productos
        await connection.query("DELETE FROM inventario WHERE id_producto = ?", [id]);
        await connection.query("DELETE FROM productos WHERE id_producto = ?", [id]);

        await connection.commit();
        res.json({ success: true, message: "Producto eliminado exitosamente." });
    } catch (error) {
        await connection.rollback();
        console.error("Error al eliminar producto:", error);
        
        let message = "Error al eliminar el producto";
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            message = "No se puede eliminar el producto porque tiene ventas registradas.";
        }
        res.status(500).json({ success: false, message, error: error.message });
    } finally {
        connection.release();
    }
};

module.exports = { agregarProducto, listarInventario, actualizarProducto, eliminarProducto };