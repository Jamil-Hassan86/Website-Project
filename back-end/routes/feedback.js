const express = require('express');
const router = express.Router();
const { db } = require('../database');

const sessionCheck = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).send("Unauthorized");
    }
    next();
};

const getUserById = (userId, db) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT name FROM users WHERE id = ?";
        db.all(query, [userId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve(result[0].name);
                } else {
                    resolve(null); // User not found
                }
            }
        });
    });
};



router.get('/', sessionCheck, async (req, res) => {
    try {
        const userId = req.session.userId;
        if(!userId){
            res.redirect('/');
        }
        const db = require("../database"); // Import the database connection
        const userName = await getUserById(userId, db);
        res.render('feedback', { userName: userName });
    } catch (error) {
        console.error("Error fetching user's name:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;