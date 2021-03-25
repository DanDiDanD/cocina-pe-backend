const {Categoria} = require('../models/Categoria');


exports.agregarCategoria = async (params) => {
    const categoria = new Categoria(params)
    const nombre = params.nombre
    let existeCategoria;
    try{
         existeCategoria = await Categoria.findOne({nombre: nombre});
    }catch(error){
        console.log('Error: ', error.message);
        return error
    }
    if(existeCategoria){
        return true
    }
    try{
        await categoria.save()
        return categoria
    }catch(error){
        console.log('Error: ', error.message);
        return error
    }
    
}

exports.listarCategorias = async () => {
    let categoriaDB
    try{
        categoriaDB = await Categoria.find()
        return categoriaDB
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.obtenerCategoria = async (id) => {
    let categoriaDB;
    try{
        categoriaDB = await Categoria.findOne({_id: id});
        if(!categoriaDB){
            return false
        }else {
            return categoriaDB
        }
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.modificarCategoria = async (params, id) => {
    const nombre = params.nombre
    let existeCategoria
    try{
        existeCategoria = await Categoria.findOne({nombre: nombre});
    }catch(error){
        console.log('Error: ', error.message);
        return error   
    }
    if(existeCategoria){
        if(existeCategoria._id != id){
            return true
        }
    }
    try{
        const updated = await Categoria.findByIdAndUpdate(id, params);
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
