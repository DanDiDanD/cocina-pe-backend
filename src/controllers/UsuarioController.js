const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const usuarioService = require("../services/usuarioService");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/index");

const passwordCod = () => {
  /* return crypto.randomBytes(2).toString('hex'); */
  var val = Math.floor(1000 + Math.random() * 9000);
  return val.toString();
}

router.post(
  "/",
  [
    body("correo").not().isEmpty().trim().withMessage("No hay correo"),
    body("password").not().isEmpty().trim().withMessage("No hay password"),
    body("nombres").not().isEmpty().trim().withMessage("No hay nombres"),
    body("apellido_paterno").not().isEmpty().trim().withMessage("No hay apellido_paterno"),
  ],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let existeUsuario = await usuarioService.registrarUsuario(req.body);
    if (existeUsuario === true) {
      res.status(400).json({ code: 400, data: [], message: "Este correo ya existe." });
    } else if (existeUsuario instanceof Error ){
      res.status(500).json({ code: 500, data: [], message: "Error al crear correo." });
    } else {
      res.status(200).json({ code: 200, data: [], message: "Usuario creado correctamente."});
    }
  }
);

router.post(
  "/login",
  [
    body("correo").not().isEmpty().trim().withMessage("No hay correo"),
    body("password").not().isEmpty().trim().withMessage("No hay password"),
  ],
  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let userDB = await usuarioService.autenticarUsuario(req.body);

    if (userDB === null) {
      // Si el usuario no existe

      res
        .status(400)
        .json({ code: 400, data: [], message: "Ese correo no está registrado" });
      next();
    } else {
      // El usuario existe, verificar si el password es correcto o incorrecto
      if (userDB === false) {
        // si el password es incorrecto
        res
          .status(401)
          .json({ code: 401, data: [], message: "Password Incorrecto" });
        next();
      } else {
        // password correcto, firmar el token
        const token = jwt.sign(
          {
            _id: userDB._id,
            tipo_usuario: userDB.tipo_usuario,
            correo: userDB.correo,
            nombres: userDB.nombres,
            apellido_paterno: userDB.apellido_paterno, 
            apellido_materno: userDB.apellido_materno, 
            id: userDB._id,
            is_premium: userDB.is_premium,
            recetas_favoritas: userDB.recetas_favoritas,
          },
          JWT_SECRET,
          {
            expiresIn: '7d',
          }
        );
        res.json({ code: 200, data: token, message: "Login exitoso" });
        next();
      }
    }
  }
);

router.get(
  "/", /* [auth],  */
  async (req, res) => {
    const listarUsuarios = await usuarioService.listarUsuarios()
    if(listarUsuarios instanceof Error ){
      res.status(500).json({ code: 500, data: [], message: "Error al listar usuarios." });
    }else{
      res.status(200).json({ code: 200, data: listarUsuarios, message: "Lista de usuarios:."});
    }
  }
);

router.get(
  "/premium", [auth], 
  async (req, res) => {
    const listarUsuarios = await usuarioService.listarUsuariosPremium()
    if(listarUsuarios instanceof Error ){
      res.status(500).json({ code: 500, data: [], message: "Error al listar usuarios." });
    }else{
      res.status(200).json({ code: 200, data: listarUsuarios, message: "Lista de usuarios:."});
    }
  }
);

router.put(
  "/premium/:id", [auth], 
  async (req,res) => {
    const existeEmpleado = await usuarioService.usuarioPremium(req.params.id,req.body);
    if (existeEmpleado == 'no encontrado') {
      res.status(400).json({ code: 400, data: [], message: "Tarjeta rechazada." });
    } else if (existeEmpleado instanceof Error ){
      res.status(500).json({ code: 500, data: [], message: "Error al buscar usuario." });
    } else if (existeEmpleado == true){
      res.status(200).json({ code: 200, data: [], message: "Bienvenido a la comunidad Cocina Pe :) "});
    } else{
      res.status(400).json({ code: 400, data: [], message: existeEmpleado.message.raw.message })
    }
  }
);

// router.get(
//   "/premium/quitar", [auth], 
//   async (req,res) => {
//     const existeEmpleado = await usuarioService.usuarioPremium(req.params.id);
//     if (existeEmpleado == 'no encontrado') {
//       res.status(400).json({ code: 400, data: [], message: "Usuario no encontrado." });
//     } else if (existeEmpleado instanceof Error ){
//       res.status(500).json({ code: 500, data: [], message: "Error al buscar usuario." });
//     } else {
//       res.status(200).json({ code: 200, data: [], message: "Usuario normal: "});
//     }
//   }
// );

router.get(
  "/activo/:activo", [auth], 
  async (req, res) => {
    const listarUsuarios = await usuarioService.listarUsuariosPorActividad(req.params.activo)
    if(listarUsuarios instanceof Error ){
      res.status(500).json({ code: 500, data: [], message: "Error al listar usuarios por actividad." });
    }else{
      res.status(200).json({ code: 200, data: listarUsuarios, message: "Lista de usuarios por actividad:."});
    }
  }
);

router.get(
    "/:id",
    [auth],
  async (req, res) => {
    const usuario = await usuarioService.obtenerUsuario(req.params.id);
    if(usuario === false){
      res.status(400).json({ code: 400, data: [], message: "No se encontró la usuario." });
    } else if (usuario instanceof Error ){
      res.status(500).json({ code: 500, data: [], message: "Error al buscar usuario." });
    } else {
      res.status(200).json({ code: 200, data: [usuario], message: "Usuario: "});
    }
  }
);

router.get(
  "/getByemail/:email",
  async (req, res) => {
    console.log(req.params.email)

    
  const usuario = await usuarioService.obtenerUsuarioByEmail(req.params.email);
  if(usuario === false){
    res.status(400).json({ code: 400, data: [], message: "No se encontró la usuario." });
  } else if (usuario instanceof Error ){
    res.status(500).json({ code: 500, data: [], message: "Error al buscar usuario." });
  } else {
    usuario.recoverycode = passwordCod()
    await usuario.save()
    res.status(200).json({ code: 200, data: usuario, message: "Usuario: "});
  }
}
);

router.put(
  "/:id", [auth], 
  async (req,res) => {
    const existeEmpleado = await usuarioService.modificarUsuario(req.body, req.params.id);
    if (existeEmpleado == true) {
      res.status(400).json({ code: 400, data: [], message: "Ya existe una usuario con ese nombre." });
    } else if(existeEmpleado === false){
      res.status(400).json({ code: 400, data: [], message: "No se encontró la usuario." });
    } else if (existeEmpleado instanceof Error ){
      res.status(500).json({ code: 500, data: [], message: "Error al modificar usuario." });
    } else {
      res.status(200).json({ code: 200, data: [], message: "Usuario modificado correctamente."});
    }
  }
);

router.post(
  "/favoritas",  
  [auth], 
  async (req,res) => {
    const existeEmpleado = await usuarioService.isRecetaFavorita(req.body);
    if (existeEmpleado == 'no encontrado') {
      res.status(400).json({ code: 400, data: [], message: "Usuario no encontrado." });
    } else if (existeEmpleado instanceof Error ){
      res.status(500).json({ code: 500, data: [], message: "Error al buscar usuario." });
    } else {
      res.status(200).json({ code: 200, data: existeEmpleado, message: "Estado de la receta según el usuario: "});
    }
  }
);

router.put(
  "/favoritas/accion",  
  [auth], 
  async (req,res) => {
    const existeEmpleado = await usuarioService.recetaFavorita(req.body);
    if (existeEmpleado == 'no encontrado') {
      res.status(400).json({ code: 400, data: [], message: "Usuario no encontrado." });
    } else if (existeEmpleado instanceof Error ){
      res.status(500).json({ code: 500, data: [], message: "Error al buscar usuario." });
    } else if (existeEmpleado == false){
      res.status(200).json({ code: 200, data: [], message: "Receta agregada a los favoritos del usuario: "});
    } else {
      res.status(200).json({ code: 200, data: [], message: "Receta quitada a los favoritos del usuario: "});
    }
  }
);


module.exports = router;
