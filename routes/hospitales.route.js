/*
    Hospitales
    '/api/hospitales'
*/

const { Router } = require("express");
const { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require("../controllers/hospitales.controller");
const { validarJWT } = require("../middlewares/validar-jwt");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.get("/" , getHospitales);

router.post(
  "/",
  [
    validarJWT,
    check('nombre', 'El nombre del hispital es nesarios').not().isEmpty(),
    validarCampos
  ],
  crearHospital
);

router.put(
  "/:id",
  [],
  actualizarHospital
);

router.delete( "/:id", borrarHospital );

module.exports = router;