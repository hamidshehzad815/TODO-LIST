import jwt from "jsonwebtoken";
export default async function (user) {
  const payload = {
    ...user,
  };
  // const secretKey = process.env.SECRET_KEY;
  const options = {
    expiresIn: "48h",
  };

  return jwt.sign(payload, process.env.SECRET_KEY, options);
}
