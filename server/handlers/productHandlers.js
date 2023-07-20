const dbConnection = require("../database/connection");
const cloudinary = require("cloudinary");
const fs = require("fs");
require("../upload/upload");
const multer = require("multer");
const upload = multer({ dest: "../upload/files/temp" });
const postOne =
  "INSERT INTO products (name, description, price, created_at, updated_at, user_id) VALUES(?, ?, ?, ?, ?, ?)";
const addImage = "INSERT INTO product_images (product_id, link) VALUES (?,?)";
const getAll =
  "SELECT p.*, pi.id as image_id, pi.link, u.first_name, u.last_name, u.avatar FROM products AS p LEFT JOIN product_images AS pi ON pi.product_id=p.id INNER JOIN users AS u ON p.user_id=u.id";
const findById =
  "SELECT p.*, pi.id as image_id, pi.link FROM products p LEFT JOIN product_images pi ON pi.product_id=p.id WHERE p.id = ?";

const deleteOne = "DELETE from products WHERE id = ?";
const getCommentsByProduct =
  "SELECT c.id, c.message, c.created_at, u.id as user_id, u.first_name, u.avatar FROM users u INNER JOIN comments c ON c.user_id=u.id WHERE c.product_id = ? ORDER BY c.created_at DESC";
const deleteImage = "DELETE from product_images WHERE id=?";
const selectUserById = "SELECT * FROM users WHERE id = ?";
const findImageById =
  "SELECT u.id from users as u INNER JOIN products as p ON p.user_id = u.id INNER JOIN product_images as i ON i.product_id = p.id WHERE i.id = ?";
const imageLinks = [];
const postProduct = async (req, res) => {
  //   {
  //     "name": "SAMSUNG X-6",
  //     "description": "lorem ipsum",
  //     "price": 5060,
  //     "images": "couocu.com" -------
  //   }   FOR POSTMAN
  const { name, description, price } = req.body;
  const images = req.files;

  // images.map((image) =>
  //   cloudinary.v2.uploader
  //     .upload(
  //       image.path,
  //       { public_id: image.filename, folder: "Leboncoin" },
  //       function (error, result) {
  //         // console.log(result);
  //       }
  //     )
  //     .then((data) => {
  //       imageLinks.push(data.url);
  //       console.log(imageLinks);
  //     })
  // );

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
        console.log(result.insertId);
        images.map((image) =>
          cloudinary.v2.uploader
            .upload(
              image.path,
              { public_id: image.filename, folder: "Leboncoin" },
              function (error, result) {
                console.log(images);
                console.log(image);
                console.log(result);
                // //delete image from temp folder
                fs.unlink(image.path, (err) => console.log(err));
              }
            )
            .then((data) => {
              dbConnection
                .query(addImage, [result.insertId, data.url])
                .then(([result2]) => {
                  console.log(result2);
                  if (result2.insertId != null) {
                    // res.status(201).json({
                    //   status: 201,
                    //   message:
                    //     "Image uploaded",
                    // });
                  }
                })
                .catch((err) => {
                  console.error(err);
                  res
                    .status(500)
                    .send(`Error retrieving data from database - ${err}`);
                });
            })
            .catch((err) => {
              console.error(err);
              res
                .status(500)
                .send(`Error retrieving data from database - ${err}`);
            })
        ); // end map
      }
      //   console.log(imageLinks.length);
      //   if (imageLinks.length > 0) {
      //     imageLinks.forEach((img) =>
      //       dbConnection
      //         .query(addImage, [result.insertId, img])
      //         .then(([result2]) => {
      //           console.log(result2);
      //           if (result2.insertId != null) {
      //             //delete image from temp folder
      //             fs.unlink(img.path, (err) => console.log(err));
      //             res.status(201).json({
      //               status: 201,
      //               message:
      //                 "You have been signed up - check your email and click on the link to validate your account!",
      //             });
      //           }
      //         })
      //         .catch((err) => {
      //           console.error(err);
      //           res
      //             .status(500)
      //             .send(`Error retrieving data from database - ${err}`);
      //         })
      //     );
      //   }
      // } else {
      //   res.status(404).send("Not Found");
      // }
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
        dbConnection.query(selectUserById, [userId]).then(([user]) => {
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
        res.status(404).json({
          status: 404,
          error: "Product doesn't exist",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const deleteOneImage = (req, res) => {
  const imageId = parseInt(req.params.id);
  const userId = parseInt(req.tokenUserId);
  dbConnection
    .query(findImageById, [imageId])
    .then(([imageUserId]) => {
      console.log(imageUserId);
      const userIdOfProduct = imageUserId[0].id;
      if (imageUserId[0].id != null) {
        dbConnection.query(selectUserById, [userId]).then(([user]) => {
          if (user[0].is_admin || user[0].id === imageUserId[0].id) {
            dbConnection
              .query(deleteImage, [imageId])
              .then(([result]) => {
                if (result.affectedRows === 0) {
                  res.status(404).json({ error: "Not Found" });
                } else {
                  res.status(202).json({ message: `Image deleted` });
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
        res.status(404).json({
          status: 404,
          error: "Image doesn't exist",
        });
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
