const {Platillo} = require('../models/Platillo');


exports.agregarPlatillo = async (params) => {
    const platillo = new Platillo(params)
    const nombre = params.nombre
    let existePlatillo;
    try{
         existePlatillo = await Platillo.findOne({nombre: nombre});
    }catch(error){
        console.log('Error: ', error.message);
        return error
    }
    if(existePlatillo){
        return true
    }
    try{
        await platillo.save()
        return platillo
    }catch(error){
        console.log('Error: ', error.message);
        return error
    }
    
}

exports.listarPlatillos = async () => {
    let platilloDB
    try{
        platilloDB = await Platillo.find().sort({nombre: 1})
        return platilloDB
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.obtenerPlatilloPorNombre = async (nombre) => {
    let platilloDB
    try{
        platilloDB = await Platillo.find({nombre: { $regex: nombre }})
        return platilloDB
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.obtenerPlatilloPorNombreCategoria = async (nombre) => {
    let platilloDB
    try{
        platilloDB = await Platillo.find({categoria: { $regex: nombre }})
        return platilloDB
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

// exports.obtenerPlatilloPorTipo = async (tipo) => {
//     let platilloDB
//     try{
//         platilloDB = await Platillo.find({tipo_ingrediente: tipo})
//         return platilloDB
//     }catch(error){
//         console.log('Error: ', error.message)
//         return error
//     }
// }

exports.obtenerPlatillo = async (id) => {
    let platilloDB;
    try{
        platilloDB = await Platillo.findOne({_id: id});
        if(!platilloDB){
            return false
        }else {
            return platilloDB
        }
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.modificarPlatillo = async (params, id) => {
    const nombre = params.nombre
    let existePlatillo
    try{
        existePlatillo = await Platillo.findOne({nombre: nombre});
    }catch(error){
        console.log('Error: ', error.message);
        return error   
    }
    if(existePlatillo){
        if(existePlatillo._id != id){
            return true
        }
    }
    try{
        const updated = await Platillo.findByIdAndUpdate(id, params);
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
