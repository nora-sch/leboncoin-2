const dbConnection = require("../database/connection");
const jwt = require("jsonwebtoken");
const uid = require("uid2");
const communication = require("../helpers/contactMailSms");

const postOne =
  "INSERT INTO users (first_name, last_name, email, password, is_admin, avatar, created_at, updated_at, validation_token, is_validated) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
const getAll =
  "SELECT id, first_name, last_name, email, is_admin, avatar, created_at, updated_at FROM users";
const findByToken = "SELECT * FROM users WHERE validation_token = ?";
const validateByToken =
  "UPDATE users SET is_validated = ? , validation_token = ? WHERE validation_token = ?";
// const emailHtml = `<h1>Hello world!</h><p>Click below!</p> <p>This is the email verification link : </p>`;
const getAllUsers = (req, res) => {
  dbConnection
    .query(getAll)
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};
const postUser = (req, res) => {
  const validationToken = uid(100);
  const host = "http://localhost:3000/validate/";
  const { firstname, lastname, email, hashedPassword, avatar } = req.body;
  const emailHtml = `<h1>Hello ${firstname}!</h><p>Click below to validate you email!</p> <p>${host}${validationToken} </p>`;

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
      validationToken,
      false,
    ])
    .then(([result]) => {
      if (result.insertId != null) {
        communication.sendMail(emailHtml).catch((e) => console.log(e));
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
  res
    .cookie("userCookie", token)
    .status(200)
    .json({ user: req.user, message: `Hello, ${req.user.first_name}` });
};
const validateUserAndRedirect = (req, res) => {
  // console.log(req.params);
  dbConnection
    .query(findByToken, [req.params.token])
    .then(([user]) => {
      console.log(user);
      if (user[0] != null) {
        dbConnection
          .query(validateByToken, [true, req.params.token, req.params.token])
          .then(([result]) => {
            console.log(result);
            if (result.affectedRows === 1) {
              res
                .status("200")
                .json({ message: "Email validated! You can log in now!" });
            } else {
              res
                .status("400")
                .json({
                  error: "Something went wrong! Contact the support team!" });
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");
          });
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};
module.exports = {
  getAllUsers,
  postUser,
  // getUserById,
  //modifyUser,
  //deleteUser
  logout,
  signin,
  validateUserAndRedirect,
};
