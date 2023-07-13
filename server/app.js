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
const {
  verifyPassword,
  verifyToken,
  hashPassword,
  getUserByEmailWithPasswordAndPassToNext,
} = require("./auth");
//faker
app.get("/faker", faker.hydrate);
//routes publiques
// app.get("/", (req, res) => {
//     res.send("LEBONCOIN");
//   });
// app.get("/api/products", productHandlers.getAllProducts);
app.get("/api/products", productHandlers.getAllProducts);
app.get("/api/products/:id", productHandlers.getProductById);
// app.post("/api/users", hashPassword, userHandlers.postUser);
app.post("/api/signup", hashPassword, userHandlers.postUser);
app.get("/api/validate/:token", userHandlers.validateUserAndRedirect);
//if is validated
app.post(
  "/api/login",
  getUserByEmailWithPasswordAndPassToNext,
  verifyPassword,
  userHandlers.signin
);

//routes privées
app.use(verifyToken); // verifyToken sera utilisé pour tt les routes qui suivent cette ligne
app.post("/api/products", productHandlers.postProduct);
app.delete("/api/products/:id", productHandlers.deleteProduct);
app.post("/api/products/:id", commentHandlers.postComment);
app.get("/api/logout", userHandlers.logout);
// app.put("/api/products/:id/comments/:id", commentHandlers.updateComment);
app.delete("/api/products/:id/comments/:id", commentHandlers.deleteComment);
app.delete("/api/products/:id/images/:id", productHandlers.deleteOneImage);
// //admin
app.get("/api/products/:id/comments", commentHandlers.getAllByProduct);
app.get("/api/users", userHandlers.getAllUsers);
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
