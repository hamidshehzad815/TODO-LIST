import express from "express";
import db from "../database/database.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/postReview", [auth], async (req, res) => {
  const { reviewBody } = req.body;
  const user = req.user;
  const insertQuery = "INSERT INTO Review(userId,reviewBody) VALUES(?,?)";
  const connection = await db.getConnection();
  await connection.query(insertQuery, [user.userId, reviewBody]);
  connection.release();
  return res.status(201).send({ message: "Review posted" });
});

router.get("/reviews", [auth], async (req, res) => {
  const getQuery =
    " SELECT u.username, r.reviewBody FROM User u JOIN Review r ON r.userId = u.userId WHERE r.reviewId = ( SELECT MIN(r2.reviewId) FROM Review r2 WHERE r2.userId = u.userId);";

  const connection = await db.getConnection();
  const [reviews] = await connection.query(getQuery);
  if (reviews.length === 0)
    return res.status(200).send({ message: "No Review Found" });

  connection.release();
  return res.status(200).send(reviews);
});
export default router;
