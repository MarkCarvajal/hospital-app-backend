/*
    Medicos
    '/api/medicos'
*/

const { Router } = require("express");
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require("../controllers/medicos.controller");
const { validarJWT } = require("../middlewares/validar-jwt");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.get("/" , getMedicos);

router.post(
  "/",
  [
    validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    check('apellido', 'El apellido del medico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe ser valido').isMongoId(),
    validarCampos
  ],
  crearMedico
);

router.put(
  "/:id",
  [],
  actualizarMedico
);

router.delete( "/:id", borrarMedico );

module.exports = router;