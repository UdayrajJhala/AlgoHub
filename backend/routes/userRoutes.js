const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { pool } = require("../config/database");

const router = express.Router();

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const query =
      "SELECT email, name, picture, TO_CHAR(created_at, 'DD-MM-YY') AS created_at FROM users WHERE id = $1";
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    res.json({
      email: user.email,
      name: user.name,
      profilePicUrl: user.picture,
      date: user.created_at,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
