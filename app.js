// Imports
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const app = express();

// Configure Header HTTP
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  
  app.use(helmet());
  
  
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// Router Basic
require("./src/routers/index")(app);

module.exports = app;


