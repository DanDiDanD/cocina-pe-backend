const request = require("supertest");
const app = require("../../index-test");
const mongoose = require("mongoose");
const User = require("../../src/models/Usuario");
const {
  usuario,
  usuarioLogin,
  usuarioLoginErroneo,
  loginUser,
} = require("../mocks/usuarios.mock");
let auth = {};

beforeAll(async () => {
  const newUser = new User({
    usuario: "admin",
    password: "$2a$12$qU/45z7BiJwumPyTzMJmuuccFqn99lfRkh.sPazrlvDfsyCFTEeNi",
    nombres: "abc",
    apellidos: "zxc",
  });
  await newUser.save();
});

describe("POST /usuarios/login", () => {
  it("Logueo de usuario'", (done) => {
    request(app)
      .post("/usuarios/login")
      .send(usuarioLogin)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Logueo de usuario con contraseña erronea'", (done) => {
    request(app)
      .post("/usuarios/login")
      .send(usuarioLoginErroneo)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

beforeEach(loginUser(auth));

describe("POST /usuarios/", () => {
  it("Registra un usuario con rol 'user'", (done) => {
    request(app)
      .post("/usuarios")
      .set("Authorization", auth.token)
      .send(usuario)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

afterAll(function (done) {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
  
});
