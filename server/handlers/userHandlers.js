const dbConnection = require("../database/connection");
const jwt = require("jsonwebtoken");
const uid = require("uid2");
const communication = require("../helpers/contactMailSms");
// const { uploadImage } = require("../upload/upload");
const cloudinary = require("cloudinary");
const fs = require("fs");
require("../upload/upload");
const multer = require("multer");
const upload = multer({ dest: "../upload/files/temp" });

const postOne =
  "INSERT INTO users (first_name, last_name, email, password, is_admin, avatar, created_at, updated_at, validation_token, is_validated) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
const getAll =
  "SELECT id, first_name, last_name, email, is_admin, avatar, created_at, updated_at FROM users";
const findByToken = "SELECT * FROM users WHERE validation_token = ?";
const validateByToken =
  "UPDATE users SET is_validated = ? , validation_token = ? WHERE validation_token = ?";
// const emailHtml = `<h1>Hello world!</h><p>Click below!</p> <p>This is the email verification link : </p>`;
const changeAdminStatusSQL = "UPDATE users SET is_admin=? WHERE id = ?";
const selectUserByIdSQL =
  "SELECT id, first_name, last_name, email, is_admin, avatar, created_at, updated_at FROM users WHERE id = ?";
// const isAdminSQL = "SELECT is_admin FROM users WHERE id = ?";
const changeAdminStatus = (req, res) => {
  const userId = req.params.id;
  dbConnection
    .query(selectUserByIdSQL, [userId])
    .then(([user]) => {
      console.log(user);
      if (user[0] != null) {
        const isAdmin = user[0].is_admin;
        dbConnection
          .query(changeAdminStatusSQL, [isAdmin === 0 ? 1 : 0, userId])
          .then(([result]) => {
            if (result.affectedRows !== null) {
              dbConnection
                .query(selectUserByIdSQL, [userId])
                .then(([userUpdated]) => {
                  console.log(userUpdated);
                  res.status(200).json({
                    status: 200,
                    message: "Admin status changed",
                    user: userUpdated,
                  });
                })
                .catch((err) => {
                  console.error(err);
                  res.status(500).json({
                    status: 404,
                    error: "Error retrieving data from database",
                  });
                });
            } else {
              res.status(404).json({ error: "Something went wrong" });
            }
          })
          .catch((err) => {
            console.error(err);
            res
              .status(500)
              .send(`Error retrieving data from database - ${err}`);
          });
      } else {
        res.status(404).json({
          status: 404,
          error: "Something went wrong",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ status: 404, error: "Error retrieving data from database" });
    });

  //return user with changed status and state it in react to display in dashboard
};
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
  const { firstName, lastName, email, hashedPassword } = req.body;
  const emailHtml = `<h1>Hello ${firstName}!</h><p>Click below to validate you email!</p> <p>${host}${validationToken} </p>`;

  // console.log(req.file);
  // console.log(req.body);
  // const avatar = uploadImage(req.file);
  // console.log(avatar);
  // console.log(email)

  cloudinary.v2.uploader
    .upload(
      req.file.path,
      { public_id: req.file.filename, folder: "Leboncoin" },
      function (error, result) {
        console.log(result);
      }
    )
    .then((data) => {
      dbConnection
        .query(postOne, [
          firstName,
          lastName,
          email,
          hashedPassword,
          false,
          data.url,
          new Date(),
          new Date(),
          validationToken,
          false,
        ])
        .then(([result]) => {
          //delete image from temp folder
          fs.unlink(req.file.path, (err) => console.log(err));
          //return response
          if (result.insertId != null) {
            communication
              .sendMail(email, emailHtml)
              .catch((e) => console.log(e));
            res.status(201).json({
              status: 201,
              message:
                "You have been signed up - check your email and click on the link to validate your account!",
            });
          } else {
            res.status(404).json({ error: "Something went wrong" });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send(`Error retrieving data from database - ${err}`);
        });
    });
};

const logout = (req, res) => {
  return res
    .clearCookie("userCookie")
    .status(200)
    .json([{ message: "Successfully logged out" }]);
};

const signin = (req, res) => {
  // try{
  const payload = { sub: req.user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30",
  });
  delete req.user.password;
  res
    .cookie("userCookie", token)
    .status(200)
    .json([{ user: req.user, message: `Hello, ${req.user.first_name}` }]);
  // }catch(e){
  //   res.json([{ error: `Connection not possible!` }]);
  // }
};
const validateUserAndRedirect = (req, res) => {
  dbConnection
    .query(findByToken, [req.params.token])
    .then(([user]) => {
      if (user[0] != null) {
        dbConnection
          .query(validateByToken, [true, req.params.token, req.params.token])
          .then(([result]) => {
            if (result.affectedRows === 1) {
              res.status(200).json({
                status: 200,
                action: "login",
                success: true,
                redirectUrl: "/",
                message: `Email ${user[0].email} validated! You can log in now!`,
              });
            } else {
              res.status("400").json({
                status: 400,
                error: "Something went wrong! Contact the support team!",
              });
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");
          });
      } else {
        res.status("404").json({
          status: 404,
          error: "Token expired or you have already validated your account ",
        });
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
  changeAdminStatus,
};
