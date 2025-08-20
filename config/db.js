const mysql = require('mysql2');
require("dotenv").config();

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Convert pool to use promises
const promisePool = pool.promise();

// Test the connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log("✅ Connected to MySQL database");
    connection.release();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit if we can't connect to the database
  }
};
testConnection();

module.exports = promisePool;

