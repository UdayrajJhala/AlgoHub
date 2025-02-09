const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { pool } = require("../config/database");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT problem_id, title, description, difficulty, topics FROM problem"
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

module.exports = router;