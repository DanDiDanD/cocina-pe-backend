const request = require("supertest");
const app = require("../../index-test");
const mongoose = require("mongoose");
const { loginUser } = require("../mocks/usuarios.mock");
const User = require('../../src/models/Usuario')
const {
    nuevaSede,
    nuevaSedeRepetida,
    segundaSede,
    sedeBusquedaInexistente,
    sedeDatosModificar,
    sedeDatosModificarNombreRepetido
} = require("../mocks/sedes.mock")
let auth = {};
let id = null;

beforeAll( async () => {
    const newUser = new User({
      usuario: 'admin',
      password: '$2a$12$qU/45z7BiJwumPyTzMJmuuccFqn99lfRkh.sPazrlvDfsyCFTEeNi',
      nombres: 'abc',
      apellidos: 'zxc'
    });
    await newUser.save();
  });

beforeEach(loginUser(auth));


describe("POST /sedes/", () => {
    it("Creación de sede: éxito", (done) => {
        request(app)
            .post("/sedes/")
            .set("Authorization",auth.token)
            .send(nuevaSede)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    })

    it("Creación de sede 2: éxito", (done) => {
        request(app)
            .post("/sedes/")
            .set("Authorization",auth.token)
            .send(segundaSede)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    })
    
    it("Creación de sede: se repite el nombre de la sede", (done) => {
        request(app)
            .post("/sedes/")
            .set("Authorization",auth.token)
            .send(nuevaSedeRepetida)
            .expect("Content-Type", /json/)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    })
})

describe('GET /sedes/', () => {
    it('Lista de sede', (done)=> {
        request(app)
            .get('/sedes/')
            .set("Authorization",auth.token)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                id = res.body.data[0]._id
                done();
            });
    })
})



describe("GET /sedes/:id", () => {
    it("Busqueda de sede: éxito", (done) => {
        request(app)
            .get("/sedes/"+ id)
            .set("Authorization",auth.token)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    })

    it("Busqueda de sede: no existe sede", (done) => {
        request(app)
            .get("/sedes/"+ '5f5c3b67ed2c0a1ed86909d0')
            .set("Authorization",auth.token)
            .expect("Content-Type", /json/)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    })
})

describe("PUT /sedes/:id", () => {
    it("Modificar sede: éxito", (done) => {
        request(app)
            .put("/sedes/"+ id)
            .set("Authorization",auth.token)
            .send(sedeDatosModificar)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    })

    it("Modificar sede: No se encontró sede", (done) => {
        request(app)
            .put("/sedes/"+ sedeBusquedaInexistente)
            .set("Authorization",auth.token)
            .send(sedeDatosModificar)
            .expect("Content-Type", /json/)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    })

    it("Modificar sede: Nombre de sede repetido", (done) => {
        request(app)
            .put("/sedes/"+ id)
            .set("Authorization",auth.token)
            .send(sedeDatosModificarNombreRepetido)
            .expect("Content-Type", /json/)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    })

})

afterAll(function (done) {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
  
});
