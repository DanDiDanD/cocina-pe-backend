const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const auth = require("../middleware/auth");
const ingredienteService = require("../services/ingredienteService");

router.post(
  "/", [
      auth,
      body("nombre").not().isEmpty().trim().withMessage('No hay nombre')
  ],
  async (req, res) => {
      const existeIngrediente = await ingredienteService.agregarIngrediente(req.body);
      if (existeIngrediente === true) {
          res.status(400).json({ code: 400, data: [], message: "Ya existe un ingrediente con ese nombre." });
        } else if (existeIngrediente instanceof Error ){
          res.status(500).json({ code: 500, data: [], message: "Error al crear ingrediente." });
        } else {
          res.status(200).json({ code: 200, data: [], message: "Ingrediente creado correctamente."});
        }
  }
);

router.get(
    "/", [auth],
    async (req, res) => {
      const listarIngredientes = await ingredienteService.listarIngredientes();
      if(listarIngredientes instanceof Error ){
        res.status(500).json({ code: 500, data: [], message: "Error al listar ingrediente." });
      }else{
        res.status(200).json({ code: 200, data: listarIngredientes, message: "Lista de Ingredientes:."});
      }
    }
);
router.get(
    "/nombre/:nombre", [auth],
    async (req, res) => {
      const listarIngredientes = await ingredienteService.obtenerIngredientePorNombre(req.params.nombre);
      if(listarIngredientes instanceof Error ){
        res.status(500).json({ code: 500, data: [], message: "Error al listar ingrediente." });
      }else{
        res.status(200).json({ code: 200, data: listarIngredientes, message: "Lista de Ingredientes:."});
      }
    }
);

router.get(
    "/tipo/:tipo", [auth],
    async (req, res) => {
      const listarIngredientes = await ingredienteService.obtenerIngredientePorTipo(req.params.tipo);
      if(listarIngredientes instanceof Error ){
        res.status(500).json({ code: 500, data: [], message: "Error al listar ingrediente." });
      }else{
        res.status(200).json({ code: 200, data: listarIngredientes, message: "Lista de Ingredientes:."});
      }
    }
);

router.get(
  "/:id",
  [auth],
async (req, res) => {
  const ingrediente = await ingredienteService.obtenerIngrediente(req.params.id);
  if(ingrediente === false){
    res.status(400).json({ code: 400, data: [], message: "No se encontró la ingrediente." });
  } else if (ingrediente instanceof Error ){
    res.status(500).json({ code: 500, data: [], message: "Error al buscar ingrediente." });
  } else {
    res.status(200).json({ code: 200, data: [ingrediente], message: "Ingrediente: "});
  }
}
);


router.put(
  "/:id", [auth], 
  async (req,res) => {
    const existeIngrediente = await ingredienteService.modificarIngrediente(req.body, req.params.id);
    if (existeIngrediente == true) {
      res.status(400).json({ code: 400, data: [], message: "Ya existe una ingrediente con ese nombre." });
    } else if(existeIngrediente === false){
      res.status(400).json({ code: 400, data: [], message: "No se encontró la ingrediente." });
    } else if (existeIngrediente instanceof Error ){
      res.status(500).json({ code: 500, data: [], message: "Error al modificar ingrediente." });
    } else {
      res.status(200).json({ code: 200, data: [], message: "Ingrediente modificarda correctamente."});
    }
  }
);



module.exports = router;