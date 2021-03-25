const { Schema, model} = require('mongoose');

const IngredienteSchema = new Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    url_imagen: {
        type: String,
        require: false,
        default: '',
        trim: true
    },
    tipo_ingrediente: {
        type: String,
        require: true,
        trim: true,
    }
})


module.exports = {
    IngredienteSchema,
    Ingrediente: model('Ingrediente', IngredienteSchema)
}

