const dbConnection = require("../database/connection");
const postOne =
  "INSERT INTO products (name, description, price, created_at, updated_at, user_id) VALUES(?, ?, ?, ?, ?, ?)";
const postProduct = (req, res) => {
  //   {
  //     "name": "SAMSUNG X-6",
  //     "description": "lorem ipsum",
  //     "price": 5060
  //   }   FOR POSTMAN
  const { name, description, price } = req.body;
  dbConnection
    .query(postOne, [
      name,
      description,
      price,
      new Date(),
      new Date(),
      req.tokenUserId,
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

module.exports = {
  postProduct,
};
