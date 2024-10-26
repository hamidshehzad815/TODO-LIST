import express from "express";
import users from "../routes/users.js";
import tasks from "../routes/tasks.js";
import comments from "../routes/comments.js";
import reviews from "../routes/reviews.js";
import error from "../middleware/errorhandler.js";

const setupRoutes = (app) => {
  app.use(express.json());
  app.use("/users", users);
  app.use("/tasks", tasks);
  app.use("/comments", comments);
  app.use("/reviews", reviews);
  app.use(error);
};

export default setupRoutes;
