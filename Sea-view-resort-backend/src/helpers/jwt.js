import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export function createToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRET_KEY_TOKEN,
      {
        expiresIn: "60m",
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}
