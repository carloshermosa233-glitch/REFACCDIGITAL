const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);

router.post("/cambiar-contrasena", authController.cambiarContrasena);

router.post("/recuperar-contrasena", authController.recuperarContrasena);

module.exports = router;