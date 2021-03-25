const {Receta} = require('../models/Platillo');
// const {Usuario} = require('../models/Platillo');

exports.agregarReceta = async (params) => {
    const receta = new Receta(params)
    // const nombre = params.nombre
    // let existeReceta;
    // try{
    //      existeReceta = await Receta.findOne({nombre: nombre});
    // }catch(error){
    //     console.log('Error: ', error.message);
    //     return error
    // }
    // if(existeReceta){
    //     return true
    // }
    try{
        await receta.save()
        return receta
    }catch(error){
        console.log('Error: ', error.message);
        return error
    }
}

exports.listarRecetas = async () => {
    let recetaDB
    try{
        recetaDB = await Receta.find({is_publico: true, is_activo: true}).populate({
            path: "usuario",
            model: "Usuario",
            select: {
                '_id': 1,
                'apellido_paterno': 1,
                'apellido_materno': 1,
                'url_avatar': 1,
                'nombres': 1,
            }
        }).populate({
            path: "platillo",
            model: "Platillo",
            select: {
                '_id': 1,
                'categoria': 1,
                'nombre': 1,
            }
        })
        return recetaDB
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}


exports.obtenerRecetaPorNombre = async (nombre) => {
    let recetaDB
    try{
        recetaDB = await Receta.find({nombre: { $regex: nombre }, is_publico: true, is_activo: true}).populate({
            path: "usuario",
            model: "Usuario",
            select: {
                '_id': 1,
                'apellido_paterno': 1,
                'apellido_materno': 1,
                'url_avatar': 1,
                'nombres': 1,
            }
        }).populate({
            path: "platillo",
            model: "Platillo",
            select: {
                '_id': 1,
                'categoria': 1,
                'nombre': 1,
            }
        })
        return recetaDB
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.obtenerRecetaPorIngredientesId = async (params) => {
    // let recetaDB
    // try{
    //     recetaDB = await Receta.find({nombre: { $regex: nombre }}).populate({
    //         path: "recetaDB",
    //         model: "Usuario",
    //         select: {
    //             '_id': 1,
    //             'apellido_paterno': 1,
    //             'nombres': 1,
    //         }
    //     }).populate({
    //         path: "platillo",
    //         model: "Platillo",
    //         select: {
    //             '_id': 1,
    //             'categoria': 1,
    //             'nombre': 1,
    //         }
    //     })
    //     return recetaDB
    // }catch(error){
    //     console.log('Error: ', error.message)
    //     return error
    // }
    

    const ingredientes_array = params.ingredientes_array;
    const cantidad = ingredientes_array.length;
    let recetaDB
    try{
        recetaDB = await Usuario.find({is_publico: true, is_activo: true}).populate({
            path: "usuario",
            model: "Usuario",
            select: {
                '_id': 1,
                'apellido_paterno': 1,
                'apellido_materno': 1,
                'url_avatar': 1,
                'nombres': 1,
            }
        }).populate({
            path: "platillo",
            model: "Platillo",
            select: {
                '_id': 1,
                'categoria': 1,
                'nombre': 1,
            }
        })
        const array = []
        recetaDB.map((receta) => {
            let contador = 0;
            receta.ingredientes.map(ingrediente => {
                ingredientes_array.map(i => {
                    if(i == ingrediente.id){ //por ID
                        contador++
                    }
                })
            })
            if(contador == cantidad){
                array.push(receta)
            }
        })
        return array;
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

// exports.obtenerPlatilloPorTipo = async (tipo) => {
//     let recetaDB
//     try{
//         recetaDB = await Receta.find({tipo_ingrediente: tipo})
//         return recetaDB
//     }catch(error){
//         console.log('Error: ', error.message)
//         return error
//     }
// }

exports.obtenerReceta = async (id) => {
    let recetaDB;
    try{
        recetaDB = await Receta.findOne({_id: id, is_activo: true}).populate({
            path: "usuario",
            model: "Usuario",
            select: {
                '_id': 1,
                'apellido_paterno': 1,
                'apellido_materno': 1,
                'url_avatar': 1,
                'nombres': 1,
            }
        }).populate({
            path: "platillo",
            model: "Platillo",
            select: {
                '_id': 1,
                'categoria': 1,
                'nombre': 1,
            }
        });
        if(!recetaDB){
            return false
        }else {
            return recetaDB
        }
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.obtenerRecetaPorPlatillo = async (id) => {
    let recetaDB
    try{
        recetaDB = await Receta.find({platillo: id, is_publico: true, is_activo: true}).populate({
            path: "usuario",
            model: "Usuario",
            select: {
                '_id': 1,
                'apellido_paterno': 1,
                'apellido_materno': 1,
                'url_avatar': 1,
                'nombres': 1,
            }
        }).populate({
            path: "platillo",
            model: "Platillo",
            select: {
                '_id': 1,
                'categoria': 1,
                'nombre': 1,
            }
        })
        return recetaDB
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.obtenerMisRecetas = async (id) => {
    let recetaDB
    try{
        recetaDB = await Receta.find({usuario: id, is_activo: true}).populate({
            path: "usuario",
            model: "Usuario",
            select: {
                '_id': 1,
                'apellido_paterno': 1,
                'apellido_materno': 1,
                'url_avatar': 1,
                'nombres': 1,
            }
        }).populate({
            path: "platillo",
            model: "Platillo",
            select: {
                '_id': 1,
                'categoria': 1,
                'nombre': 1,
            }
        })
        return recetaDB
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.obtenerMisFavoritos = async (params) => {
    let recetaDB
    try{
        recetaDB = await Receta.find({is_publico: true, is_activo: true}).populate({
            path: "usuario",
            model: "Usuario",
            select: {
                '_id': 1,
                'apellido_paterno': 1,
                'apellido_materno': 1,
                'url_avatar': 1,
                'nombres': 1,
            }
        }).populate({
            path: "platillo",
            model: "Platillo",
            select: {
                '_id': 1,
                'categoria': 1,
                'nombre': 1,
            }
        })
        const newRecetaDB = []
        params.map(item => {
            recetaDB.map(receta => {
                if(item == receta._id){
                    newRecetaDB.push(receta);
                }
            })
        })
        return newRecetaDB
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.modificarReceta = async (params, id) => {
    // const nombre = params.nombre
    // let existeReceta
    // try{
    //     existeReceta = await Receta.findOne({nombre: nombre});
    // }catch(error){
    //     console.log('Error: ', error.message);
    //     return error   
    // }
    // if(existeReceta){
    //     if(existeReceta._id != id){
    //         return true
    //     }
    // }
    try{
        const updated = await Receta.findByIdAndUpdate(id, params);
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
