const express = require ("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

const db = mysql.createConnection({
    host: `localhost`,
    user: `root`,
    password: "Corrosive123",
    database: `fitness_db`
});

const createUserTable = `
CREATE TABLE users (
  id INT AUTO_INCREMENT,
  name VARCHAR(50),
  email VARCHAR(50),
  password VARCHAR(50),
  fitness_plan VARCHAR(50),
  PRIMARY KEY(id)
);
`;

db.query(createUserTable, (err, result) => {
    if (err) throw err;
    console.log("User table created...");
  });

db.connect((err) => {
    if(err) throw err;
    console.log(`Connected to database`)
});

app.post("/api/user/create", (req, res) => {
  const { name, email, password, fitness_plan } = req.body;
  
  console.log("Received sign-up request with data: ", req.body);

  const createUserQuery = `
    INSERT INTO users (name, email, password, fitness_plan)
    VALUES (?, ?, ?, ?)
  `;

  db.query(createUserQuery, [name, email, password, fitness_plan], (err, result) => {
    if (err) throw err;
    console.log("User added to the database: ", result);
    res.send("User account created.");
  });
});  

app.get("/", (req, res) => {
    res.send("Hello world!");
})

app.listen(port, () => {
    console.log(`Server is on localhost port ${port}`);
});



