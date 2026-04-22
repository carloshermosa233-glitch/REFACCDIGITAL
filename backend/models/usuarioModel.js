const db = require("../config/db");

const Usuario = {
  findByCredentials: async (usuario, password) => {
    const [rows] = await db.query(
      "SELECT id_usuario, nombre, correo, rol FROM usuarios WHERE (correo = ? OR nombre = ?) AND contraseña = ?",
      [usuario, usuario, password]
    );
    return rows;
  },

  findByEmail: async (email) => {
    const [rows] = await db.query(
      "SELECT id_usuario, nombre, correo, rol FROM usuarios WHERE correo = ?",
      [email]
    );
    return rows;
  },

  updatePassword: async (id_usuario, nuevaContrasena) => {
    const [result] = await db.query(
      "UPDATE usuarios SET contraseña = ? WHERE id_usuario = ?",
      [nuevaContrasena, id_usuario]
    );
    return result;
  },

  resetPasswordByEmail: async (email, nuevaContrasena) => {
    const [result] = await db.query(
      "UPDATE usuarios SET contraseña = ? WHERE correo = ?",
      [nuevaContrasena, email]
    );
    return result;
  },

  findAll: async () => {
    const [rows] = await db.query("SELECT id_usuario, nombre, correo, rol FROM usuarios");
    return rows;
  },

  create: async (nuevoUsuario) => {
    const { nombre, correo, contraseña, rol } = nuevoUsuario;
    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)",
      [nombre, correo, contraseña, rol.toUpperCase()]
    );
    return result;
  },

  deleteById: async (id_usuario) => {
    const [result] = await db.query("DELETE FROM usuarios WHERE id_usuario = ?", [id_usuario]);
    return result;
  }
};

module.exports = Usuario;