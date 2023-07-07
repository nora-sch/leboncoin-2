const dbConnection = require("../database/connection");
const postOneComment =
  "INSERT INTO comments (message, created_at, updated_at, user_id, product_id) VALUES(?, ?, ?, ?, ?)";
 const getAll =
   "SELECT c.message, c.created_at, u.id as user_id, u.first_name, u.avatar FROM users u INNER JOIN comments c ON c.user_id=u.id WHERE c.product_id = ?";
const deleteOne = "DELETE from comments WHERE id = ?";
const postComment = (req, res) => {
  const { message } = req.body;
  const productId = parseInt(req.params.id);
  const userId = req.tokenUserId;
  dbConnection
    .query(postOneComment, [message, new Date(), new Date(), userId, productId])
    .then(([result]) => {
      if (result.insertId != null) {
        res.location(`/${result.insertId}`).sendStatus(201);
      } else {
        res.status(404).send("Not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error retrieving data from database - ${err}`);
    });
};
const getAllByProduct = (req, res) => {
  dbConnection
    .query(getAll, [parseInt(req.params.id)])
    .then(([comments]) => {
      res.json(comments);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const deleteComment = (req, res) => {
    const id = parseInt(req.params.id);
    dbConnection
      .query(deleteOne, [id])
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.status(202).json({ message: `Comment deleted` });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };
module.exports = {
  postComment,
  getAllByProduct,
deleteComment
};
