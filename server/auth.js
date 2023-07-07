const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
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

const verifyPassword = (req, res) => {
  argon2
    .verify(req.user.password, req.body.password)
    .then((isVerified) => {
      if (isVerified) {
        const payload = { sub: req.user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        delete req.user.password;
        res.send({ token, user: req.user });
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");
    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }
    const [type, token] = authorizationHeader.split(" ");
    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type");
    }
    const decodedToken = jwt.decode(token, { complete: true });
    req.tokenUserId = decodedToken.payload.sub;
    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};
module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
};
