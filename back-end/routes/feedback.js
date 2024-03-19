const express = require('express');
const router = express.Router();
const { db } = require('../database');

router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        const db = require("../database"); // Import the database connection
        res.render('feedback');
    } catch (error) {
        console.error("Error fetching user's name:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;