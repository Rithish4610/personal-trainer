// Express routes for authentication, food logging, summary, feedback, and streaks
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('./models');
const db = require('./db');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret'; // Replace with env var in production

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Signup
router.post('/signup', async (req, res) => {
  const { username, password, weight, dob, goal } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const hash = await bcrypt.hash(password, 10);
  models.createUser(username, hash, weight || null, dob || null, goal || '', (err, userId) => {
    if (err) return res.status(400).json({ error: 'Username already exists' });
    res.json({ success: true });
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  models.getUserByUsername(username, async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ 
      token, 
      goal: user.goal,
      weight: user.weight,
      dob: user.dob,
      username: user.username
    });
  });
});

// Add food log entry
router.post('/entry', authenticateToken, (req, res) => {
  const { time, food, quantity } = req.body;
  const user_id = req.user.id;
  const date = new Date().toISOString().slice(0, 10);
  models.getFoodByName(food, (err, foodRow) => {
    if (err || !foodRow) return res.status(400).json({ error: 'Food not found' });
    models.addEntry(user_id, date, time, foodRow.id, quantity, (err) => {
      if (err) return res.status(500).json({ error: 'Failed to add entry' });
      res.json({ success: true });
    });
  });
});

// Get daily summary
router.get('/summary', authenticateToken, (req, res) => {
  const user_id = req.user.id;
  const date = new Date().toISOString().slice(0, 10);
  models.getEntriesByUserAndDate(user_id, date, (err, entries) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch entries' });
    // Join with food table to get nutrition
    if (!entries.length) return res.json({ protein: 0, carbs: 0, fiber: 0, fat: 0, entries: [] });
    const ids = entries.map(e => e.food_id);
    db.all('SELECT * FROM foods WHERE id IN (' + ids.map(() => '?').join(',') + ')', ids, (err, foods) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch foods' });
      let protein = 0, carbs = 0, fiber = 0, fat = 0;
      entries.forEach(entry => {
        const food = foods.find(f => f.id === entry.food_id);
        if (food) {
          protein += food.protein * entry.quantity;
          carbs += food.carbs * entry.quantity;
          fiber += food.fiber * entry.quantity;
          fat += (food.fat || 0) * entry.quantity;
        }
      });
      res.json({ protein, carbs, fiber, fat, entries });
    });
  });
});

// Get streaks
router.get('/streaks', authenticateToken, (req, res) => {
  const user_id = req.user.id;
  models.getStreaksByUser(user_id, (err, streaks) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch streaks' });
    res.json({ streaks });
  });
});

module.exports = router;
