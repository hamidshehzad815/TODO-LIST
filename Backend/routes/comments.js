import express from "express";
import db from "../database/database.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/createComment", [auth], async (req, res) => {
  const { taskId, commentBody } = req.body;
  if (!taskId || !commentBody) {
    return res.status(400).send({
      message: "Field missing (taskId and commentBody are both required)",
    });
  }

  const user = req.user;
  const connection = await db.getConnection();
  const query = "INSERT INTO Comment VALUES(DEFAULT,?,?,?,DEFAULT)";
  const result = await connection.query(query, [
    taskId,
    user.userId,
    commentBody,
  ]);
  connection.release();

  return res.status(200).send({ result, message: "Comment Created" });
});
router.get("/getComments/:taskId", [auth], async (req, res) => {
  const taskId = req.params.taskId;
  const connection = await db.getConnection();
  const query =
    "SELECT c.taskId,c.commentId,c.commentBody,c.createdAt,c.userId,u.username FROM Comment c JOIN User u on u.userId=c.userId WHERE taskId = ?";
  const result = await connection.query(query, [taskId]);
  connection.release();
  if (result.length === 0) {
    return res.status(404).send({ message: "No comments found" });
  }

  return res.status(200).send(result[0]);
});

router.delete("/deleteComment/:commentId", [auth], async (req, res) => {
  const commentId = req.params.commentId;
  const connection = await db.getConnection();
  const query = "DELETE FROM Comment WHERE commentId = ?";
  const result = await connection.query(query, [commentId]);
  connection.release();

  if (result.affectedRows === 0) {
    return res.status(404).send({ message: "Comment not found" });
  }

  return res.status(200).send({ message: "Comment deleted" });
});

export default router;
