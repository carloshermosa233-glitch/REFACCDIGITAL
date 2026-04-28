const express = require("express");
const router = express.Router();
const { obtenerCorteDia } = require("../controllers/ventaController");

router.get("/corte-dia", obtenerCorteDia);

module.exports = router;