const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const auth = require("../middleware/auth");
const categoriaService = require("../services/categoriaService");

router.post(
  "/", [
      auth,
      body("nombre").not().isEmpty().trim().withMessage('No hay nombre')
  ],
  async (req, res) => {
      const existeCategoria = await categoriaService.agregarCategoria(req.body);
      if (existeCategoria === true) {
          res.status(400).json({ code: 400, data: [], message: "Ya existe un categoria con ese nombre." });
        } else if (existeCategoria instanceof Error ){
          res.status(500).json({ code: 500, data: [], message: "Error al crear categoria." });
        } else {
          res.status(200).json({ code: 200, data: [], message: "Categoria creado correctamente."});
        }
  }
);

router.get(
    "/", [auth],
    async (req, res) => {
      const listarCategorias = await categoriaService.listarCategorias();
      if(listarCategorias instanceof Error ){
        res.status(500).json({ code: 500, data: [], message: "Error al listar categoria." });
      }else{
        res.status(200).json({ code: 200, data: listarCategorias, message: "Lista de categorias:."});
      }
    }
);

router.get(
  "/:id",
  [auth],
async (req, res) => {
  const categoria = await categoriaService.obtenerCategoria(req.params.id);
  if(categoria === false){
    res.status(400).json({ code: 400, data: [], message: "No se encontró la categoria." });
  } else if (categoria instanceof Error ){
    res.status(500).json({ code: 500, data: [], message: "Error al buscar categoria." });
  } else {
    res.status(200).json({ code: 200, data: [categoria], message: "Sede: "});
  }
}
);

router.put(
  "/:id", [auth], 
  async (req,res) => {
    const existeCategoria = await categoriaService.modificarCategoria(req.body, req.params.id);
    if (existeCategoria == true) {
      res.status(400).json({ code: 400, data: [], message: "Ya existe una categoria con ese nombre." });
    } else if(existeCategoria === false){
      res.status(400).json({ code: 400, data: [], message: "No se encontró la categoria." });
    } else if (existeCategoria instanceof Error ){
      res.status(500).json({ code: 500, data: [], message: "Error al modificar categoria." });
    } else {
      res.status(200).json({ code: 200, data: [], message: "Sede modificarda correctamente."});
    }
  }
);



module.exports = router;