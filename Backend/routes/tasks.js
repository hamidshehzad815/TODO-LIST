import express from "express";
const router = express.Router();
import db from "../database/database.js";
import auth from "../middleware/auth.js";
import authorization from "../middleware/authorization.js";
import { taskAssignedEmail as sendEmail } from "../services/sendEmail.js";
import {
  requestValidations,
  validateRequest,
} from "../middleware/taskCreationMiddleware.js";
import { validations, validate } from "../middleware/taskUpdateValidations.js";

router.delete("/delete-task/:taskId", [auth], async (req, res) => {
  const taskId = req.params?.taskId;
  if (!taskId || isNaN(taskId)) {
    return res.status(400).send({ message: "Invalid task ID" });
  }

  const connection = await db.getConnection();
  const user = req.user;
  let query;

  if (user.role === "Admin") {
    query = "DELETE FROM Task WHERE taskId = ?";
  } else {
    query = "DELETE FROM Task WHERE taskId = ? AND createdBy = ?";
  }

  const result = await connection.query(
    query,
    user.role === "Admin" ? [taskId] : [taskId, user.userId]
  );

  connection.release();

  if (result[0].affectedRows === 0) {
    return res.status(404).send({ message: "Task not found" });
  }

  return res.status(200).send({ message: "Task deleted" });
});

router.post(
  "/createTask",
  [auth, ...requestValidations, validateRequest],
  async (req, res) => {
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
    } = req.body;
    const connection = await db.getConnection();
    let sendMail = null;
    let assigneeId = null;
    if (assignedTo) {
      const query = "SELECT userId FROM User WHERE email = ?";
      const [emailResult] = await connection.query(query, [assignedTo]);
      if (emailResult && emailResult.length > 0) {
        sendMail = assignedTo;
        assigneeId = emailResult[0].userId;
      } else {
        return res.status(404).send({ message: "Invalid assignee Email" });
      }
    }

    const user = req.user;
    const query =
      "INSERT INTO Task (title, description, dueDate, priority, status, createdBy, assignedTo) VALUES (?,?,?,?,?,?,?)";
    const result = await connection.query(query, [
      title,
      description,
      dueDate,
      priority,
      status,
      user.userId,
      assigneeId,
    ]);

    if (sendMail) {
      sendEmail(user, sendMail);
    }

    connection.release();
    return res.status(201).send({ result, message: "Task Created" });
  }
);

router.put(
  "/updateTask/:taskId",
  [auth, ...validations, validate],
  async (req, res) => {
    const { title, description, dueDate, priority, status } = req.body;
    const { taskId } = req.params;
    const user = req.user;
    const isAdmin = user.role === "admin";

    const connection = await db.getConnection();

    const query = isAdmin
      ? "UPDATE Task SET title = COALESCE(?, title), description = COALESCE(?, description), dueDate = COALESCE(?, dueDate), priority = COALESCE(?, priority), status = COALESCE(?, status), updatedBy = ? WHERE taskId = ?"
      : "UPDATE Task SET title = COALESCE(?, title), description = COALESCE(?, description), dueDate = COALESCE(?, dueDate), priority = COALESCE(?, priority), status = COALESCE(?, status), updatedBy = ? WHERE taskId = ? AND (createdBy = ? OR assignedTo = ?)";

    const params = isAdmin
      ? [title, description, dueDate, priority, status, user.userId, taskId]
      : [
          title,
          description,
          dueDate,
          priority,
          status,
          user.userId,
          taskId,
          user.userId,
          user.userId,
        ];

    try {
      const [result] = await connection.query(query, params);

      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Task Not Found" });
      }

      return res.status(200).send({ message: "Task updated" });
    } catch (error) {
      return res.status(500).send({ message: "Internal server error" });
    } finally {
      connection.release();
    }
  }
);

router.get("/tasks", [auth], async (req, res) => {
  const connection = await db.getConnection();
  const user = req.user;

  const query = `
    SELECT t.*, 
           c.email as createdByEmail,
           a.email as assignedToEmail
    FROM Task t
    LEFT JOIN User c ON t.createdBy = c.userId
    LEFT JOIN User a ON t.assignedTo = a.userId
    WHERE t.createdBy = ? OR t.assignedTo = ?
  `;

  const [tasks] = await connection.query(query, [user.userId, user.userId]);
  connection.release();

  if (tasks.length === 0) {
    return res.status(404).send({ message: "No task found" });
  }

  return res.status(200).send(tasks);
});

router.get("/allTasks", [auth, authorization], async (req, res) => {
  const connection = await db.getConnection();
  const query = "SELECT * FROM Task";
  const [tasks] = await connection.query(query);
  connection.release();
  if (tasks.length === 0)
    return res.status(404).send({ message: "No task found" });
  return res.status(200).send(tasks);
});

router.get("/taskFilter/:columnName/:filterBy", [auth], async (req, res) => {
  const user = req.user;
  const filterBy = req.params.filterBy;
  const columnName = req.params.columnName;

  const allowedColumns = ["status", "priority"];
  if (!allowedColumns.includes(columnName.toLowerCase())) {
    return res.status(400).send({ message: "Invalid column name" });
  }

  const connection = await db.getConnection();
  const query = `SELECT * FROM Task WHERE ${columnName} = ? AND createdBy = ?`;
  const [tasks] = await connection.query(query, [filterBy, user.userId]);
  connection.release();
  if (tasks.length === 0)
    return res.status(404).send({ message: "No task found" });
  return res.status(200).send(tasks);
});

router.get("/taskBy/:sortBy/:sortingOrder?", [auth], async (req, res) => {
  const user = req.user;
  const sortBy = req.params.sortBy;
  const sortingOrder = req.params.sortingOrder || "asc";

  const allowedSortByFields = [
    "title",
    "description",
    "dueDate",
    "priority",
    "status",
  ];
  const allowedSortingOrders = ["asc", "desc"];

  if (!allowedSortByFields.includes(sortBy)) {
    return res.status(400).send({ message: "Invalid sortBy field." });
  }

  if (!allowedSortingOrders.includes(sortingOrder.toLowerCase())) {
    return res
      .status(400)
      .send({ message: "Invalid sorting order. Use 'asc' or 'desc'." });
  }
  const connection = await db.getConnection();
  const query = `SELECT * FROM Task WHERE createdBy = ? ORDER BY ${sortBy} ${sortingOrder.toUpperCase()}`;

  const [tasks] = await connection.query(query, [user.userId]);
  connection.release();
  if (tasks.length === 0)
    return res.status(404).send({ message: "No task found" });
  return res.status(200).send(tasks);
});

router.get("/taskById/:taskId", [auth], async (req, res) => {
  const { taskId } = req.params;
  const findTaskQuery = "SELECT * FROM Task WHERE taskId = ?";
  const connection = await db.getConnection();
  const [result] = await connection.query(findTaskQuery, [taskId]);
  connection.release();
  return res.status(200).send(result[0]);
});
export default router;
