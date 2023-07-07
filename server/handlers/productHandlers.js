const dbConnection = require("../database/connection");
const postOne =
  "INSERT INTO products (name, description, price, created_at, updated_at, user_id) VALUES(?, ?, ?, ?, ?, ?)";
const addImage = "INSERT INTO product_images (product_id, link) VALUES (?,?)";
const getAll =
  "SELECT p.*, pi.link FROM products p INNER JOIN product_images pi ON pi.product_id=p.id";
const findById =
  "SELECT p.*, pi.link FROM products p INNER JOIN product_images pi ON pi.product_id=p.id where p.id = ?";

const deleteOne = "DELETE from products WHERE id = ?";

const postProduct = (req, res) => {
  //   {
  //     "name": "SAMSUNG X-6",
  //     "description": "lorem ipsum",
  //     "price": 5060,
  //     "images": "couocu.com"
  //   }   FOR POSTMAN
  const { name, description, price, images } = req.body;
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
        dbConnection
          .query(addImage, [result.insertId, images])
          .then(([result2]) => {
            if (result2.insertId != null) {
              res.location(`/${result.insertId}`).sendStatus(201);
            }
          });
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error retrieving data from database - ${err}`);
    });
};

const getAllProducts = (req, res) => {
  dbConnection
    .query(getAll)
    .then(([products]) => {
      res.json(products);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getProductById = (req, res) => {
  dbConnection
    .query(findById, [parseInt(req.params.id)])
    .then(([products]) => {
      if (products[0] != null) {
        res.json(products[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  dbConnection
    .query(deleteOne, [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.status(202).json({ message: `Product deleted` });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

module.exports = {
  postProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
};
