const Usuario = require("../models/usuarioModel");

const login = async (req, res) => {
  const { usuario, password } = req.body;
  try {
    const rows = await Usuario.findByCredentials(usuario, password);
    
    if (rows.length > 0) {
      res.json({ success: true, usuario: rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Error interno del servidor", detalle: error.message });
  }
};

const cambiarContrasena = async (req, res) => {
  const { id_usuario, nuevaContrasena } = req.body;
  try {
    await Usuario.updatePassword(id_usuario, nuevaContrasena);
    res.json({ success: true, message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al actualizar contraseña", detalle: error.message });
  }
};

const recuperarContrasena = async (req, res) => {
  const { email } = req.body;
  const nuevaContrasena = '123456';

  try {
    const usuarios = await Usuario.findByEmail(email);

    if (usuarios.length > 0) {
      await Usuario.resetPasswordByEmail(email, nuevaContrasena);
    }

    res.json({ success: true, message: "Si tu correo está registrado, la contraseña ha sido restablecida a '123456'." });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor.", detalle: error.message });
  }
};

module.exports = { login, cambiarContrasena, recuperarContrasena };