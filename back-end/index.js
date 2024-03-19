//importing modules
const express = require ("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;
const session = require('express-session');
const db = require('./database');
const review_db = require("./database");

const app = express();

//creates table in database before running this code
(async (err) => {
  try {
    await new Promise((resolve, reject) => {
      const createUserTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(50),
          email VARCHAR(50) UNIQUE,
          password VARCHAR(50),
          fitness_plan VARCHAR(50)
        );
      `;

      const createFeedbackTable = `
        CREATE TABLE IF NOT EXISTS feedback (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(50),
          post_content TEXT,
          post_date TIMESTAMP
        );
      `;  


      db.run(createUserTable, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log("User table created...");
          resolve();
        }
      });

      db.run(createFeedbackTable, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log("Review table created...");
          resolve();
        }
      });
    });

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
    const fitnessPlanRoute = require('./routes/fitnessPlan');
    const homeRoute = require('./routes/home');
    const logOutRoute = require('./routes/log-out');
    const feedbackRoute = require('./routes/feedback');
    
    //receives front-end html web pages and uses them in local server
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());
    app.use(express.static('../front-end/public'));
    app.use(express.static('../front-end/js'));
    app.use(express.static('../front-end/images'));

    //POST method to database when successfully signing up

    app.post("/api/user/create", (req, res) => {
      const { name, email, password, fitness_plan } = req.body;
      
      console.log("Sign-up request data: ", req.body);

      const createUserQuery = `
        INSERT INTO users (name, email, password, fitness_plan)
        VALUES (?, ?, ?, ?)
      `;

      db.run(createUserQuery, [name, email, password, fitness_plan], (err, result) => {
        if (err) throw err;
        console.log("User added to the database:");
        res.send("You have successfully created an account");
      });
    });

    const getUserFitnessPlan = (userId) => {
      return new Promise((resolve, reject) => {
        const query = `SELECT fitness_plan FROM users WHERE id = ?`;
        db.get(query, [userId], (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          if (!result) {
            reject(new Error('Error user not found'));
            return;
          }
          resolve(result.fitness_plan);
        });
      });
    };

    //handles logins
    app.post("/api/user/login", (req, res) => {
      const { email, password } = req.body;

      const query = 'SELECT id, fitness_plan FROM users WHERE email = ? AND password = ?';
      db.all(query, [email, password], (err, result) => {
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
          
          //page displayed depending on user's fitness plan
          getUserFitnessPlan(userId)
            .then((fitnessPlan) => {
              if (fitnessPlan === 'beginner') {
                res.send("/beginner");
              } else if (fitnessPlan === 'intermediate') {
                res.send("/intermediate");
              } else if (fitnessPlan === 'pro') {
                res.send("/pro");
              }
            })
            .catch((err) => {
              console.error('Error fetching user fitness plan:', err);
              res.status(500).send("Internal Server Error");
            });
        } else {
          //handles error
          res.status(401).send("Invalid email or password");
        }
      });
    });

    //checks if session start or not.
    const sessionCheck = (req, res, next) => {
      if (!req.session.userId) {
        return res.status(401).send("Unauthorized");
      }
      next();
    };

    app.get("/profile", sessionCheck, (req, res) => {
      res.send("Welcome to your profile!");
    });

    //deletes cache so users cannot press left arrow on browser to go back to user page and are instead redirected to login page
    app.use((req, res, next) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      next();
    });
    
    app.use('/fitnessPlan', fitnessPlanRoute);

    app.use('/home', homeRoute);

    app.use('/log-out', logOutRoute);

    app.use('/feedback', feedbackRoute);


    app.listen(port, () => {
      console.log(`Server is running on localhost ${port}`);
    });
  } catch (err) {
    console.error('Error setting up the database:', err);
  }
})();


