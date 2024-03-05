const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    if (req.query.fitness_plan === "Pro") { 
        res.send("hello");
    } 
    else { 
        res.status(403).send("Forbidden"); 
    } 
});

module.exports = router;