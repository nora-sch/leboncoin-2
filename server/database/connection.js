const mysql = require("mysql2/promise");
const dbConnection = mysql.createPool({
  host: process.env.DB_HOST, // address of the server
  port: process.env.DB_PORT, // port of the DB server (mysql), not to be confused with the APP_PORT !
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

dbConnection.getConnection((err, conn) => {
  if (!err) {
    console.log("Connection with DB ok");
  } else {
    console.log(err);
  }
});
module.exports = dbConnection;