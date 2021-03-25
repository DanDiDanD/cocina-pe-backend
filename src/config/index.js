require('dotenv').config();


module.exports = {
  PORT_DB: process.env.PORT_DB,
  PORT_BACKEND: process.env.PORT_BACKEND,
  IP_SERVER: process.env.IP_SERVER,
  JWT_SECRET: process.env.JWT_SECRET,
  URI_DB: process.env.URI_DB,
  URI_DB_TEST: process.env.URI_DB_TEST,
  NODE_ENV: process.env.NODE_ENV
};
