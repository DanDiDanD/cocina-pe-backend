const request = require("supertest");
const app = require("../../app");

function loginUser(auth) {
  return function (done) {
    request(app)
      .post("/usuarios/login")
      .send({
        usuario: "admin",
        password: "admin",
      })
      .end(function (err, res) {
        auth.token = res.body.data; // Or something
        return done();
      });
  };
}

module.exports = {
  usuario: {
    usuario: "abc",
    password: "123",
    nombres: "zxc",
    apellidos: "ztxcyu",
  },
  usuarioLogin: {
    usuario: "admin",
    password: "admin",
  },
  usuarioLoginErroneo: {
    usuario: "admin",
    password: "123",
  },
  loginUser,
};
