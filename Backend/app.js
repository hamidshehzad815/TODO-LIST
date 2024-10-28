import "express-async-errors";
import express from "express";
import cors from "cors"; // Import cors
import routes from "./start/routes.js";
import logger from "./utils/logger.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to your frontend URL
  })
);

// Log every request
app.use((req, res, next) => {
  logger.info(`${req.method} ---> ${req.url}`);
  next(); // Call next() to move to the next middleware
});

routes(app);

export default app;
