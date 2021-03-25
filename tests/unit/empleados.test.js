const request = require("supertest");
const app = require("../../index-test");
const mongoose = require("mongoose");
const { loginUser } = require("../mocks/usuarios.mock");
const User = require("../../src/models/Usuario");
const {
  nuevoEmpleado,
  segundoEmpleado,
  tercerEmpleado,
  empleadoAgregadoConDniRepetido,
  empleadoDatosModificar,
  empleadoDatosModificarDniRepetido,
  empleadoDatosModificarDniSinRepetir,
  horaEntrada1,
  horaSalida1,
  horaEntrada2,
  horaSalida2,
} = require("../mocks/empleado.mock");

let auth = {};
let id = null;
let idEliminar = null;

beforeAll(async () => {
  const newUser = new User({
    usuario: "admin",
    password: "$2a$12$qU/45z7BiJwumPyTzMJmuuccFqn99lfRkh.sPazrlvDfsyCFTEeNi",
    nombres: "abc",
    apellidos: "zxc",
  });
  await newUser.save();
});

beforeEach(loginUser(auth));

describe("POST /empleados/", () => {
  it("Creación de empleado: éxito", (done) => {
    request(app)
      .post("/empleados/")
      .set("Authorization", auth.token)
      .send(nuevoEmpleado)
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Creación de empleado 2: éxito", (done) => {
    request(app)
      .post("/empleados/")
      .set("Authorization", auth.token)
      .send(segundoEmpleado)
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Creación de empleado: se repite el dni de la empleado", (done) => {
    request(app)
      .post("/empleados/")
      .set("Authorization", auth.token)
      .send(empleadoAgregadoConDniRepetido)
      .expect("Content-Type", /json/)
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it("Creación de empleado 3: éxito", (done) => {
    request(app)
      .post("/empleados/")
      .set("Authorization", auth.token)
      .send(tercerEmpleado)
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("GET /empleados/", () => {
  it("Lista de empleado", (done) => {
    request(app)
      .get("/empleados/")
      .set("Authorization", auth.token)
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        id = res.body.data[0]._id;
        idEliminar = res.body.data[2]._id;
        done();
      });
  });
});

describe("GET /empleados/:id", () => {
    it("Busqueda de empleado: éxito", (done) => {
        request(app)
            .get("/empleados/"+ id)
            .set("Authorization",auth.token)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    })

    it("Busqueda de empleado: no existe empleado", (done) => {
        request(app)
            .get("/empleados/"+ '5f5c3b67ed2c0a1ed86909d0')
            .set("Authorization",auth.token)
            .expect("Content-Type", /json/)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    })
})

describe("PUT /empleados/:id", () => {
  it("Modificar empleado: éxito", (done) => {
    request(app)
      .put("/empleados/" + id)
      .set("Authorization", auth.token)
      .send(empleadoDatosModificar)
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it("Modificar empleado: no se encontró empleado", (done) => {
    request(app)
      .put("/empleados/" + "5f570d9745e4e11eccebbc68")
      .set("Authorization", auth.token)
      .send(empleadoDatosModificar)
      .expect("Content-Type", /json/)
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it("Modificar empleado: el dni está repetido", (done) => {
    request(app)
      .put("/empleados/" + id)
      .set("Authorization", auth.token)
      .send(empleadoDatosModificarDniRepetido)
      .expect("Content-Type", /json/)
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it("Modificar empleado: éxito al modificar DNI", (done) => {
    request(app)
      .put("/empleados/" + id)
      .set("Authorization", auth.token)
      .send(empleadoDatosModificarDniSinRepetir)
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("PUT /empleados/estado/", () => {
  it("Eliminar empleado: éxito", (done) => {
    request(app)
      .put("/empleados/estado/" + idEliminar)
      .set("Authorization", auth.token)
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Eliminar empleado: no se encontró empleado", (done) => {
    request(app)
      .put("/empleados/estado/" + "5f570d9745e4e11eccebbc68")
      .set("Authorization", auth.token)
      .expect("Content-Type", /json/)
      .expect(400)
      .end((err, res) => {
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
