import { body, validationResult } from "express-validator";

const signUpValidations = [
  body("username")
    .exists()
    .withMessage("username is required")
    .isString()
    .withMessage("username must be a string")
    .trim()
    .notEmpty()
    .withMessage("username is required"),
  body("email")
    .exists()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email"),
  body("password")
    .exists()
    .withMessage("Password is Required")
    .isLength({ min: 10 })
    .withMessage("Password must be greater than 10 characters")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be empty after trimming"),
];

function validateSignup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  next();
}

export { signUpValidations, validateSignup };
