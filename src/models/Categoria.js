const { Schema, model} = require('mongoose');

const CategoriaSchema = new Schema({
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
    }
})

module.exports = {
    CategoriaSchema,
    Categoria: model('Categoria', CategoriaSchema)
}
// module.exports =  model('Categoria', CategoriaSchema)