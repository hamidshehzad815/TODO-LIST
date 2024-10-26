import { config } from "dotenv";
import mysql from "mysql2/promise";
import colors from "colors";

config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to Database".bgGreen);
  } catch (error) {
    console.error("Database connection error:".bgRed);
    console.log(error);
  }
};
testConnection();
export default pool;
