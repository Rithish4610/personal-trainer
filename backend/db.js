// SQLite database setup
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// User table
// Entry table (food logs)
// Food table (nutrition info)
// Streak table (consistency)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    weight REAL,
    dob TEXT,
    goal TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS foods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    protein REAL,
    carbs REAL,
    fiber REAL,
    unit TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    time TEXT,
    food_id INTEGER,
    quantity REAL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(food_id) REFERENCES foods(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS streaks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    present INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

module.exports = db;
