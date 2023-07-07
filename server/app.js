const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
app.use(express.json()); 

const productHandlers = require("./handlers/productHandlers");
const userHandlers = require("./handlers/userHandlers");
const commentHandlers = require("./handlers/commentHandlers");
const { verifyPassword, verifyToken, hashPassword } = require("./auth");

//routes publiques
// app.get("/", (req, res) => {
//     res.send("LEBONCOIN");
//   });
// app.get("/api/products", productHandlers.getAllProducts);
app.get("/api/products", productHandlers.getAllProducts);
app.get("/api/products/:id", productHandlers.getProductById);
app.post("/api/login", userHandlers.getUserByEmailWithPasswordAndPassToNext, verifyPassword);
app.post("/api/users", hashPassword, userHandlers.postUser);


//routes privées
app.use(verifyToken); // verifyToken sera utilisé pour tt les routes qui suivent cette ligne
app.post("/api/products", productHandlers.postProduct);
// app.post("/api/products/:id/comments", commentHandlers.postComment);
// app.put("/api/products/:id/comments/:id", commentHandlers.updateComment);
// app.delete("/api/products/:id/comments/:id", commentHandlers.deleteComment);

// //admin
// app.get("/api/users", userHandlers.getUsers);
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