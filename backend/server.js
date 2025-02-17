const express = require("express");
const cors = require("cors");
const passport = require("./config/passport");
const { initDB } = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const problemRoutes = require("./routes/problemRoutes");
const progressRoutes = require("./routes/progressRoutes");
const axios = require("axios");

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

initDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/problem", problemRoutes);
app.use("/api/progress", progressRoutes);

app.get("/ping", (req, res) => {
  res.status(200).send("Pong");
});

const pingServer = () => {
  setInterval(() => {
    axios
      .get(`http://localhost:${process.env.PORT || 5000}/ping`)
      .then((response) => {
        console.log("Pinged the server successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error pinging the server:", error);
      });
  }, 600000); 
};

pingServer(); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
