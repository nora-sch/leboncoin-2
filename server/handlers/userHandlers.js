const dbConnection = require("../database/connection");
const jwt = require("jsonwebtoken");
const postOne =
  "INSERT INTO users (first_name, last_name, email, password, is_admin, avatar, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";

const postUser = (req, res) => {
  const { firstname, lastname, email, hashedPassword, avatar } = req.body;
  dbConnection
    .query(postOne, [
      firstname,
      lastname,
      email,
      hashedPassword,
      false,
      avatar,
      new Date(),
      new Date(),
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


const logout = (req, res) => {
  return res
    .clearCookie("userCookie")
    .status(200)
    .json({ message: "Successfully logged out :smirk: :four_leaf_clover:" });
};
const signin = (req, res) => {
  const payload = { sub: req.user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  delete req.user.password;
  res.cookie('userCookie', token).status(200).json({user: req.user})
};
module.exports = {
  //getUsers,
  postUser,
  // getUserById,
  //modifyUser,
  //deleteUser
  logout,
  signin
};
