import dotenv from "dotenv";
dotenv.config();
const { PASSWORD_BCRYPTION, SALT_ROUNDS, JWT } = process.env;
export default {
  jsonWebToken: JWT,
  pepper: PASSWORD_BCRYPTION,
  salt: SALT_ROUNDS,
};