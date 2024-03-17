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
        // Get the userId from the session
        const userId = req.session.userId;
        if (!userId) {
            // Redirect to login page if user is not logged in
            res.redirect("/login.html");
            return;
        }

        // Fetch the user's name from the database
        const db = require("../database"); // Import the database connection
        const userName = await getUserById(userId, db);
        fullName = userName.split(" ");
        firstName = fullName[0]

        if (userName) {
            // Render the home page with the user's name
            res.render("home", { userName: firstName });
        } else {
            // User not found in the database
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error("Error fetching user's name:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;