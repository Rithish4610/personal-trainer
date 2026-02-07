// Models for User, Food, Entry, Streak (using raw SQL via db.js)
const db = require('./db');

// User CRUD
const createUser = (username, password, weight, dob, goal, cb) => {
  db.run(
    'INSERT INTO users (username, password, weight, dob, goal) VALUES (?, ?, ?, ?, ?)',
    [username, password, weight, dob, goal],
    function (err) {
      cb(err, this ? this.lastID : null);
    }
  );
};

const getUserByUsername = (username, cb) => {
  db.get('SELECT * FROM users WHERE username = ?', [username], cb);
};

// Food CRUD
const addFood = (name, protein, carbs, fiber, fat, unit, cb) => {
  db.run(
    'INSERT INTO foods (name, protein, carbs, fiber, fat, unit) VALUES (?, ?, ?, ?, ?, ?)',
    [name, protein, carbs, fiber, fat, unit],
    cb
  );
};

const getFoodByName = (name, cb) => {
  db.get('SELECT * FROM foods WHERE name = ?', [name], cb);
};

const getAllFoods = (cb) => {
  db.all('SELECT * FROM foods', cb);
};

// Entry CRUD
const addEntry = (user_id, date, time, food_id, quantity, cb) => {
  db.run(
    'INSERT INTO entries (user_id, date, time, food_id, quantity) VALUES (?, ?, ?, ?, ?)',
    [user_id, date, time, food_id, quantity],
    cb
  );
};

const getEntriesByUserAndDate = (user_id, date, cb) => {
  db.all('SELECT * FROM entries WHERE user_id = ? AND date = ?', [user_id, date], cb);
};

// Streak CRUD
const setStreak = (user_id, date, present, cb) => {
  db.run(
    'INSERT OR REPLACE INTO streaks (user_id, date, present) VALUES (?, ?, ?)',
    [user_id, date, present],
    cb
  );
};

const getStreaksByUser = (user_id, cb) => {
  db.all('SELECT * FROM streaks WHERE user_id = ?', [user_id], cb);
};

module.exports = {
  createUser,
  getUserByUsername,
  addFood,
  getFoodByName,
  getAllFoods,
  addEntry,
  getEntriesByUserAndDate,
  setStreak,
  getStreaksByUser,
};
