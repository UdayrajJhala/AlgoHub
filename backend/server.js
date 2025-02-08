const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

// Database setup
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

// Database initialization
const initDB = async () => {
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
};

initDB();

// JWT Helper Functions
const createTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      type: "access",
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  console.log("Access Token:", accessToken);
  console.log("Refresh Token:", refreshToken);

  return { accessToken, refreshToken };
};

// Middleware to verify access token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
      }

      if (decoded.type !== "access") {
        return res.status(401).json({ message: "Invalid token type" });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Token verification failed" });
  }
};

// Passport configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await pool.query(
          "SELECT * FROM users WHERE google_id = $1",
          [profile.id]
        );

        if (existingUser.rows.length) {
          return done(null, existingUser.rows[0]);
        }

        const newUser = await pool.query(
          "INSERT INTO users (google_id, email, name, picture) VALUES ($1, $2, $3, $4) RETURNING *",
          [
            profile.id,
            profile.emails[0].value,
            profile.displayName,
            profile.photos[0].value,
          ]
        );

        return done(null, newUser.rows[0]);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Auth routes
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/api/image-endpoint", async (req, res) => {});

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      const tokens = createTokens(req.user);
      res.redirect(
        `${
          process.env.CLIENT_URL || "http://localhost:5173"
        }/login?accessToken=${tokens.accessToken}&refreshToken=${
          tokens.refreshToken
        }`
      );
    } catch (error) {
      res.redirect(
        `${
          process.env.CLIENT_URL || "http://localhost:5173"
        }/login?error=authentication_failed`
      );
    }
  }
);

// Refresh token endpoint
app.post("/api/auth/refresh", async (req, res) => {
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

        // Get user from database
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [
          decoded.id,
        ]);
        if (!user.rows.length) {
          return res.status(404).json({ message: "User not found" });
        }

        // Create new tokens
        const tokens = createTokens(user.rows[0]);
        res.json(tokens);
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Token refresh failed" });
  }
});

app.get("/api/user/profile", verifyToken, async (req, res) => {
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
      date: user.created_at
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Protected route to get user data
app.get("/api/auth/user", verifyToken, async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);

    if (!user.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = user.rows[0];
    delete userData.google_id; // Remove sensitive info

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

// Verify token route (for initial auth check)
app.get("/api/auth/verify", verifyToken, async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);

    if (!user.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = user.rows[0];
    delete userData.google_id; // Remove sensitive info

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
