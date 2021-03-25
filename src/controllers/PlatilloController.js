const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const auth = require("../middleware/auth");
const platilloService = require("../services/platilloService");

router.post(
  "/", [
      auth,
      body("nombre").not().isEmpty().trim().withMessage('No hay nombre')
  ],
  async (req, res) => {
      const existePlatillo = await platilloService.agregarPlatillo(req.body);
      if (existePlatillo === true) {
          res.status(400).json({ code: 400, data: [], message: "Ya existe un platillo con ese nombre." });
        } else if (existePlatillo instanceof Error ){
          res.status(500).json({ code: 500, data: [], message: "Error al crear platillo." });
        } else {
          res.status(200).json({ code: 200, data: [], message: "Platillo creado correctamente."});
        }
  }
);

router.get(
    "/",
    async (req, res) => {
      const listarPlatillos = await platilloService.listarPlatillos();
      if(listarPlatillos instanceof Error ){
        res.status(500).json({ code: 500, data: [], message: "Error al listar platillo." });
      }else{
        res.status(200).json({ code: 200, data: listarPlatillos, message: "Lista de Platillos:."});
      }
    }
);
router.get(
    "/nombre/:nombre", [auth],
    async (req, res) => {
      const listarPlatillos = await platilloService.obtenerPlatilloPorNombre(req.params.nombre);
      if(listarPlatillos instanceof Error ){
        res.status(500).json({ code: 500, data: [], message: "Error al listar platillo." });
      }else{
        res.status(200).json({ code: 200, data: listarPlatillos, message: "Lista de Platillos:."});
      }
    }
);

router.get(
    "/categoria/:categoria", [auth],
    async (req, res) => {
      const listarPlatillos = await platilloService.obtenerPlatilloPorNombreCategoria(req.params.categoria);
      if(listarPlatillos instanceof Error ){
        res.status(500).json({ code: 500, data: [], message: "Error al listar platillo." });
      }else{
        res.status(200).json({ code: 200, data: listarPlatillos, message: "Lista de Platillos:."});
      }
    }
);


router.get(
  "/:id",
  [auth],
async (req, res) => {
  const platillo = await platilloService.obtenerPlatillo(req.params.id);
  if(platillo === false){
    res.status(400).json({ code: 400, data: [], message: "No se encontró la platillo." });
  } else if (platillo instanceof Error ){
    res.status(500).json({ code: 500, data: [], message: "Error al buscar platillo." });
  } else {
    res.status(200).json({ code: 200, data: [platillo], message: "Platillo: "});
  }
}
);


router.put(
  "/:id", [auth], 
  async (req,res) => {
    const existePlatillo = await platilloService.modificarPlatillo(req.body, req.params.id);
    if (existePlatillo == true) {
      res.status(400).json({ code: 400, data: [], message: "Ya existe una platillo con ese nombre." });
    } else if(existePlatillo === false){
      res.status(400).json({ code: 400, data: [], message: "No se encontró la platillo." });
    } else if (existePlatillo instanceof Error ){
      res.status(500).json({ code: 500, data: [], message: "Error al modificar platillo." });
    } else {
      res.status(200).json({ code: 200, data: [], message: "Platillo modificarda correctamente."});
    }
  }
);



module.exports = router;
