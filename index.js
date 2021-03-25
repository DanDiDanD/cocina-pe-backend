const mongoose = require("mongoose");
const app = require("./app");
const { IP_SERVER, PORT_DB, PORT_BACKEND, URI_DB } = require("./src/config");

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

mongoose.Promise = global.Promise;
mongoose.connect(
  `${URI_DB}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log(`La conexión a la base de datos es correcta en el puerto ${PORT_DB}`);

      app.listen(PORT_BACKEND, () => {
        console.log("######################");
        console.log("###### MONGO DB ######");
        console.log("######################");
        console.log(`http://${IP_SERVER}:${PORT_BACKEND}`);
      });
    }
  }
);

module.exports = app;
