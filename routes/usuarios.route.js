/**
    Ruta: /api/usuarios
 */

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getUsuarios,
  crearUsuarios,
  actualizarUsuario,
  borrarUsuario
} = require("../controllers/usuarios.controller");
const { validarJWT } = require("../middlewares/validar-jwt");

// Argumentos rutas
//  1# - Ruta del servicio
//  2# - Middlewares -> validadores de entrada
//  3# - Metodo de implementacion para la ruta

const router = Router();

router.get("/", validarJWT , getUsuarios);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validarCampos,
  ],
  crearUsuarios
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    // check("apellido", "El apellido es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("role", "El role es obligatorio").not().isEmpty(),
    validarCampos
  ],
  actualizarUsuario
);

router.delete( "/:id", validarJWT, borrarUsuario );

module.exports = router;
