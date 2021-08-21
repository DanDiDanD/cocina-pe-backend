const { Schema, model} = require('mongoose');
const {RecetaSchema} = require('./Platillo')

const UsuarioSchema = new Schema({
    correo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    tipo_usuario: {
        type: String,
        default: 'user'
    },
    nombres: {
        type: String,
        required: true,
        trim: true
    },
    apellido_paterno: {
        type: String,
        required: true,
        trim: true
    },
    apellido_materno: {
        type: String,
        trim: true,
        default: ''
    },
    pais: {
        type: String,
        default: '',
        trim: true
    },
    ciudad: {
        type: String,
        default: '',
        trim: true
    },
    fecha_nacimiento: {
        type: Date,
        default: '1900-01-01',
        trim: true
    },
    fecha_registro: {
        type: Date,
        default: Date.now,
        trim: true
    },
    sexo:{
        type: String,
        trim: true,
        default: ''
    },
    is_activo:{
        type: Boolean,
        default: true
    },
    is_premium:{
        type: Boolean,
        default: false
    },
    expiret:{
        type: Date,
        default: Date.now,
    },
    url_avatar:{
        type: String,
        default: ''
    },
    recetas_propias: {
        type: [String],
        required: false
    },
    recetas_favoritas: {
        type: [String],
        required: false
    }
})

module.exports = model('Usuario', UsuarioSchema)