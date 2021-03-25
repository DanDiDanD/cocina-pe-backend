const usuarioController = require('../controllers/UsuarioController');
const categoriaController = require('../controllers/CategoriaController');
const ingredienteController = require('../controllers/IngredienteController');
const platilloController = require('../controllers/PlatilloController');
const recetaController = require('../controllers/RecetaController');


module.exports = function (app) {
    app.use('/usuarios', usuarioController)
    app.use('/categorias', categoriaController)
    app.use('/ingredientes', ingredienteController)
    app.use('/platillos', platilloController)
    app.use('/recetas', recetaController)
}
