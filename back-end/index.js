const express = require ("express");
const mysql = require("mysql2");

const app = express();

app.listen(8000, () => {
    console.log("Server is on localhost port 8000");
});



