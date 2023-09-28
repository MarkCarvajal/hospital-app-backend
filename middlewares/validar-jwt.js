const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {

    // Leer el token
    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            ok:false,
            msg: 'No hay token en la peticion'
        })
    }

    try {

        // Funcion para validar el token en la libreria, se extrae el uid y se agrega al body del request
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        req.uid = uid;

        next();
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }

   
}

module.exports = {
    validarJWT
}