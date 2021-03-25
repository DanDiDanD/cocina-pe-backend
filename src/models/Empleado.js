const { Schema, model} = require('mongoose');

const EmpleadoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellidoPaterno: {
        type: String,
        required: true,
        trim: true
    },
    apellidoMaterno: {
        type: String,
        trim: true,
        default: ''
    },
    dni: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    direccion: {
        type: String,
        trim: true,
        default: ''
    },
    telefono: {
        type: String,
        trim: true,
        default: ''
    },
    // sede:{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Sede'
    // },
    especialidad:{
        type: String,
        default: ''
    },
    estado:{
        type: Boolean,
        default: true
    },
    asistencia: [{
        fechaAsistencia: {
            type: String,
            trim: true
        },
        horasExtras: {
            type: Boolean,
            default: false 
        },
        detalleAsistencias: [{
            horaEntrada:{
                type: String,
                trim: true
            },
            horaSalida:{
                type: String,
                trim: true
            },
            temperaturaEntrada:{
                type: String,
                trim: true
            },
            temperaturaSalida:{
                type: String,
                trim: true
            },
            sede:{
                type: String,
                trim: true,
                required: true
            },
        }]
        
    }],
})

module.exports = model('Empleado', EmpleadoSchema)