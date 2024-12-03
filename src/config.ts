import dotenv from "dotenv";
import { Pool } from "pg";
dotenv.config();
const {
  PORT,
  POSTGRES_HOST,
  NODE_ENV,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = process.env;
// export default {
//   port: PORT,
// };
const pool = new Pool({
  host: POSTGRES_HOST,
  database: NODE_ENV === "dev" ? POSTGRES_DB : POSTGRES_DB_TEST,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  // port: parseInt(PORT as string, 10),
});

pool.on("error", (error: Error) => {
  console.error(`Database Error: ${error.message}`);
});
export default pool;
