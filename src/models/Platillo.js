const { Schema, model } = require("mongoose");
const Usuario = require("./Usuario");
const { CategoriaSchema } = require("./Categoria");
const IngredienteSchema = require("./Ingrediente");

const RecetaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  ruta_imagen: {
    type: String,
    default: "",
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
    trim: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  platillo: {
    type: Schema.Types.ObjectId,
    ref: "Platillo",
    required: true,
  },
  is_publico: {
    type: Boolean,
    default: false,
  },
  is_activo: {
    type: Boolean,
    default: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  porciones: {
    type: String,
    default: "",
    trim: true,
  },
  calorias: {
    type: String,
    trim: true,
    default: "",
  },
  preparacion: [
    {
      nro_orden: {
        type: Number,
        // required: true,
      },
      detalle: {
        type: String,
        required: true,
        trim: true,
      },
      url_imagen: {
        type: String,
        default: "",
        required: false,
        trim: "",
      },
    },
  ],
  comentarios: [
    {
      username: String,
      usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
      },
      avatarImage: String,
      content: String,
      likes: Number,
      dislikes: Number,
      valoradores: {
        positivos: [String],
        negativos: [String]
      }
    },
  ],
  ingredientes: [
    {
      ingrediente_nombre: {
        type: String,
        required: true,
      },
      ingrediente: {
        type: Schema.Types.ObjectId,
        ref: "Ingrediente",
        required: false,
      },
      cantidad: {
        type: String,
        required: false,
        default: "0",
      },
      unidad: {
        type: String,
        required: false,
        default: "",
      },
    },
  ],
});

const PlatilloSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  ruta_imagen: {
    type: String,
    default: "",
  },
  categoria: {
    type: [String],
    required: false,
  },
  // receta: {
  //     type: [RecetaSchema],
  //     required: false
  // }
});

module.exports = {
  PlatilloSchema,
  RecetaSchema,
  Platillo: model("Platillo", PlatilloSchema),
  Receta: model("Receta", RecetaSchema),
};
