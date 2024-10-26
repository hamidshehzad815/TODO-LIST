import { body, check, validationResult } from "express-validator";

const loginValidations = [
  body("email")
    .exists({ checkFalsy: true }) // This ensures the field exists and is not falsy (like an empty string or null)
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email"),
  
  body("password")
    .exists({ checkFalsy: true }) // Ensure the field is not null or an empty string
    .withMessage("Password is required")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be empty after trimming"),
];


function validateLogin(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  next();
}

export  {
  loginValidations,
  validateLogin,
};
