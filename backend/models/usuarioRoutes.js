const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/usuarios', usuarioController.listarUsuarios);
router.post('/usuarios', usuarioController.crearUsuario);
router.delete('/usuarios/:id', usuarioController.eliminarUsuario);

module.exports = router;