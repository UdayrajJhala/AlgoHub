const express = require("express");
const passport = require("../config/passport");
const { createTokens } = require("../utils/jwt");
const { verifyToken } = require("../middleware/auth");
const { pool } = require("../config/database");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      const tokens = createTokens(req.user);
      console.log(
        `Redirecting to: ${process.env.CLIENT_URL}/login?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`
      );

      res.redirect(
        `${process.env.CLIENT_URL}/login?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`
      );
    } catch (error) {
      res.redirect(
        `${process.env.CLIENT_URL}/login?error=authentication_failed`
      );
    }
  }
);

router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);

    if (!user.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = user.rows[0];
    delete userData.google_id;

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid refresh token" });
        }

        if (decoded.type !== "refresh") {
          return res.status(401).json({ message: "Invalid token type" });
        }

        const user = await pool.query("SELECT * FROM users WHERE id = $1", [
          decoded.id,
        ]);
        if (!user.rows.length) {
          return res.status(404).json({ message: "User not found" });
        }

        const tokens = createTokens(user.rows[0]);
        res.json(tokens);
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Token refresh failed" });
  }
});

router.get("/verify", verifyToken, async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);

    if (!user.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = user.rows[0];
    delete userData.google_id;

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
});

module.exports = router;
