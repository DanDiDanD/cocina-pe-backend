const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const auth = require("../middleware/auth");
const recetaService = require("../services/recetaService");

router.post(
  "/", [
      auth,
      body("nombre").not().isEmpty().trim().withMessage('No hay nombre')
  ],
  async (req, res) => {
      const existeReceta = await recetaService.agregarReceta(req.body);
      if (existeReceta === true) {
          res.status(400).json({ code: 400, data: [], message: "Ya existe un receta con ese nombre." });
        } else if (existeReceta instanceof Error ){
          res.status(500).json({ code: 500, data: [], message: "Error al crear receta." });
        } else {
          res.status(200).json({ code: 200, data: [existeReceta], message: "Receta creado correctamente."});
        }
  }
);

router.get(
    "/", [auth],
    async (req, res) => {
      const listarRecetas = await recetaService.listarRecetas();
      if(listarRecetas instanceof Error ){
        res.status(500).json({ code: 500, data: [], message: "Error al listar receta." });
      }else{
        res.status(200).json({ code: 200, data: listarRecetas, message: "Lista de Recetas:."});
      }
    }
);
router.get(
    "/nombre/:nombre", [auth],
    async (req, res) => {
      const listarRecetas = await recetaService.obtenerRecetaPorNombre(req.params.nombre);
      if(listarRecetas instanceof Error ){
        res.status(500).json({ code: 500, data: [], message: "Error al listar receta." });
      }else{
        res.status(200).json({ code: 200, data: listarRecetas, message: "Lista de Recetas:."});
      }
    }
);

router.get(
    "/categoria/:categoria", [auth],
    async (req, res) => {
      const listarRecetas = await recetaService.obtenerRecetaPorNombreCategoria(req.params.categoria);
      if(listarRecetas instanceof Error ){
        res.status(500).json({ code: 500, data: [], message: "Error al listar receta." });
      }else{
        res.status(200).json({ code: 200, data: listarRecetas, message: "Lista de Recetas:."});
      }
    }
);


router.get(
  "/:id",
  [auth],
async (req, res) => {
  const receta = await recetaService.obtenerReceta(req.params.id);
  if(receta === false){
    res.status(400).json({ code: 400, data: [], message: "No se encontró la receta." });
  } else if (receta instanceof Error ){
    res.status(500).json({ code: 500, data: [], message: "Error al buscar receta." });
  } else {
    res.status(200).json({ code: 200, data: [receta], message: "Receta: "});
  }
}
);

router.get(
  "/platillos/:id",
  [auth],
async (req, res) => {
  const receta = await recetaService.obtenerRecetaPorPlatillo(req.params.id);
  if(receta === false){
    res.status(400).json({ code: 400, data: [], message: "No se encontró la receta." });
  } else if (receta instanceof Error ){
    res.status(500).json({ code: 500, data: [], message: "Error al buscar receta." });
  } else {
    res.status(200).json({ code: 200, data: receta, message: "Receta: "});
  }
}
);

router.get(
  "/usuario/:id",
  [auth],
async (req, res) => {
  const receta = await recetaService.obtenerMisRecetas(req.params.id);
  if(receta === false){
    res.status(400).json({ code: 400, data: [], message: "No se encontró la receta." });
  } else if (receta instanceof Error ){
    res.status(500).json({ code: 500, data: [], message: "Error al buscar receta." });
  } else {
    res.status(200).json({ code: 200, data: receta, message: "Receta: "});
  }
}
);


router.put(
  "/:id", [auth], 
  async (req,res) => {
    const existeReceta = await recetaService.modificarReceta(req.body, req.params.id);
    if (existeReceta == true) {
      res.status(400).json({ code: 400, data: [], message: "Ya existe una receta con ese nombre." });
    } else if(existeReceta === false){
      res.status(400).json({ code: 400, data: [], message: "No se encontró la receta." });
    } else if (existeReceta instanceof Error ){
      res.status(500).json({ code: 500, data: [], message: "Error al modificar receta." });
    } else {
      res.status(200).json({ code: 200, data: [], message: "Receta modificarda correctamente."});
    }
  }
);

router.post(
  "/favoritos", [auth], 
  async (req,res) => {
    const listarRecetas = await recetaService.obtenerMisFavoritos(req.body);
    if(listarRecetas instanceof Error ){
      res.status(500).json({ code: 500, data: [], message: "Error al listar receta." });
    }else{
      res.status(200).json({ code: 200, data: listarRecetas, message: "Lista de Recetas:."});
    }
  }
);

// router.get(
//   "/ingredientes/nombre", [auth],
//   async (req, res) => {
//     const listarRecetas = await recetaService.obtenerRecetaPorNombre(req.params.nombre);
//     if(listarRecetas instanceof Error ){
//       res.status(500).json({ code: 500, data: [], message: "Error al listar receta." });
//     }else{
//       res.status(200).json({ code: 200, data: listarRecetas, message: "Lista de Recetas:."});
//     }
//   }
// );

router.post(
  "/ingredientes", [auth],
  async (req, res) => {
    const listarRecetas = await recetaService.obtenerRecetaPorIngredientesId(req.body);
    if(listarRecetas instanceof Error ){
      res.status(500).json({ code: 500, data: [], message: "Error al listar receta." });
    }else{
      res.status(200).json({ code: 200, data: listarRecetas, message: "Lista de Recetas:."});
    }
  }
);



module.exports = router;

