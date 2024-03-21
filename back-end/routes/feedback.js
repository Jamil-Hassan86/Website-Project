const express = require('express');
const router = express.Router();
const { db } = require('../database');

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

router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        const db = require("../database"); // Import the database connection
        const userName = await getUserById(userId, db);
        const feedback = await db.all('SELECT * FROM feedback ORDER BY post_date DESC');
        res.render('feedback', { userName: userName, feedback: feedback });
    } catch (error) {
        console.error("Error fetching user's name:", error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;