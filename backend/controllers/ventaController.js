const db = require("../config/db");

const obtenerCorteDia = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT v.id_venta, p.nombre AS producto, dv.total
            FROM ventas v
            JOIN detalle_venta dv ON v.id_venta = dv.id_venta
            JOIN productos p ON dv.id_producto = p.id_producto
            WHERE DATE(v.fecha) = CURDATE()
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Error al obtener el corte del día:", error);
        res.status(500).json({ success: false, message: "Error al obtener el corte", error: error.message });
    }
};

module.exports = { obtenerCorteDia };