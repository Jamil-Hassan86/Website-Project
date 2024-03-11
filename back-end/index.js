//importing modules
const express = require ("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;
const path = require('path');
const http = require('http');
const session = require('express-session');
const db = require('./database');

const app = express();

app.set('view engine', 'ejs');

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
const homeRoutes = require('./routes/home')
const logoutRoutes = require('./routes/log-out');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('../front-end/public'));
app.use(express.static('../front-end/js'));
app.use(express.static('../front-end/images'));

//creating database to store user records
const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT,
  name VARCHAR(50),
  email VARCHAR(50) UNIQUE,
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

app.post("/api/user/login", (req, res) => {
  const { email, password } = req.body;
  
  // Simulate user authentication (replace with your authentication logic)
  const query = 'SELECT id, fitness_plan FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).send("Internal Server Error");
    }
    if (result.length > 0) {
      const userId = result[0].id;
      const fitnessPlan = result[0].fitness_plan;

      

      // Store user information in the session
      req.session.userId = userId;
      req.session.fitnessPlan = fitnessPlan;
  
      getUserFitnessPlan(userId)
        .then((fitnessPlan) => {
          // If the user has a beginner fitness plan, send the info.html file
          if (fitnessPlan === 'beginner') {
            res.send("he");
          } else if (fitnessPlan === 'intermediate') {
            res.send("You have successfully logged in");
          } else if (fitnessPlan === 'pro') {
            res.send("Pro");
          }
        })
        .catch((err) => {
          console.error('Error fetching user fitness plan:', err);
          res.status(500).send("Internal Server Error");
        });
    } else {
      // If no user found with the provided credentials
      res.status(401).send("Invalid email or password");
    }
  });
});

const sessionCheck = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

//Test accounts for each Fitness plan

db.query(`INSERT IGNORE INTO users (name, email, password, fitness_plan) VALUES ('Bob', 'hello@gmail.com', '123', 'beginner')`, (err, result) => {
  if (err) throw err;
  console.log("Test beginner");
});


app.get("/", (req, res) => {
    res.send("Hello");
});

app.get("/profile", sessionCheck, (req, res) => {
  // This route will only be accessible if the user is authenticated
  res.send("Welcome to your profile!");
});

app.use("/beginner", beginnerRoute);
app.use("/intermediate", intermediateRoute);
app.use("/pro", proRoute);


app.use('/home', homeRoutes);
app.use('/log-out', logoutRoutes);



app.listen(port, () => {
    console.log(`Server is running on localhost ${port}`);
});



