const dbConnection = require("../database/connection");
const selectUserById = "SELECT * FROM users WHERE id = ?";
const postOneComment =
  "INSERT INTO comments (message, created_at, updated_at, user_id, product_id) VALUES(?, ?, ?, ?, ?)";
const getAll =
  "SELECT c.id, c.message, c.created_at, u.id as user_id, u.first_name, u.avatar FROM users u INNER JOIN comments c ON c.user_id=u.id WHERE c.product_id = ? ORDER BY c.created_at DESC ";
const deleteOne = "DELETE from comments WHERE id = ?";
const getOneComment = "SELECT * FROM comments WHERE id = ?";

const postComment = (req, res) => {
  const { message } = req.body;
  console.log(message);
  const productId = parseInt(req.params.id);
  const userId = req.tokenUserId;
  dbConnection
    .query(postOneComment, [message, new Date(), new Date(), userId, productId])
    .then(([result]) => {
      if (result.insertId != null) {
        res.status(201).json({ status:201,message: "Comment posted!" });
      } else {
        res.status(404).json({ error: "Not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ error: `Error retrieving data from database - ${err}` });
    });
};
const getAllByProduct = (req, res) => {
  dbConnection
    .query(getAll, [parseInt(req.params.id)])
    .then(([comments]) => {
      res.json({status:201, comments});
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const deleteComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = parseInt(req.tokenUserId);
  dbConnection
    .query(getOneComment, [commentId])
    .then(([comment]) => {
      console.log(comment);
      dbConnection
        .query(selectUserById, [userId])
        .then(([user]) => {
          if (user[0].is_admin || user[0].id === comment[0].user_id) {
            dbConnection
              .query(deleteOne, [commentId])
              .then(([result]) => {
                if (result.affectedRows === 0) {
                  res.status(404).json({ error: `"Not Found`});
                } else {
                  res.status(202).json({ status:202, message: `Comment deleted` });
                }
              })
              .catch((err) => {
                console.error(err);
                res.status(500).send("Error retrieving data from database 1");
              });
          } else {
            res.status(404).json({
              status: 404,
              error: "You have no permission",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error retrieving data from database 2");
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database 3");
    });
};
module.exports = {
  postComment,
  getAllByProduct,
  deleteComment,
};
