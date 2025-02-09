const jwt = require("jsonwebtoken");

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

module.exports = { verifyToken };
