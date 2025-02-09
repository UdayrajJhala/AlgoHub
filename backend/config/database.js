const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

async function createUsersTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE,
        name VARCHAR(255),
        picture VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

async function createProblemsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS problem (
      problem_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      difficulty VARCHAR(50) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) NOT NULL,
      topics TEXT[] NOT NULL,
      input_format TEXT NOT NULL,
      output_format TEXT NOT NULL,
      example_cases JSONB NOT NULL
    );
  `;
  await pool.query(query);
  console.log("✅ Problem table created (if not exists).");
}

async function insertProblems() {
  const query = `
    INSERT INTO problem (title, description, difficulty, topics, input_format, output_format, example_cases) 
    VALUES (
      'Two Sum', 
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      'Easy', 
      ARRAY['Array', 'Hash Table'], 
      'First line: an integer n (size of array)\nSecond line: n space-separated integers\nThird line: an integer target', 
      'Two space-separated integers representing the indices of the two numbers.', 
      '[{"input": "4\\n2 7 11 15\\n9", "output": "0 1"}]'
    ) 
    ON CONFLICT (title) DO NOTHING;
  `;
  await pool.query(query);
  console.log("✅ Two Sum problem inserted (if not exists).");
}

async function initDB() {
  await createUsersTable();
  await createProblemsTable();
  await insertProblems();
}

module.exports = { pool, initDB };
