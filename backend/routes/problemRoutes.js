const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { pool } = require("../config/database");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM problem"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching problems", error });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM problem WHERE problem_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching problem details", error });
  }
});

router.post("/run", verifyToken, async (req, res) => {
  console.log("🔹 Run route hit");
  let actualOutput = "";
  let actualError = "";

  try {
    const { problem_id, code, language } = req.body;
    console.log("🔹 Request Body:", { problem_id, language });

    // Map language to Judge0 language_id
    const languageMap = { cpp: 54, java: 62 };
    const languageId = languageMap[language];

    if (!languageId) {
      console.error("❌ Unsupported language:", language);
      return res.status(400).json({ error: "Unsupported language" });
    }

    console.log("✅ Language mapped:", { language, languageId });

    // Fetch first test case for the problem
    console.log("🔹 Fetching test case for problem ID:", problem_id);

    const RES = await pool.query(
      "SELECT input, output FROM testcase WHERE problem_id = $1 LIMIT 1",
      [problem_id]
    );

    console.log("✅ Database query result:", RES.rows);

    if (RES.rows.length === 0) {
      console.error("❌ No test cases found for problem:", problem_id);
      return res.status(404).json({ error: "No test cases found" });
    }

    const { input, output } = RES.rows[0];
    console.log("✅ Test case fetched:", { input, expectedOutput: output });

    // Send submission request to Judge0
    console.log("🔹 Sending code to Judge0...");

    const judge0Response = await fetch(
      "http://43.204.130.231:2358/submissions?base64_encoded=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": "",
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: Buffer.from(code).toString("base64"), // Encode code in base64
          stdin: Buffer.from(input).toString("base64"), // Encode input in base64
        }),
      }
    );

    console.log("✅ Judge0 response received:", judge0Response.status);

    const judge0Data = await judge0Response.json();
    console.log("✅ Judge0 response body:", judge0Data);

    if (!judge0Data.token) {
      console.error("❌ Failed to get submission token from Judge0");
      return res.status(500).json({ error: "Failed to get submission token" });
    }

    // Fetch execution result from Judge0
    const token = judge0Data.token;
    console.log("🔹 Polling Judge0 for results... Token:", token);

    let result;
    let pollCount = 0;

    do {
      pollCount++;
      await new Promise((res) => setTimeout(res, 1000)); // Wait 1 sec before polling
      const resultResponse = await fetch(
        `http://43.204.130.231:2358/submissions/${token}?base64_encoded=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": "",
          },
        }
      );

      result = await resultResponse.clone().json(); // 🛠️ Clone before reading
      console.log(`✅ Poll ${pollCount}: Response from Judge0 -`, result);

      // Decode output if it exists
      if (result.stdout) {
        actualOutput = Buffer.from(result.stdout, "base64").toString();
      }
      if (result.stderr) {
        actualError = Buffer.from(result.stderr, "base64").toString();
      }

      console.log(`✅ Poll ${pollCount}: Response from Judge0 -`, result);

      // Check if status exists before accessing description
      if (!result || !result.status) {
        console.error("❌ Judge0 response is missing 'status':", result);
        return res.status(500).json({ error: "Invalid response from Judge0" });
      }

      console.log(
        `✅ Poll ${pollCount}: Status description -`,
        result.status.description
      );
    } while (result.status.description != "Accepted");


    // Match output
    console.log("🔹 Matching output...");
    console.log("🔹 Expected:", output.trim());
    console.log("🔹 Received:", actualOutput.trim());

    const isCorrect = actualOutput.trim() === output.trim();

    console.log("✅ Result:", { isCorrect });

    console.log(result.time)
    console.log(result.memory)

    time=result.time*1000;

    res.json({
      input: input,
      correct: isCorrect,
      stderr: actualError,
      time: time,
      memory: result.memory,
      output: actualOutput,
    });
  } catch (error) {
    console.error("❌ Error running code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/submit", verifyToken, async (req, res) => {
  console.log("🔹 Submit route hit");

  try {
    const { problem_id, code, language } = req.body;
    const user_id = req.user.id;
    console.log("🔹 Request Body:", { problem_id, language });

    // Map language to Judge0 language_id
    const languageMap = { cpp: 54, java: 62 };
    const languageId = languageMap[language];

    if (!languageId) {
      console.error("❌ Unsupported language:", language);
      return res.status(400).json({ error: "Unsupported language" });
    }

    console.log("✅ Language mapped:", { language, languageId });

    console.log("🔹 Fetching test cases for problem ID:", problem_id);

    const testCaseResults = await pool.query(
      "SELECT input, output FROM testcase WHERE problem_id = $1",
      [problem_id]
    );

    console.log("✅ Found", testCaseResults.rows.length, "test cases");

    if (testCaseResults.rows.length === 0) {
      console.error("❌ No test cases found for problem:", problem_id);
      return res.status(404).json({ error: "No test cases found" });
    }

    let passed = 0;
    let failedCases = [];
    let averageMemory = 0;
    let averageTime = 0;

    // Run each test case sequentially
    for (let i = 0; i < testCaseResults.rows.length; i++) {
      const { input, output: expectedOutput } = testCaseResults.rows[i];
      console.log(
        `🔹 Running test case ${i + 1}/${testCaseResults.rows.length}`
      );

      // Submit to Judge0
      const judge0Response = await fetch(
        "http://43.204.130.231:2358/submissions?base64_encoded=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": "",
          },
          body: JSON.stringify({
            language_id: languageId,
            source_code: Buffer.from(code).toString("base64"),
            stdin: Buffer.from(input).toString("base64"),
          }),
        }
      );

      const judge0Data = await judge0Response.json();

      if (!judge0Data.token) {
        console.error("❌ Failed to get submission token from Judge0");
        return res
          .status(500)
          .json({ error: "Failed to get submission token" });
      }

      // Poll Judge0 for results
      const token = judge0Data.token;
      let result;
      let pollCount = 0;
      let actualOutput = "";
      let actualError = "";
    

      do {
        pollCount++;
        await new Promise((res) => setTimeout(res, 500)); // 1.5 sec delay before polling
        const resultResponse = await fetch(
          `http://43.204.130.231:2358/submissions/${token}?base64_encoded=true`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Auth-Token": "",
            },
          }
        );

        result = await resultResponse.json();

        if (result.stdout) {
          actualOutput = Buffer.from(result.stdout, "base64").toString().trim();
        }
        if (result.stderr) {
          actualError = Buffer.from(result.stderr, "base64").toString().trim();
        }

        console.log(
          `✅ Poll ${pollCount}: Status -`,
          result.status.description
        );
      } while (result.status.description !== "Accepted" && pollCount < 10);

      if (pollCount >= 10) {
        console.error("❌ Timeout while waiting for Judge0 response");
        return res.status(500).json({ error: "Execution timeout or failure." });
      }



      // Compare outputs
      console.log(
        `🔹 Expected: ${expectedOutput.trim()} | Received: ${actualOutput}`
      );
      if (actualOutput === expectedOutput.trim()) {
        passed++;
      } else {
        failedCases.push({
          testCase: i + 1,
          expected: expectedOutput,
          received: actualOutput,
        });
      }
      averageMemory += result.memory;
      averageTime += 1000*(result.time);
    }

    averageMemory/=10;
    averageTime/=10;

    console.log(averageTime)
    console.log(averageMemory)

    const totalCases = testCaseResults.rows.length;
    const allPassed = passed === totalCases;

    console.log(
      `✅ Submission results: ${passed}/${totalCases} test cases passed`
    );


    const status = allPassed ? "Passed" : "Failed";

    await pool.query(
      "INSERT INTO submissions (user_id, problem_id, code, language, status) VALUES ($1, $2, $3, $4, $5)",
      [user_id, problem_id, code, language, status]
    );

    console.log("✅ Submission added to database");

    await pool.query(
      `INSERT INTO user_progress (user_id, total_submissions, correct_submissions, accuracy, problems_solved)
    VALUES ($1, 1, $2, CASE WHEN $2 = 1 THEN 100 ELSE 0 END, CASE WHEN $2 = 1 THEN 1 ELSE 0 END)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
    total_submissions = user_progress.total_submissions + 1,
    correct_submissions = user_progress.correct_submissions + CASE WHEN $2 = 1 THEN 1 ELSE 0 END,
    accuracy = ((user_progress.correct_submissions + CASE WHEN $2 = 1 THEN 1 ELSE 0 END) * 100.0) / (user_progress.total_submissions + 1),
    problems_solved = user_progress.problems_solved + CASE 
      WHEN $2 = 1 AND NOT EXISTS (
        SELECT 1 FROM submissions WHERE user_id = $1 AND problem_id = $3 AND status = 'Passed'
      ) THEN 1 ELSE 0 END;`,
      [user_id, allPassed ? 1 : 0, problem_id]
    );

    console.log("✅ Progress added to database");


    console.log(totalCases);
    console.log(passed);
    console.log(allPassed);
    console.log(failedCases);

    res.json({
      totalCases,
      passed,
      failed: totalCases - passed,
      success: allPassed,
      failedCases,
      averageMemory:averageMemory,
      averageTime:averageTime
    });
  } catch (error) {
    console.error("❌ Error submitting code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
