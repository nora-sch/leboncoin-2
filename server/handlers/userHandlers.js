const dbConnection = require("../database/connection");
const postOne =
  "INSERT INTO users (first_name, last_name, email, password, is_admin, avatar, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
const findByEmailWithPwd =
  "SELECT id, first_name, last_name, email, password, is_admin, avatar FROM users where email = ?";
const postUser = (req, res) => {
    const { firstname, lastname, email, hashedPassword, avatar } =
      req.body;
    dbConnection
      .query(postOne, [
        firstname,
        lastname,
        email,
        hashedPassword,
        false,
        avatar,
        new Date(),
        new Date()
      ])
      .then(([result]) => {
        if (result.insertId != null) {
          res.location(`/${result.insertId}`).sendStatus(201);
        } else {
          res.status(404).send("Not Found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error retrieving data from database - ${err}`);
      });
  };

  const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
    // {
    //   "email": "norah@inbox.lv",
    //   "password" :"Pa$$w0rd!"
    //  } FOR POSTMAN
    dbConnection
      .query(findByEmailWithPwd, [req.body.email])
      .then(([users]) => {
        if (users[0] != null) {
          req.user = users[0];
        } else {
          res.status(404).send("Not Found");
        }
        next();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };
  module.exports = {
    //getUsers,
    postUser,
    // getUserById,
    //modifyUser,
    getUserByEmailWithPasswordAndPassToNext,
    //deleteUser
  };