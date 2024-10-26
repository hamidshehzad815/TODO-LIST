import { body, validationResult } from "express-validator";

const requestValidations = [
  body("title")
    .exists()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty after trimming"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("dueDate").optional(),
  body("priority")
    .optional()
    .toLowerCase()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of the following: Low, Medium, High"),
  body("status")
    .optional()
    .toLowerCase()
    .isIn(["pending", "completed"])
    .withMessage("Status must be one of the following: Pending, Completed"),
  body("assignedTo").optional(),
];

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  next();
}

export { requestValidations, validateRequest };