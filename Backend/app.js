import "express-async-errors";
import express from "express";
import cors from "cors"; // Import cors
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to your frontend URL
  })
);

import routes from "./start/routes.js";
routes(app);
export default app;
