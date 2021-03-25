const mongoose = require("mongoose");
const app = require("./app");
const { PORT_BACKEND, URI_DB_TEST, NODE_ENV } = require("./src/config");
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

mongoose.Promise = global.Promise;
mongoose.connect(
  `${URI_DB_TEST}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      if (NODE_ENV !== "test") {
        app.listen(process.env.PORT || PORT_BACKEND, () => {});
      }
    }
  }
);

module.exports = app;
