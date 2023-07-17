const argon2 = require("argon2");
const dbConnection = require("./database/connection");
const jwt = require("jsonwebtoken");
const isUserByEmail = "SELECT COUNT(*) as count FROM users WHERE email = ?";
const findByEmailWithPwd =
  "SELECT id, first_name, last_name, email, password, is_admin, avatar FROM users where email = ?";
const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const isUser = (req, res, next) => {
  dbConnection
    .query(isUserByEmail, [req.body.email])
    .then(([count]) => {
      if (count[0].count === 0) {
        console.log(count[0].count);
        next();
      } else {
        console.log("je suis ici");
        res
          .status(404)
          .json({ status: 404, error: "You have already signed up!" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({error:"Error retrieving data from database"});
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
        res.sendStatus(401); //TODO message  - bad credentials!!!! (login passwird inceorect or not signed up)
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
    res.sendStatus(401);
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
  isUser,
  hashPassword,
  verifyPassword,
  verifyToken,
  getUserByEmailWithPasswordAndPassToNext,
};
