const { response } = require("express");
const { validationResult } = require('express-validator');

const validarCampos = (req, res = response, next) => {
  const errores = validationResult(req);

  //Valida que no vengan errores de ingreso validados en el check del router
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errores.mapped(),
    });
  }

  next();

};

module.exports = { validarCampos }