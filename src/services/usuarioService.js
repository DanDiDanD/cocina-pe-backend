const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const Stripe = require('stripe')
const { empleadoAsistencia } = require("./empleadoService");
const { mapReduce } = require("../models/Usuario");

const stripe = new Stripe("sk_test_51JTEFaC7aH81BBFsuHfTD6SlQKNM2luoddpCRAkQKWjGCN78GfNp1kqw9WUNRNFGzzQyQWIbyZRJE4m2giGPtMkn00UQufPOhT")

exports.registrarUsuario = async (params) => {
  const usuario = new Usuario(params);
  const user = usuario.correo;
  let existeUsuario;
  try {
    existeUsuario = await Usuario.findOne({ correo: user });
  } catch (error) {
    console.log("Error: ", error.message);
    return error;
  }

  if (existeUsuario) {
    return true;
  } else {
    usuario.password = await bcrypt.hash(params.password, 12);
    try {
      await usuario.save();
      return usuario;
    } catch (error) {
      console.log("Error: " + error.message);
      return error;
    }
  }
};

exports.autenticarUsuario = async (params) => {
  const { correo, password } = params;
  let userDB;
  try {
    userDB = await Usuario.findOne({ correo, is_activo: true });
  } catch (error) {
    console.log("Error: ", error.message);
    return error;
  }

  if (!userDB) {
    return null;
  } else if (!bcrypt.compareSync(password, userDB.password)) {
    return false;
  } else {
    return userDB;
  }
};

exports.listarUsuarios = async () => {
  let usuariosDB;
  try {
    usuariosDB = await Usuario.find({ tipo_usuario: "user", is_activo: true });
    return usuariosDB;
  } catch (error) {
    console.log("Error: ", error.message);
    return error;
  }
};

exports.listarUsuariosPremium = async () => {
  let usuariosDB;
  try {
    usuariosDB = await Usuario.find({
      tipo_usuario: "user",
      is_activo: true,
      is_premium: true,
    });
    return usuariosDB;
  } catch (error) {
    console.log("Error: ", error.message);
    return error;
  }
};

exports.listarUsuariosPorActividad = async () => {
  let usuariosDB;
  try {
    usuariosDB = await Usuario.find({ tipo_usuario: "user", is_activo: true });
    return usuariosDB;
  } catch (error) {
    console.log("Error: ", error.message);
    return error;
  }
};

exports.obtenerUsuario = async (id) => {
  let usuarioDB;
  try {
    usuarioDB = await Usuario.findOne({ _id: id });
    if (!usuarioDB) {
      return false;
    } else {
      return usuarioDB;
    }
  } catch (error) {
    console.log("Error: ", error.message);
    return error;
  }
};

exports.obtenerUsuarioByEmail = async (email) => {
  let usuarioDb;
  try {
    usuarioDb = await Usuario.findOne({ correo: email });
    if (!usuarioDb) return false;
    else return usuarioDb;
  } catch (err) {
    console.log("Error: ", error.message);
    return error;
  }
};

exports.isRecetaFavorita = async (params) => {
  const idUsuario = params.id_usuario;
  const idReceta = params.id_receta;
  let usuario;
  try {
    usuario = await Usuario.findOne({ _id: idUsuario });
  } catch (error) {
    console.log("Error: ", error.message);
    return error;
  }
  if (usuario) {
    try {
      const find = usuario.recetas_favoritas.find((fav) => fav == idReceta);
      if (find === undefined) {
        return false;
      }
      return true;
    } catch (error) {
      console.log("Error: ", error.message);
      return error;
    }
  } else {
    return "no encontrado";
  }
};

exports.recetaFavorita = async (params) => {
  const idUsuario = params.id_usuario;
  const idReceta = params.id_receta;
  let usuario;
  try {
    usuario = await Usuario.findOne({ _id: idUsuario });
  } catch (error) {
    console.log("Error: ", error.message);
    return error;
  }
  if (usuario) {
    try {
      const newFavoritos = [];
      const find = usuario.recetas_favoritas.find((fav) => fav == idReceta);
      console.log(find);
      if (find === undefined) {
        newFavoritos.push(idReceta);
        usuario.recetas_favoritas.map((item) => {
          newFavoritos.push(item);
        });
        usuario.recetas_favoritas = newFavoritos;
        usuario.save();
        return false;
      } else {
        usuario.recetas_favoritas.map((item) => {
          if (item !== idReceta) {
            newFavoritos.push(item);
          }
        });
        usuario.recetas_favoritas = newFavoritos;
        usuario.save();
        return true;
      }
    } catch (error) {
      console.log("Error: ", error.message);
      return error;
    }
  } else {
    return "no encontrado";
  }
};

exports.modificarUsuario = async (params, id) => {
  const objeto = params;
  // let existeUsuario
  // try{
  //     existeUsuario = await Usuario.findOne({correo: correo});
  // }catch(error){
  //     console.log('Error: ', error.message);
  //     return error
  // }
  // if(existeUsuario){
  //     if(existeUsuario._id != id){
  //         return true
  //     }
  // }
  // const objeto = {
  //   correo: params.correo,
  //   nombres: params.nombres,
  //   apellido_paterno: params.apellidos,
  // }
  try {
    if (params.password != null) {
      objeto.password = await bcrypt.hash(params.password, 12);
    }
    const updated = await Usuario.findByIdAndUpdate(id, objeto);
    if (updated) {
      return updated;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error: ", error.message);
    return error;
  }
}


exports.usuarioPremium = async(idUsuario, params) => {
  const {id,amount,description} = params;
  console.log(params)
  try{
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "USD",
      description: description,
      payment_method: id,
      confirm: true
    })

    // console.log(payment)
    // return true;
    const updated = await Usuario.findByIdAndUpdate(idUsuario, {is_premium: true});
    if(updated){
        return true
    }else{
        return false
    }


  }catch(error){
      console.log('Error: ', error.message);
      return {message: error}
  }
}

exports.quitarUsuarioPremium = async(id) => {
  const objeto = params;
  try{
    const updated = await Usuario.findByIdAndUpdate(id, {is_premium: false});
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
