const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const auth = require("../middleware/auth");
const empleadoService = require("../services/empleadoService");


router.post(
    "/", [
        auth,
        body("nombre").not().isEmpty().trim().withMessage('No hay nombre'),
        body("apellidoPaterno").not().isEmpty().trim().withMessage('No hay apellidoPaterno'),
        body("dni").not().isEmpty().trim().withMessage('No hay dni'),
    ], 
    async (req, res) => {
        const existeEmpleado = await empleadoService.agregarEmpleado(req.body);
        if (existeEmpleado === true) {
            res.status(400).json({ code: 400, data: [], message: "Ya existe un empleado con ese número de DNI." });
          } else if (existeEmpleado instanceof Error ){
            res.status(500).json({ code: 500, data: [], message: "Error al crear empleado." });
          } else {
            res.status(200).json({ code: 200, data: [], message: "Empleado creado correctamente."});
          }
    }
);

router.get(
    "/estado/:estado", [auth], 
    async (req, res) => {
        const listaEmpleados = await empleadoService.listarEmpleados(req.params.estado);
        if (listaEmpleados instanceof Error ){
            res.status(500).json({ code: 500, data: [], message: "Error al listar empleados." });
        } else {
            res.status(200).json({ code: 200, data: listaEmpleados, message: "Lista de empleados: "});
        }
        
    }
);

router.get(
    "/:id",
    [auth],
    async (req, res) => {
        const empleado = await empleadoService.obtenerEmpleado(req.params.id);
        if(empleado === false){
        res.status(400).json({ code: 400, data: [], message: "No se encontró la empleado." });
        } else if (empleado instanceof Error ){
        res.status(500).json({ code: 500, data: [], message: "Error al buscar empleado." });
        } else {
        res.status(200).json({ code: 200, data: [empleado], message: "Empleado: "});
        }
    }
);

router.post(
    "/obtenerAsistencias/:id", [auth],
    async (req, res) => {
        const asistencias = await empleadoService.obtenerEmpleadoAsistencia(req.params.id, req.body);
        if(asistencias === false){
        res.status(400).json({ code: 400, data: [], message: "No se encontró la empleado." });
        } else if (asistencias instanceof Error ){
        res.status(500).json({ code: 500, data: [], message: "Error al buscar empleado." });
        } else {
        res.status(200).json({ code: 200, data: asistencias, message: "Asistencias: "});
        }
    }
);

router.post(
    "/obtenerAsistenciasEmpleado", [auth],
    async (req, res) => {
        const listaEmpleados = await empleadoService.obtenerEmpleadosAsistencia(req.body);
        if (listaEmpleados instanceof Error ){
            res.status(500).json({ code: 500, data: [], message: "Error al listar empleados." });
        } else {
            res.status(200).json({ code: 200, data: listaEmpleados, message: "Lista de empleados: "});
        }
    }
);

router.put(
    "/:id", [auth], 
    async (req, res) => {
        const existeEmpleadoRepetido = await empleadoService.modificarEmpleado(req.body, req.params.id);
        if (existeEmpleadoRepetido === true) {
        res.status(400).json({ code: 400, data: [], message: "Ya existe un empleado con ese número de DNI." });
        } else if( existeEmpleadoRepetido === false){
        res.status(400).json({ code: 400, data: [], message: "Empleado no encontrado."});
        } else if (existeEmpleadoRepetido instanceof Error ){
        res.status(500).json({ code: 500, data: [], message: "Error al modificado empleado." });
        } else {
        res.status(200).json({ code: 200, data: [], message: "Empleado modificado correctamente."});
        }
    }
);

router.get(
    "/modificarEstado/:id", [
        auth
    ], 
    async (req, res) => {
        const estadoEmpleado = await empleadoService.estadoEmpleado(req.params.id);
        if (estadoEmpleado === false ) {
            res.status(400).json({ code: 400, data: [], message: "No se encontró al empleado." });
        } else if (estadoEmpleado instanceof Error ){
            res.status(500).json({ code: 500, data: [], message: "Error al cambiar el estado del empleado." });
        } else if (estadoEmpleado === '1'){
            res.status(200).json({ code: 200, data: [], message: "Empleado reincorporado correctamente."});
        } else if (estadoEmpleado === '2'){
            res.status(200).json({ code: 200, data: [], message: "Empleado eliminado correctamente."});
        }
    }
);


router.post(
    "/inicioAsistencia/:dni",
    [auth], 
    async (req, res) => {
        const inicioAsistencia = await empleadoService.inicioAsistencia(req.params.dni, req.body)
        if (inicioAsistencia == null){
            res.status(400).json({ code: 400, data: [], message: "No existe empleado con ese DNI." });
        }else if(inicioAsistencia instanceof Error){
            res.status(500).json({ code: 500, data: [], message: "Error traer el tipo de asistencia del empleado." });
        }else {
            res.status(200).json({ code: 200, data: [inicioAsistencia], message: "Tipo asistencia: " });
        }
    }
)

router.post(
    "/asistencia/:id",
    [
        auth,
        body("fecha").not().isEmpty().trim().withMessage('No hay fecha'),
        body("hora").not().isEmpty().trim().withMessage('No hay hora'),
        body("temperatura").not().isEmpty().trim().withMessage('No hay temperatura'),
        body("sede").not().isEmpty().trim().withMessage('No hay sede'),
    ],
    async (req, res) => {
        const asistencia = await empleadoService.empleadoAsistencia(req.params.id, req.body)
        if (asistencia == null){
            res.status(400).json({ code: 400, data: [], message: "No existe empleado con ese DNI." });
        }else if(asistencia instanceof Error){
            res.status(500).json({ code: 500, data: [], message: "Error traer el tipo de asistencia del empleado." });
        }else if(asistencia) {
            res.status(200).json({ code: 200, data: [], message: "Asistencia de ingreso registrada: " });
        }else{
            res.status(200).json({ code: 200, data: [], message: "Asistencia de salida registrada: " });
        }
    }
)



module.exports = router;
