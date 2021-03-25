const {Ingrediente} = require('../models/Ingrediente');


exports.agregarIngrediente = async (params) => {
    const ingrediente = new Ingrediente(params)
    const nombre = params.nombre
    let existeIngrediente;
    try{
         existeIngrediente = await Ingrediente.findOne({nombre: nombre});
    }catch(error){
        console.log('Error: ', error.message);
        return error
    }
    if(existeIngrediente){
        return true
    }
    try{
        await ingrediente.save()
        return ingrediente
    }catch(error){
        console.log('Error: ', error.message);
        return error
    }
    
}

exports.listarIngredientes = async () => {
    let ingredienteDB
    try{
        ingredienteDB = await Ingrediente.find().sort({nombre: 1})
        return ingredienteDB
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.obtenerIngredientePorNombre = async (nombre) => {
    let ingredienteDB
    try{
        ingredienteDB = await Ingrediente.find({nombre: { $regex: nombre }})
        return ingredienteDB
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.obtenerIngredientePorTipo = async (tipo) => {
    let ingredienteDB
    try{
        ingredienteDB = await Ingrediente.find({tipo_ingrediente: tipo})
        return ingredienteDB
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.obtenerIngrediente = async (id) => {
    let ingredienteDB;
    try{
        ingredienteDB = await Ingrediente.findOne({_id: id});
        if(!ingredienteDB){
            return false
        }else {
            return ingredienteDB
        }
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.modificarIngrediente = async (params, id) => {
    const nombre = params.nombre
    let existeIngrediente
    try{
        existeIngrediente = await Ingrediente.findOne({nombre: nombre});
    }catch(error){
        console.log('Error: ', error.message);
        return error   
    }
    if(existeIngrediente){
        if(existeIngrediente._id != id){
            return true
        }
    }
    try{
        const updated = await Ingrediente.findByIdAndUpdate(id, params);
        if(updated){
            return updated
        }else{
            return false
        }
    }catch(error){
        console.log('Error: ', error.message);
        return error
    } 
}
