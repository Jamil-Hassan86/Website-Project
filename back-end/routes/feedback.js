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

router.post('/submit-feedback', async (req, res) => {
    const { name, content, rating } = req.body; // Ensure the names match the form fields

    try {
        await db.run('INSERT INTO feedback (name, post_content, rate, post_date) VALUES (?, ?, ?, CURRENT_TIMESTAMP)', [name, content, rating]);
        console.log("Review submitted:", req.body);
        res.redirect('/feedback');
    } catch (error) {
        console.error("Error posting review:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        const db = require("../database"); // Import the database connection
        
        const userName = await getUserById(userId, db);
        db.all('SELECT * FROM feedback', (err, rows) => {
            if (err) {
                console.error('Error retrieving feedback:', err);
                res.status(500).send("Internal Server Error");
            } else {
                console.log('Retrieved feedback data:', rows);
                res.render('feedback', { userName: userName, feedback: rows });
            }
        });
    } catch (error) {
        console.error("Error fetching user's name:", error);
        res.status(500).send("Internal Server Error");
    }    
});


module.exports = router;