const express = require('express');
const router = express.Router();

app.get("/", sessionCheck, (req, res) => {
    // Check user's fitness plan and allow or deny access
    if (req.session.fitnessPlan === "beginner") {
      res.send("Welcome, Beginner User!");
    } else {
      res.status(403).send("Forbidden");
    }
  });

module.exports = router;