const { faker } = require("@faker-js/faker");
const argon2 = require("argon2");
const dbConnection = require("../database/connection");
const uid = require("uid2");
const postOneUser =
  "INSERT INTO users (first_name, last_name, email, password, is_admin, avatar, created_at, updated_at, validation_token, is_validated) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

const postOneProduct =
  "INSERT INTO products (name, description, price, created_at, updated_at, user_id) VALUES(?, ?, ?, ?, ?, ?)";
const addImage = "INSERT INTO product_images (product_id, link) VALUES (?,?)";
const postOneComment =
  "INSERT INTO comments (message, created_at, updated_at, user_id, product_id) VALUES(?, ?, ?, ?, ?)";
const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};
const hashPassword = async (password, hashingOptions) => {
  try {
    return await argon2.hash(password, hashingOptions);
  } catch {
    console.log("Error");
  }
};
const hydrate = (req, res) => {
  for (let i = 0; i < 10; i++) {
    // const { firstname, lastname, email, hashedPassword, avatar } = req.body;
    hashPassword("password", hashingOptions).then((hashedPassword) => {
      // USER
      dbConnection
        .query(postOneUser, [
          faker.person.firstName(),
          faker.person.lastName(),
          faker.internet.email(),
          hashedPassword,
          false,
          faker.internet.avatar(),
          new Date(),
          new Date(),
          uid(100),
          false,
        ])
        .then(([result]) => {
          if (result.insertId != null) {
            for (let i = 0; i < 10; i++) {
              // PRODUCT
              const userId = result.insertId;
              dbConnection
                .query(postOneProduct, [
                  faker.commerce.product(),
                  faker.commerce.productDescription(),
                  faker.commerce.price({ min: 100, max: 100000, dec: 0 }),
                  new Date(),
                  new Date(),
                  userId,
                ])
                .then(([result2]) => {
                  if (result2.insertId != null) {
                    // IMAGE
                    const productId = result2.insertId;
                    dbConnection
                      .query(addImage, [
                        productId,
                        faker.image.urlPicsumPhotos(),
                      ])
                      .then(([result3]) => {
                        if (result3.insertId != null) {
                          //do something
                        } else {
                          res.status(404).send("Not Found");
                        }
                      });
                    for (let i = 0; i < 10; i++) {
                      // COMMENTS
                      dbConnection
                        .query(postOneComment, [
                          faker.lorem.sentences({ min: 1, max: 5 }),
                          new Date(),
                          new Date(),
                          userId,
                          productId,
                        ])
                        .then(([result4]) => {
                          if (result4.insertId != null) {
                            // res.status(200).send("DATABASE HYDRATED!");
                          } else {
                            res.status(404).send("Not found");
                          }
                        })
                        .catch((err) => {
                          console.error(err);
                          res
                            .status(500)
                            .send(
                              `Error retrieving data from database - ${err}`
                            );
                        });
                    }
                  } else {
                    res.status(404).send("Not Found");
                  }
                })
                .catch((err) => {
                  console.error(err);
                  res
                    .status(500)
                    .send(`Error retrieving data from database - ${err}`);
                });
            }
          } else {
            res.status(404).send("Not Found");
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send(`Error retrieving data from database - ${err}`);
        });
    });
  }
};
const deleteAll = (req, res) => {
  const comments = " DELETE from comments";
  const productImages = " DELETE from product_images";
  const products = " DELETE from products";
  const users = " DELETE from users";
  dbConnection
    .query(comments)
    .then(([result1]) => {
      console.log(result1);
      dbConnection
        .query(productImages)
        .then(([result2]) => {
          console.log(result2);
          dbConnection
            .query(products)
            .then(([result3]) => {
              console.log(result3);
              dbConnection
                .query(users)
                .then(([result4]) => {
                  console.log(result4);
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
            });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send(`Error retrieving data from database - ${err}`);
        });
    })
    .then(() => {
      res.status(200).send("DATABASE CONTENTS DELETED!");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error retrieving data from database - ${err}`);
    });
};
module.exports = {
  hydrate,
  deleteAll,
};
