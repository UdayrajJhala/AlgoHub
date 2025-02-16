const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { pool } = require("../config/database");

router.get("/leaderboard", verifyToken, async (req, res) => {
  try {
    const rankings = await pool.query(
      `SELECT u.name, 
              p.total_submissions, 
              p.correct_submissions, 
              p.accuracy, 
              p.problems_solved 
       FROM users u 
       JOIN user_progress p ON u.id = p.user_id 
       ORDER BY p.problems_solved DESC, p.accuracy DESC, p.correct_submissions DESC`
    );

    res.json(rankings.rows);
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/data", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userProgress = await pool.query(
      `SELECT total_submissions, correct_submissions, accuracy, problems_solved 
       FROM user_progress 
       WHERE user_id = $1`,
      [userId]
    );

    if (userProgress.rows.length === 0) {
      return res.status(404).json({ error: "User progress not found" });
    }

    const rankQuery = await pool.query(
      `SELECT user_id, RANK() OVER (ORDER BY problems_solved DESC, accuracy DESC, correct_submissions DESC) as rank 
       FROM user_progress`
    );

    const userRank =
      rankQuery.rows.find((row) => row.user_id === userId)?.rank || null;

    res.json({ ...userProgress.rows[0], rank: userRank });
  } catch (error) {
    console.error("❌ Error fetching user progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/submissions", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await pool.query(
      `SELECT s.submission_id, s.problem_id, s.code, s.language, s.status, s.submitted_at, p.title
       FROM submissions s, problem p
       WHERE s.problem_id = p.problem_id and user_id = $1 
       ORDER BY submitted_at DESC`,
      [userId]
    );

    res.json(submissions.rows);
  } catch (error) {
    console.error("❌ Error fetching submissions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
