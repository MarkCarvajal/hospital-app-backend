
const { Schema, model } = require('mongoose');

const MedicoSchema = Schema({

    nombre: {
        type: String,
        require: true
    },
    apellido: {
        type: String,
        require: true
    },
    img: {
        type: String
    },
    usuario: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    hospital: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Hospital'
    }
}, { collection: 'medicos' });

// Metodo para filtra el body del request y sacr el __v, el _id y password
MedicoSchema.method('toJSON', function() {
    const { __v, password, ...object } =  this.toObject();
    return object;
})

module.exports = model( 'Medico', MedicoSchema );