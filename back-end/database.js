const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('database.sqlite', (err) => {
  if (err) {
    console.error('Error cannot connect to database:', err);
  } else {
    console.log('Connected to database');
  }  
});

module.exports = db;
