const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const db = require("./config/db");
const authRoutes = require("./routes/auth");
const usuarioRoutes = require("./routes/usuarioRoutes");
const productoRoutes = require("./routes/productoRoutes");
const ventaRoutes = require("./routes/ventaRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/js", express.static(path.join(__dirname, "public/js")));

app.get("/", (req, res) => {
  res.redirect("/index.html");
});

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS resultado");
    res.json({
      mensaje: "Conexión a la BD completamente operativa",
      datos: rows,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al consultar la BD", detalle: error.message });
  }
});

app.use("/api", authRoutes);
app.use("/api", usuarioRoutes);
app.use("/api", productoRoutes);
app.use("/api", ventaRoutes);

app.put("/api/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, contraseña, rol } = req.body;

    if (contraseña) {
      await db.query(
        "UPDATE usuarios SET nombre = ?, correo = ?, contraseña = ?, rol = ? WHERE id_usuario = ?",
        [nombre, correo, contraseña, rol, id],
      );
    } else {
      await db.query(
        "UPDATE usuarios SET nombre = ?, correo = ?, rol = ? WHERE id_usuario = ?",
        [nombre, correo, rol, id],
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto ${PORT}");
});