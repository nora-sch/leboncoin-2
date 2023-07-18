const argon2 = require("argon2");
const dbConnection = require("./database/connection");
const jwt = require("jsonwebtoken");
const isUserByEmail = "SELECT COUNT(*) as count FROM users WHERE email = ?";
const selectUserById = "SELECT * FROM users WHERE id = ?";

const findByEmailWithPwd =
  "SELECT id, first_name, last_name, email, password, is_admin, is_validated, avatar FROM users where email = ?";
const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const isUser = (req, res, next) => {
  console.log(req.body);
  dbConnection
    .query(isUserByEmail, [req.body.email])
    .then(([count]) => {
      if (count[0].count === 0) {
        next();
      } else {
        res
          .status(404)
          .json({ status: 404, error: "You have already signed up!" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error retrieving data from database" });
    });
};

const hashPassword = async (req, res, next) => {
  const pwd = req.body.password;

  // hash the password using argon2 then call next()
  argon2
    .hash(pwd, hashingOptions)
    .then((hashedPassword) => {
      // do something with hashedPassword
      req.body.hashedPassword = hashedPassword;
      delete req.body.password;
      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyPassword = (req, res, next) => {
  console.log(req.user.password);
  console.log("body");
  console.log(req.body.password);
  argon2
    .verify(req.user.password, req.body.password)
    .then((isVerified) => {
      console.log(isVerified);
      if (isVerified) {
        next();
      } else {
        //TODO message  - bad credentials!!!! (login passwird inceorect or not signed up)
        res.status(401).json({
          status: 401,
          error: "Email or password incorrect",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyToken = (req, res, next) => {
  try {
    // console.log(req.cookies.userCookie);
    // var decoded = jwt.verify(req.cookies.userCookie, process.env.JWT_SECRET);
    const decodedTokenObject = jwt.decode(req.cookies.userCookie, {
      complete: true,
    });
    req.tokenUserId = decodedTokenObject.payload.sub;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({
      status: 401,
      error: "You have no permission - unauthorized!",
    });
  }
};
const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
  // {
  //   "email": "norah@inbox.lv",
  //   "password" :"Pa$$w0rd!"
  //  } FOR POSTMAN
  console.log(req.body);
  dbConnection
    .query(findByEmailWithPwd, [req.body.email])
    .then(([users]) => {
      console.log(users);
      if (users[0] != null) {
        console.log(users[0]);
        if (users[0].is_validated) {
          req.user = users[0];
          next();
        } else {
          res.status(404).json({
            status: 404,
            error: "You have to validate your account first! Check your email!",
          });
        }
      } else {
        res.status(404).json({
          status: 404,
          error: "No user found with this email - sign up please!",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ status: 404, error: "Error retrieving data from database" });
    });
};

const isAdmin = (req, res, next) => {
  console.log(req.params.id);
  console.log(req.tokenUserId);
  dbConnection
    .query(selectUserById, [req.tokenUserId])
    .then(([users]) => {
      console.log(users);
      if (users[0] != null) {
        console.log(users[0]);
        if (users[0].is_admin) {
          next();
        } else {
          res.status(404).json({
            status: 404,
            error: "You have no permission",
          });
        }
      } else {
        res.status(404).json({
          status: 404,
          error: "You have no permission",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ status: 404, error: "Error retrieving data from database" });
    });
};

module.exports = {
  isUser,
  hashPassword,
  verifyPassword,
  verifyToken,
  getUserByEmailWithPasswordAndPassToNext,
  isAdmin,
};
