const express = require("express");
const router = express.Router();
const { db } = require('../database');
const sessionCheck = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).send("Unauthorized");
    }
    next();
};


router.get("/", sessionCheck, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).send("Internal Server Error");
        }
        // Redirect the user to the login page or any other desired location
        res.redirect('/');
    });
});    

module.exports = router;
