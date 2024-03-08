const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    if (req.query.fitness_plan === "beginner") { 
        res.sendFile()
    } 
    else { 
        res.status(403).send("Forbidden"); 
    } 
});

module.exports = router;