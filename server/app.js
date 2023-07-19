const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
app.use(express.json());
var cookieParser = require("cookie-parser");
app.use(cookieParser());

const productHandlers = require("./handlers/productHandlers");
const userHandlers = require("./handlers/userHandlers");
const commentHandlers = require("./handlers/commentHandlers");
const faker = require("./faker/faker");
const multer  = require('multer')
const upload = multer({ dest: '../upload/files/temp' })
const {
  isUser,
  verifyPassword,
  verifyToken,
  hashPassword,
  getUserByEmailWithPasswordAndPassToNext,
  isAdminOrUserWithRights,
  isAdmin,
} = require("./auth");
//faker
app.get("/faker", faker.hydrate);
//delete all
app.delete("/delete", faker.deleteAll)

//routes publiques
app.get("/api/products", productHandlers.getAllProducts);
app.get("/api/products/:id", productHandlers.getProductById);
app.get("/api/products/:id/comments", commentHandlers.getAllByProduct);
app.post("/api/signup",upload.single('avatar'), isUser, hashPassword,  userHandlers.postUser);
// app.post("/api/signup", upload.single('avatar'), userHandlers.postUser);
app.get("/api/validate/:token", userHandlers.validateUserAndRedirect);

//if is validated
app.post(
  "/api/login",
  getUserByEmailWithPasswordAndPassToNext,
  verifyPassword,
  userHandlers.signin
);

// if signed in
app.use(verifyToken); // verifyToken sera utilisé pour tt les routes qui suivent cette ligne
app.post("/api/products", productHandlers.postProduct);
app.post("/api/products/:id", commentHandlers.postComment);
app.get("/api/logout", userHandlers.logout);
// app.put("/api/products/:id/comments/:id", commentHandlers.updateComment);

// admin and user who has the specific post/comment
app.delete("/api/products/:id/images/:id", productHandlers.deleteOneImage);
app.delete("/api/products/:id", productHandlers.deleteProduct); //ok
app.delete("/api/products/:id/comments/:id", commentHandlers.deleteComment); //ok

// only admin
app.get("/api/products/:id/comments", isAdmin, commentHandlers.getAllByProduct);
app.get("/api/users", isAdmin, userHandlers.getAllUsers);

// app.get("/api/users/:id", userHandlers.getUserById);
// app.put("/api/users/:id", hashPassword, userHandlers.modifyUser);
// app.delete("/api/users/:id", userHandlers.deleteUser);
// app.put("/api/products/:id", productHandlers.updateProduct);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
