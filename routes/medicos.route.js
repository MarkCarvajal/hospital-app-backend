/*
    Medicos
    '/api/medicos'
*/

const { Router } = require("express");
const { getMedicos, crearMedico, actualizarMedico, borrarMedico, getMedicosById } = require("../controllers/medicos.controller");
const { validarJWT } = require("../middlewares/validar-jwt");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.get("/" , validarJWT , getMedicos);

router.post(
  "/",
  [
    validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    // check('apellido', 'El apellido del medico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe ser valido').isMongoId(),
    validarCampos
  ],
  crearMedico
);

router.put(
  "/:id",
  [
    validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    // check('apellido', 'El apellido del medico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe ser valido').isMongoId(),
    validarCampos
  ],
  actualizarMedico
);

router.delete( "/:id", validarJWT , borrarMedico );

router.get( "/:id", validarJWT , getMedicosById );

module.exports = router;