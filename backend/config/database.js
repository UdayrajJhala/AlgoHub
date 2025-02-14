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
      example_cases JSONB NOT NULL,
      cpp_template TEXT NOT NULL,
      java_template TEXT NOT NULL
    );
  `;
  await pool.query(query);
  console.log("✅ Problem table created (if not exists).");
}
async function insertProblems() {
  const query = `
    INSERT INTO problem (title, description, difficulty, topics, input_format, output_format, example_cases, cpp_template, java_template) 
    VALUES (
      'Two Sum', 
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      'Easy', 
      ARRAY['Array', 'Hash Table'], 
      'First line: an integer n (size of array)\nSecond line: n space-separated integers\nThird line: an integer target', 
      'Two space-separated integers representing the indices of the two numbers.', 
      '[{"input": "4\\n2 7 11 15\\n9", "output": "0 1"}]',
      '#include <iostream>\n#include <vector>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n  // Your code here\n}\n\nint main() {\n  int n, target;\n  cin >> n;\n  vector<int> nums(n);\n  for (int i = 0; i < n; i++) cin >> nums[i];\n  cin >> target;\n  vector<int> result = twoSum(nums, target);\n  cout << result[0] << " " << result[1] << endl;\n  return 0;\n}',
      'import java.util.*;\nclass Main {\n  public static int[] twoSum(int[] nums, int target) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] nums = new int[n];\n    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n    int target = sc.nextInt();\n    int[] result = twoSum(nums, target);\n    System.out.println(result[0] + " " + result[1]);\n    sc.close();\n  }\n}'
    ) 
    ON CONFLICT (title) DO NOTHING;
  `;
  await pool.query(query);
  console.log("✅ Two Sum problem inserted (if not exists).");
}


async function createTestcasesTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS testcase (
      testcase_id SERIAL PRIMARY KEY,
      problem_id INT REFERENCES problem(problem_id) ON DELETE CASCADE,
      input TEXT NOT NULL,
      output TEXT NOT NULL
    );
  `;
  await pool.query(query);
  console.log("✅ Testcase table created (if not exists).");
}

async function insertTestcases() {
  const query = `
    INSERT INTO testcase (problem_id, input, output) VALUES
      (1, '4\n2 7 11 15\n9', '0 1'),
      (1, '3\n3 2 4\n6', '1 2'),
      (1, '2\n3 3\n6', '0 1'),
      (1, '5\n1 5 3 7 9\n8', '0 3'),
      (1, '6\n2 3 1 6 4 8\n7', '1 3'),
      (1, '4\n1 2 3 4\n5', '0 3'),
      (1, '5\n10 20 10 40 50\n30', '0 2'),
      (1, '6\n1 6 11 14 8 2\n9', '0 4'),
      (1, '7\n5 2 4 6 3 7 8\n10', '2 3'),
      (1, '4\n4 3 6 2\n8', '0 2')
    ON CONFLICT DO NOTHING;
  `;
  await pool.query(query);
  console.log("✅ Testcases inserted (if not exists).");
}

async function initDB() {
  await createUsersTable();
  await createProblemsTable();
  await insertProblems();
  await createTestcasesTable();
  await insertTestcases();
}

module.exports = { pool, initDB };
