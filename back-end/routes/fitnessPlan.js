const express = require('express');
const router = express.Router();
const { db } = require('../database');


router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        const db = require("../database"); // Import the database connection
        const getUserFitnessPlan = (userId) => {
            return new Promise((resolve, reject) => {
              const query = `SELECT fitness_plan FROM users WHERE id = ?`;
              db.all(query, [userId], (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result.fitness_plan);
                }
              });
            });
          };
        const fitnessPlan = await getUserFitnessPlan(userId, db);

        if (fitnessPlan === 'beginner') {
            res.render("beginner", { fitnessPlan: fitnessPlan });
        } else if(fitnessPlan === 'intermediate'){
            res.render("intermediate", { fitnessPlan: fitnessPlan })
        } else{
            res.render("pro", { fitnessPlan: fitnessPlan })
        }
    } catch (error) {
        console.error("Error fetching user's name:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;