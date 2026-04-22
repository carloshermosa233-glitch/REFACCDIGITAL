const Usuario = require('../models/usuarioModel');

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener usuarios', detalle: error.message });
    }
};

const crearUsuario = async (req, res) => {
    try {
        const result = await Usuario.create(req.body);
        res.status(201).json({ success: true, message: 'Usuario creado correctamente', id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado.' });
        }
        res.status(500).json({ success: false, message: 'Error al crear el usuario', detalle: error.message });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Usuario.deleteById(id);
        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Usuario eliminado correctamente' });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el usuario', detalle: error.message });
    }
};

module.exports = {
    listarUsuarios,
    crearUsuario,
    eliminarUsuario
};