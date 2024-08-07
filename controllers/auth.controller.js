const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {

    const { email, password } = req.body;
    
    try {
        
        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if( !usuarioDB ){
            return res.status(404).json({
                ok:false,
                msg: 'Email no valido'
            });
        }

        // Verificar Contraseña
        const validaPassword = bcrypt.compareSync( password, usuarioDB.password );
        if( !validaPassword ){
            return res.status(400).json({
                ok:false,
                msg: 'Contraseña no valida'
            });
        }

        // Generar token
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok:true,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        });
    }
}

const googleSingIn = async (req, res = response) => {

    try {
        // const googleUser = await googleVerify( req.body.token );
        const {email, name, picture} = await googleVerify( req.body.token );

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if( !usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else{ 
            usuario = usuarioDB; 
            usuario.google = true;
        }

        //Guardar Usuario
        await usuario.save();

        //Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id )

        res.json({
            ok: true,
            email, name, picture,
            token
        })
        
    } catch (err) {
        console.log(err);
        res.status(400).json({
            ok: false,
            msg: 'Token de Google no es correcto'
        });
    }

}

const renewToken = async(req, res = response) => {
   
    const uid = req.uid;
    
    //Generar el TOKEN - JWT
    const token = await generarJWT( uid )

    // Obtener ususario por UID
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        token,
        usuario
    })

}

module.exports = { login, googleSingIn, renewToken }