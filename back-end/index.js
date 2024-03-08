//importing modules
const express = require ("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;
const path = require('path');
const http = require('http');
const session = require('express-session');

const app = express();

app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

//routes
const beginnerRoute = require('./routes/beginner');
const intermediateRoute = require('./routes/intermediate');
const proRoute = require('./routes/pro');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('../front-end/public'));

//creating database to store user records

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

//POST method to database when successfully signing up

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
    res.send("You have successfully created an account");
  });
});

//handles login
app.post("/api/user/login", (req, res) => {
  const { email, password } = req.body;

  const userId = 1;

  getUserFitnessPlan(userId)
    .then((fitnessPlan) => {
      // Store user information in the session
      req.session.userId = userId;
      req.session.fitnessPlan = fitnessPlan;

      res.send("You have successfully logged in");
    })
    .catch((err) => {
      // handle error
    });
});


const sessionCheck = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

//Test accounts for each Fitness plan

db.query(`INSERT INTO users (name, email, password, fitness_plan) VALUES ('Bob', 'hello@gmail.com', '123', 'beginner')`, (err, result) => {
  if (err) throw err;
  console.log("Test beginner");
});


app.get("/", (req, res) => {
    res.send("Hello");
});


const getUserFitnessPlan = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT fitness_plan FROM users WHERE id = ?`;
    db.query(query, [userId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0].fitness_plan);
      }
    });
  });
};

// usage
getUserFitnessPlan(1).then((fitness) => {
    if (fitness === 'beginner') {
      // user has a beginner fitness plan
      res.sendFile(path.join('../front-end/public/info.html'))
    } else {
      // user does not have a beginner fitness plan
    }
  })
  .catch((err) => {
    // handle error
  });

  const auth = (fitnessPlan) => (req, res, next) => {
    const userFitnessPlan = req.user.fitness_plan;
    if (userFitnessPlan === fitnessPlan) {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
  };

app.use("/beginner", beginnerRoute);
app.use("/intermediate", intermediateRoute);
app.use("/pro", proRoute);


app.listen(port, () => {
    console.log(`Server is running on localhost ${port}`);
});



