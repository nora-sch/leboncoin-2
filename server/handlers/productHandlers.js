const dbConnection = require("../database/connection");
const postOne =
  "INSERT INTO products (name, description, price, created_at, updated_at, user_id) VALUES(?, ?, ?, ?, ?, ?)";
const addImage = "INSERT INTO product_images (product_id, link) VALUES (?,?)";
const getAll =
  "SELECT p.*, pi.id as image_id, pi.link FROM products p LEFT JOIN product_images pi ON pi.product_id=p.id";
const findById =
  "SELECT p.*, pi.id as image_id, pi.link FROM products p LEFT JOIN product_images pi ON pi.product_id=p.id WHERE p.id = ?";

const deleteOne = "DELETE from products WHERE id = ?";
const getCommentsByProduct =
  "SELECT c.id, c.message, c.created_at, u.id as user_id, u.first_name, u.avatar FROM users u INNER JOIN comments c ON c.user_id=u.id WHERE c.product_id = ?";
const deleteImage = "DELETE from product_images WHERE id=?";
const selectUserById = "SELECT * FROM users WHERE id = ?";
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
      res.json({ status: 500, error: err });
    });
};

const getProductById = (req, res) => {
  dbConnection
    .query(findById, [parseInt(req.params.id)])
    .then(([products]) => {
      console.log(products);
      if (products[0] != null) {
        const product = products[0];
        let productComments = {};
        dbConnection
          .query(getCommentsByProduct, [parseInt(req.params.id)])
          .then(([comments]) => {
            if (comments[0] != null) {
              productComments = comments;
            }
            res.json({ product, productComments });
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

const deleteProduct = (req, res) => {
  const productId = parseInt(req.params.id);
  const userId = parseInt(req.tokenUserId);
  dbConnection
    .query(findById, [productId])
    .then(([product]) => {
      if (product[0] != null) {
        dbConnection.query(selectUserById, [userId])
        .then(([user]) => {
          if (user[0].is_admin || user[0].id === product[0].user_id) {
            dbConnection
              .query(deleteOne, [productId])
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
          } else {
            res.status(404).json({
              status: 404,
              error: "You have no permission",
            });
          }
        });
      } else {
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const deleteOneImage = (req, res) => {
  const id = parseInt(req.params.id);
  dbConnection
    .query(deleteImage, [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.status(202).json({ message: `Image deleted` });
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
  deleteOneImage,
};
