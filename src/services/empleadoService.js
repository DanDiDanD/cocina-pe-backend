const Empleado = require('../models/Empleado');
const moment =  require('moment')

exports.agregarEmpleado = async (params) => {
    const empleado = new Empleado(params)
    const dniEmpleado = params.dni
    let existeDni;
    try{
        existeDni = await Empleado.findOne({dni: dniEmpleado});
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
    if(existeDni){
        return true;
    }else{
        try{
            await empleado.save()
            return empleado;
        }catch(error){
            console.log('Error: ', error.message)
            return error
        }
    }
}
exports.listarEmpleados = async (estado) => {
    let empleadosDB;
    try{
        empleadosDB = await Empleado.find({estado: estado})
        // .populate({
        //     path: "sede",
        //     model: "Sede",
        //     select: {
        //         'nombre': 1,
        //         '_id': 0
        //     }
        // })
        .select('_id nombre apellidoPaterno apellidoMaterno  dni' )
        return empleadosDB
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}


exports.obtenerEmpleado = async (id) => {
    let empleadoDB;
    try{
        empleadoDB = await Empleado.findOne({_id: id})
        // .populate({
        //     path: "sede",
        //     model: "Sede",
        // })
        .select('_id nombre apellidoPaterno apellidoMaterno direccion dni telefono especialidad' )
        if(!empleadoDB){
            return false
        }else {
            return empleadoDB
        }
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.obtenerEmpleadosAsistencia = async (params) => {
    const {nombreSede, fechaInicio, fechaFinal} = params
    
    let empleadosDB;
    try{
        empleadosDB = await Empleado.find({})
        // .populate({
        //     path: "sede",
        //     model: "Sede",
        //     select: {
        //         'nombre': 1,
        //         '_id': 0
        //     }
        // })
        .select('_id nombre apellidoPaterno apellidoMaterno dni asistencia estado especialidad' ).sort({apellidoPaterno: 1, apellidoMaterno: 1, nombre: 1})
        const startDate = moment(fechaInicio, "DD/MM/YYYY");
        const endDate = moment(fechaFinal, "DD/MM/YYYY")
        const listarEmpleados = []
        empleadosDB.map(empleado => {
            let datosEmpleados = {   
                _id: empleado._id,
                nombre: empleado.nombre,
                apellidoPaterno: empleado.apellidoPaterno,
                apellidoMaterno: empleado.apellidoMaterno,
                dni: empleado.dni,
                especialidad: empleado.especialidad,
                asistencia: []
            };
            const asistencias = empleado.asistencia;
            if(nombreSede.length == 0){                
                for(let i = asistencias.length - 1; i >= 0; i--){
                    const date = moment(asistencias[i].fechaAsistencia,"DD/MM/YYYY")
                    if ((date.isBefore(endDate) && date.isAfter(startDate) || (date.isSame(startDate) || date.isSame(endDate)))) { 
                        datosEmpleados.asistencia.push(asistencias[i])
                    } 
                    if(date.isBefore(startDate)){
                        i = -1;
                    }
                    
                }
                if(datosEmpleados.asistencia.length != 0 || empleado.estado == true){
                    listarEmpleados.push(datosEmpleados);
                }
            }
            else{
                for(let i = asistencias.length - 1; i >= 0; i--){
                    const date = moment(asistencias[i].fechaAsistencia,"DD/MM/YYYY")
                    if ((date.isBefore(endDate) && date.isAfter(startDate) || (date.isSame(startDate) || date.isSame(endDate)))) { 
                        let asiste = {
                            fechaAsistencia: asistencias[i].fechaAsistencia,
                            horasExtras: asistencias[i].horasExtras,
                            detalleAsistencias: []
                        }
                        const detalleAsistencias = asistencias[i].detalleAsistencias
                        for(let w in detalleAsistencias){
                            if(nombreSede == detalleAsistencias[w].sede){
                                asiste.detalleAsistencias.push(detalleAsistencias[w])
                            }
                        }
                        
                        if(asiste.detalleAsistencias != 0){
                            datosEmpleados.asistencia.push(asiste)
                        }
                    } 
                    if(date.isBefore(startDate)){
                        i = -1;
                    }
                    
                }
                if(datosEmpleados.asistencia.length != 0){
                    listarEmpleados.push(datosEmpleados);
                }
            }
            
        })
        return listarEmpleados;

    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.obtenerEmpleadoAsistencia = async (id, rangoFechas) => {
    let empleadoDB;
    try{
        empleadoDB = await Empleado.findOne({_id: id})
        if(!empleadoDB){
            return false
        }else {
            const startDate = moment(rangoFechas.fechaInicio, "DD/MM/YYYY");
            const endDate = moment(rangoFechas.fechaFinal, "DD/MM/YYYY")
            const asistenciaEnRango=[];
            
            for(let x in empleadoDB.asistencia){
                const date = moment(empleadoDB.asistencia[x].fechaAsistencia,"DD/MM/YYYY")
                if ((date.isBefore(endDate) && date.isAfter(startDate) || (date.isSame(startDate) || date.isSame(endDate)))) { 
                    asistenciaEnRango.push(empleadoDB.asistencia[x])
                } 
            }
            return asistenciaEnRango
        }
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
}

exports.modificarEmpleado = async (params, id) => {
    const dniEmpleado = params.dni
    let existeDniEmpleado
    try{
        existeDniEmpleado = await Empleado.findOne({dni: dniEmpleado});
    }catch(error){
        console.log('Error: ', error.message);
        return error   
    }
    if(existeDniEmpleado){
        if(existeDniEmpleado._id != id){
            return true
        }
    }
    try{
        const updated = await Empleado.findByIdAndUpdate(id, params);
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

exports.estadoEmpleado = async (id) => {
    let existeEmpleado
    try{
        existeEmpleado = await Empleado.findOne({_id: id})
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
    if(existeEmpleado){
        try{
            const updated = await Empleado.findByIdAndUpdate(id, {estado: !existeEmpleado.estado});
            if(updated){
                if(!existeEmpleado.estado){
                    return '1'
                }
                else{
                    return '2'
                }
            }else{
                return false
            }
        }catch(error){
            console.log('Error: ', error.message);
            return error
        }
    }
    else{
        return false
    }

}



exports.inicioAsistencia = async (dni, params) => {
    const sede = params.sede
    const momento = moment();
    let empleado;
    try{
        empleado = await Empleado.findOne({dni: dni, estado: true})
        // .populate({
        //     path: "sede",
        //     model: "Sede",
        //     select: {
        //         'nombre': 1,
        //         '_id': 0
        //     }
        // })
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
    if(empleado != null){
        const fecha = momento.format("DD-MM-YYYY");
        const hora = momento.format("HH:mm");
        const inicioAsistencia = {
            fecha: fecha,
            hora: hora,
            nombre: empleado.nombre,
            apellidoPaterno: empleado.apellidoPaterno,
            apellidoMaterno: empleado.apellidoMaterno,
            id: empleado._id,
            dni: empleado.dni,
            especialidad: empleado.especialidad
            // sedeEmpleado: empleado.sede.nombre
        }

        const filter = empleado.asistencia.filter(asist => asist.fechaAsistencia == fecha)
        if(filter.length == 0){
            inicioAsistencia.estado = true;
            return inicioAsistencia
        }
        else {
            const posicion = posicionFecha(empleado.asistencia, fecha);
            if(posicion != ''){
                cantidadAsistencias = empleado.asistencia[posicion].detalleAsistencias.length;
                if(empleado.asistencia[posicion].detalleAsistencias[cantidadAsistencias-1].sede == sede){
                    if(cantidadAsistencias == 0){
                        inicioAsistencia.estado = true;
                        return inicioAsistencia
                    }
                    else{
                        const he = empleado.asistencia[posicion].detalleAsistencias[cantidadAsistencias-1].horaEntrada
                        const te = empleado.asistencia[posicion].detalleAsistencias[cantidadAsistencias-1].temperaturaEntrada
                        const hs = empleado.asistencia[posicion].detalleAsistencias[cantidadAsistencias-1].horaSalida
                        const ts = empleado.asistencia[posicion].detalleAsistencias[cantidadAsistencias-1].temperaturaSalida
                        if(hs.length == 0 && ts.length == 0 && he.length != 0 && te.length != 0){
                            inicioAsistencia.estado = false;
                            return inicioAsistencia
                        }
                        else {
                            inicioAsistencia.estado = true;
                            return inicioAsistencia
                        }
                    }
                }
                else{
                    inicioAsistencia.estado = true;
                    return inicioAsistencia
                }
            }     
        }
        
    }
    else{
        return empleado;
    }
}


exports.empleadoAsistencia = async (dni, params) => {
    const fecha = params.fecha
    const hora = params.hora
    const temperatura = params.temperatura
    const sede = params.sede
    let empleado
    try{
        empleado = await Empleado.findOne({dni: dni, estado: true});
    }catch(error){
        console.log('Error: ', error.message)
        return error
    }
    if(empleado != null){
        const filter = empleado.asistencia.filter(asist => asist.fechaAsistencia == fecha)
        if(filter.length == 0){
            const asistencia = {
                fechaAsistencia: fecha,
                horasExtras: false,
                detalleAsistencias: []
            }
            empleado.asistencia.push(asistencia)
            try{
                await empleado.save();
            }catch(error){
                console.log('Error: ', error.message)
                return error
            }
        }
        const posicion = posicionFecha(empleado.asistencia, fecha);
        if(posicion != ''){
            cantidadAsistencias = empleado.asistencia[posicion].detalleAsistencias.length;
            if(cantidadAsistencias == 0){
                const nuevaAsistencia = {
                    horaEntrada: hora,
                    temperaturaEntrada: temperatura,
                    horaSalida: '',
                    temperaturaSalida: '',
                    sede: sede
                }
                empleado.asistencia[posicion].detalleAsistencias.push(nuevaAsistencia);
                try{
                    await empleado.save();
                    return true
                }catch(error){
                    console.log('Error: ', error.message)
                    return error
                }
            }
            else{
                const he = empleado.asistencia[posicion].detalleAsistencias[cantidadAsistencias-1].horaEntrada
                const te = empleado.asistencia[posicion].detalleAsistencias[cantidadAsistencias-1].temperaturaEntrada
                const hs = empleado.asistencia[posicion].detalleAsistencias[cantidadAsistencias-1].horaSalida
                const ts = empleado.asistencia[posicion].detalleAsistencias[cantidadAsistencias-1].temperaturaSalida
                if((hs.length == 0 && ts.length == 0 && he.length != 0 && te.length != 0) && (empleado.asistencia[posicion].detalleAsistencias[cantidadAsistencias-1].sede == sede)){
                    empleado.asistencia[posicion].detalleAsistencias[cantidadAsistencias-1].horaSalida = hora
                    empleado.asistencia[posicion].detalleAsistencias[cantidadAsistencias-1].temperaturaSalida = temperatura
                    try{
                        await empleado.save();
                        return false
                    }catch(error){
                        console.log('Error: ', error.message)
                        return error
                    }
                }
                else {
                    const nuevaAsistencia = {
                        horaEntrada: hora,
                        temperaturaEntrada: temperatura,
                        horaSalida: '',
                        temperaturaSalida: '',
                        sede: sede
                    }
                    empleado.asistencia[posicion].detalleAsistencias.push(nuevaAsistencia);
                    try{
                        await empleado.save();
                        return true;
                    }catch(error){
                        console.log('Error: ', error.message)
                        return error
                    }
                }
            }
        }     
    }
    else{
        return empleado
    }
}

const posicionFecha = (arregloAsistencia, fecha) => {
    let posicion = '';
    for(let i in arregloAsistencia){
        if(arregloAsistencia[i].fechaAsistencia == fecha){
            posicion = i;
        }
    }
    return posicion;
}

// exports.empezarAsistenciaEmpleados = async (req, res) => {
//     const empleadosDB = await Empleado.find({estado: true});
//     const fecha = moment().format("DD-MM-YYYY");
//     const asistencia = {
//         fechaAsistencia: fecha,
//         horasExtras: false,
//         detalleAsistencias: []
//     }
//     for(let i in empleadosDB){
//         const filter = empleadosDB[i].asistencia.filter(asist => asist.fechaAsistencia == fecha)
//         if(filter.length == 0){
//             empleadosDB[i].asistencia.push(asistencia);
//             await empleadosDB[i].save();
//         }
//     }
//     res.status(200).json({message: 'Asistencia iniciada:'})
// }