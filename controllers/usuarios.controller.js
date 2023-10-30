const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res) => {
  // query params ?desde=5 , para mostrar los registros a contar de ese numero
  const desde = Number(req.query.desde) || 0;

  // Funcion para leet el registro desde la base de dato, los nombres de campos son para filtrar los que solamente quieres mostrar ya que trae all
  // const usuarios = await Usuario.find({}, "nombre apellido email role google")
  //   .skip(desde)
  //   .limit(5);

  // const total = await Usuario.count();

  const [usuarios, total] = await Promise.all([
    Usuario.find({}, "nombre apellido email role google img").skip(desde).limit(5),
    Usuario.countDocuments(),
  ]);

  res.json({
    ok: true,
    usuarios,
    total,
  });
};

const crearUsuarios = async (req, res = response) => {
  const { password, email } = req.body;

  try {
    // En esta constante valida si ya existe un registro como el que ingresa, en este caso el mail
    const existeEmail = await Usuario.findOne({ email });

    // Valida la respuesta y entrega mensaje en caso de existir en la base
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }

    // Genera una nueva instancia de Usuario con el body ingresado despues de pasar los filtros( la ejecucion es lineal ).
    const usuario = new Usuario(req.body);

    // ##Encriptar contraseña
    // Genera un factor para la pass de manera aleatoria
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Aqui guarda la instancia en la BD
    await usuario.save();

    // Generar token
    const token = await generarJWT(usuario.id);

    // Respuesta que entrega el servicio al finalizar ok o al fallar
    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar log",
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el usuario correcto

  // Obtiene ID
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No exist un usuario por ese id",
      });
    }

    // Actualizaciones
    // Desestructura el body para no incluir el password y google en campos
    const { password, google, email, ...campos } = req.body;

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese email",
        });
      }
    }

    campos.email = email;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const borrarUsuario = async (req, res = response) => {
  // Obtiene ID
  const uid = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    await Usuario.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: "Usuario Eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuarios,
  actualizarUsuario,
  borrarUsuario,
};
