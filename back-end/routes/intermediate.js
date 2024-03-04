const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    if (req.params.fitness_plan === "Intermediate") { 
        res.send("hello");
    } 
    else { 
        res.status(403).send("Forbidden"); 
    } 
});

module.exports = router;