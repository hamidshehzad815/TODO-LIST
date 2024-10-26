import express from "express";
import bcrypt from "bcryptjs";
import auth from "../middleware/auth.js";
import authorization from "../middleware/authorization.js";
import generateToken from "../services/generateToken.js";
import { registraionEmail as sendEmail } from "../services/sendEmail.js";
import _ from "lodash";
import {
  signUpValidations,
  validateSignup,
} from "../middleware/signUpMiddleware.js";
import {
  loginValidations,
  validateLogin,
} from "../middleware/loginMiddleware.js";
import db from "../database/database.js";

const router = express.Router();

router.post(
  "/signup",
  [...signUpValidations, validateSignup],
  async (req, res) => {
    const { username, email, password } = req.body;
    const role = email === process.env.EMAIL_USER ? "admin" : "user";
    const emailCheckQuery =
      "SELECT * FROM User WHERE email = ? OR username = ?";
    const insertQuery = "INSERT INTO User VALUES (DEFAULT, ?, ?, ?, ?)";

    const connection = await db.getConnection();
    const [users] = await connection.query(emailCheckQuery, [email, username]);

    if (users.length > 0) {
      connection.release(); // Release connection on error
      return res
        .status(400)
        .send({ error: "User with this email or username already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await connection.query(insertQuery, [
      username,
      email,
      hashedPassword,
      role,
    ]);
    sendEmail(email);
    connection.release();
    res.status(200).send({ message: "Confirmation Email sent" });
  }
);

router.post(
  "/login",
  [...loginValidations, validateLogin],
  async (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM User WHERE email = ?";
    const connection = await db.getConnection();
    const [users] = await connection.query(query, [email]);

    if (users.length !== 1) {
      connection.release(); // Release connection on error
      return res.status(401).send({ message: "INVALID EMAIL OR PASSWORD" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    connection.release();
    if (!isMatch) {
      return res.status(401).send({ message: "INVALID EMAIL OR PASSWORD" });
    } else {
      const token = await generateToken(_.omit(user, ["password"]));
      const Role = user.role;
      return res
        .status(200)
        .send({ Message: `Welcome ${user.username}`, token, Role });
    }
  }
);

router.get("/profile", auth, async (req, res) => {
  try {
    const connection = await db.getConnection();
    const query = "SELECT username, email, role FROM User WHERE userId = ?";
    const [results] = await connection.query(query, [req.user.userId]);
    connection.release();
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(results[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile data" });
  }
});

router.post("/logout", (req, res) => {
  return res.json({ message: "You have logged out!" });
});

router.get("/allusers", [auth, authorization], async (req, res) => {
  const connection = await db.getConnection();
  const query = "SELECT * FROM User";
  const [users] = await connection.query(query);

  if (users.length === 0) {
    connection.release(); // Release connection
    return res.status(404).send({ message: "No User Found" });
  }

  connection.release();
  return res.status(200).send(users);
});

router.delete(
  "/delete-user/:userId",
  [auth, authorization],
  async (req, res) => {
    const userId = req.params.userId;
    if (!userId) return res.status(404).send({ message: "UserId missing" });

    const connection = await db.getConnection();

    const findQuery = "SELECT role FROM User WHERE userId = ?";
    const user = await connection.query(findQuery, [userId]);
    if (user[0][0]?.role === "admin")
      return res.status(400).send({ message: "Admin cannot be delete" });

    const query = "DELETE FROM User WHERE userId = ?";
    const result = await connection.query(query, [userId]);

    if (result[0].affectedRows === 0) {
      connection.release(); // Release connection
      return res.status(404).send({ message: "Invalid userId" });
    }

    connection.release();
    return res.status(200).send({ message: "User deleted" });
  }
);

router.put("/updatePassword", [auth], async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const query = "SELECT * FROM User WHERE userId = ?";
  const connection = await db.getConnection();
  const [users] = await connection.query(query, [req.user.userId]);

  const user = users[0];
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  connection.release();

  if (!isMatch) {
    return res.status(401).send({ message: "INVALID OLD PASSWORD" });
  } else {
    const updateQuery = "UPDATE User SET password = ? WHERE userId = ?";
    const connection = await db.getConnection();

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    await connection.query(updateQuery, [hashedPassword, user.userId]);
    connection.release();
    return res.status(201).send({ message: "Password updated" });
  }
});

router.put("/updateUsername", [auth], async (req, res) => {
  const { newUsername } = req.body;
  const connection = await db.getConnection();

  try {
    // Check if the new username already exists
    const checkQuery = "SELECT COUNT(*) as count FROM User WHERE username = ?";
    const [checkResult] = await connection.query(checkQuery, [newUsername]);

    if (checkResult[0].count > 0) {
      connection.release();
      return res.status(400).send({ message: "Username already exists" });
    }

    // If username does not exist, proceed with the update
    const updateQuery = "UPDATE User SET username = ? WHERE userId = ?";
    await connection.query(updateQuery, [newUsername, req.user.userId]);
    connection.release();
    return res.status(201).send({ message: "Username updated" });
  } catch (err) {
    connection.release();
    return res
      .status(500)
      .send({ message: "An error occurred while updating the username" });
  }
});

export default router; // Use export default for ES6 modules
