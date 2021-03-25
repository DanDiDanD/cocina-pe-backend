const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/index");
const moment = require("moment");

module.exports = (req, res, next) => {
  // autorización por el header
  const authHeader = req.get("Authorization");
  
  if (!authHeader) {
    return res
      .status(403)
      .send({ message: "La peticion no tiene la cabecera de Autenticacion." });
  }

  // obtener el token y verificarlo
  let token = req.headers.authorization.replace(/['"]+/g, "");
  if (token.startsWith('Bearer ')) {  token = token.slice(7, token.length);   }
  //console.log(token)
  
  let payload = jwt.decode(token, JWT_SECRET);
  try {
    
    //console.log(payload)

    if (payload.exp <= moment().unix()) {
      return res.status(404).send({ message: "El token ha expirado." });
    }
  } catch (ex) {
    console.log(ex);
    return res.status(404).send({ message: "Token invalido." });
  }
  next();
};
