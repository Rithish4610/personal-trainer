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
    fat REAL,
    unit TEXT
  )`);

  // Add fat column if it doesn't exist (for existing databases)
  db.run(`ALTER TABLE foods ADD COLUMN fat REAL`, (err) => {
    // Ignore error if column already exists
  });

  // Insert meat items with nutritional data (per 100g)
  const meatItems = [
    // Chicken
    ['Chicken Breast', 31, 0, 0, 3.6, '100g'],
    ['Chicken Thigh', 26, 0, 0, 10.9, '100g'],
    ['Chicken Wing', 30.5, 0, 0, 8.1, '100g'],
    ['Chicken Drumstick', 28.3, 0, 0, 5.7, '100g'],
    ['Chicken Liver', 24.4, 0.9, 0, 6.5, '100g'],
    ['Ground Chicken', 17.4, 0, 0, 9.3, '100g'],
    
    // Beef
    ['Beef Sirloin', 26, 0, 0, 15, '100g'],
    ['Beef Tenderloin', 26.5, 0, 0, 7.5, '100g'],
    ['Beef Ribeye', 24.8, 0, 0, 18.9, '100g'],
    ['Ground Beef (80/20)', 17.2, 0, 0, 20, '100g'],
    ['Ground Beef (90/10)', 20, 0, 0, 10, '100g'],
    ['Beef Brisket', 21.4, 0, 0, 17, '100g'],
    ['Beef Chuck Roast', 26.4, 0, 0, 15.4, '100g'],
    ['Beef Liver', 20.4, 3.9, 0, 3.6, '100g'],
    ['Beef Flank Steak', 27.4, 0, 0, 8.2, '100g'],
    ['Corned Beef', 18.2, 0.5, 0, 19, '100g'],
    
    // Pork
    ['Pork Chop', 26.7, 0, 0, 8.3, '100g'],
    ['Pork Tenderloin', 26, 0, 0, 3.5, '100g'],
    ['Pork Loin', 27.3, 0, 0, 8.6, '100g'],
    ['Pork Belly', 12.4, 0, 0, 53, '100g'],
    ['Ground Pork', 17.2, 0, 0, 20.8, '100g'],
    ['Pork Ribs', 20.3, 0, 0, 23.4, '100g'],
    ['Bacon', 13, 1.4, 0, 42, '100g'],
    ['Ham', 21, 1.5, 0, 5.5, '100g'],
    ['Pork Sausage', 13.3, 2.4, 0, 28.4, '100g'],
    
    // Lamb
    ['Lamb Chop', 25, 0, 0, 16.5, '100g'],
    ['Lamb Leg', 25.5, 0, 0, 8.8, '100g'],
    ['Lamb Shoulder', 24.5, 0, 0, 17.2, '100g'],
    ['Ground Lamb', 16.6, 0, 0, 23.4, '100g'],
    ['Lamb Shank', 26.4, 0, 0, 8.7, '100g'],
    ['Lamb Liver', 20.4, 2.5, 0, 5.2, '100g'],
    
    // Turkey
    ['Turkey Breast', 29.3, 0, 0, 1, '100g'],
    ['Turkey Thigh', 27.7, 0, 0, 7.1, '100g'],
    ['Ground Turkey', 19.3, 0, 0, 10.1, '100g'],
    ['Turkey Sausage', 17.5, 2.1, 0, 10.4, '100g'],
    ['Turkey Bacon', 29.6, 0.7, 0, 14.4, '100g'],
    
    // Duck
    ['Duck Breast', 23.5, 0, 0, 5.9, '100g'],
    ['Duck Leg', 26, 0, 0, 8.2, '100g'],
    ['Whole Duck', 19.3, 0, 0, 28.4, '100g'],
    ['Duck Liver', 16.4, 4.9, 0, 5.5, '100g'],
    
    // Goat
    ['Goat Meat', 27.1, 0, 0, 3.0, '100g'],
    
    // Venison (Deer)
    ['Venison', 30.2, 0, 0, 3.2, '100g'],
    ['Ground Venison', 26.5, 0, 0, 7, '100g'],
    
    // Rabbit
    ['Rabbit Meat', 29.1, 0, 0, 5.6, '100g'],
    
    // Bison
    ['Bison Steak', 28.4, 0, 0, 2.4, '100g'],
    ['Ground Bison', 20.2, 0, 0, 7.2, '100g'],
    
    // Fish & Seafood
    ['Salmon', 20.4, 0, 0, 13.4, '100g'],
    ['Tuna', 29.9, 0, 0, 1, '100g'],
    ['Tilapia', 26, 0, 0, 2.7, '100g'],
    ['Cod', 18, 0, 0, 0.8, '100g'],
    ['Sardines', 24.6, 0, 0, 11.5, '100g'],
    ['Mackerel', 18.6, 0, 0, 13.9, '100g'],
    ['Trout', 20.5, 0, 0, 6.6, '100g'],
    ['Catfish', 18.4, 0, 0, 2.8, '100g'],
    ['Sea Bass', 20.5, 0, 0, 2.6, '100g'],
    ['Halibut', 22.5, 0, 0, 2.3, '100g'],
    ['Shrimp', 24, 0.2, 0, 0.3, '100g'],
    ['Crab', 18.1, 0, 0, 1.1, '100g'],
    ['Lobster', 19, 0, 0, 0.9, '100g'],
    ['Scallops', 12.1, 3.2, 0, 0.5, '100g'],
    ['Mussels', 11.9, 3.7, 0, 2.2, '100g'],
    ['Oysters', 9, 4.9, 0, 2.5, '100g'],
    ['Clams', 14.7, 5.1, 0, 1, '100g'],
    ['Calamari (Squid)', 15.6, 3.1, 0, 1.4, '100g'],
    ['Octopus', 29.8, 4.4, 0, 2.1, '100g'],
    ['Anchovies', 28.9, 0, 0, 4.8, '100g'],
    
    // Processed Meats
    ['Pepperoni', 22.5, 2.9, 0, 44.2, '100g'],
    ['Salami', 22.6, 1.2, 0, 37.3, '100g'],
    ['Bologna', 10.4, 3.5, 0, 28.2, '100g'],
    ['Hot Dog', 10.6, 2.1, 0, 26.6, '100g'],
    ['Prosciutto', 24.1, 0.3, 0, 18.4, '100g'],
    ['Pastrami', 21.8, 2.7, 0, 5.8, '100g'],
    ['Beef Jerky', 33.2, 11, 1.8, 3.1, '100g'],
    ['Turkey Deli Meat', 17, 3.1, 0.8, 1.3, '100g'],
    ['Chicken Deli Meat', 18.5, 2.5, 0.5, 2.8, '100g']
  ];

  meatItems.forEach(item => {
    db.run(
      `INSERT OR IGNORE INTO foods (name, protein, carbs, fiber, fat, unit) VALUES (?, ?, ?, ?, ?, ?)`,
      item
    );
  });

  // Insert vegetables with nutritional data (per 100g)
  const vegetables = [
    // Leafy Greens
    ['Spinach', 2.9, 3.6, 2.2, 0.4, '100g'],
    ['Kale', 4.3, 8.8, 3.6, 0.9, '100g'],
    ['Lettuce (Romaine)', 1.2, 3.3, 2.1, 0.3, '100g'],
    ['Lettuce (Iceberg)', 0.9, 3.0, 1.2, 0.1, '100g'],
    ['Arugula', 2.6, 3.7, 1.6, 0.7, '100g'],
    ['Swiss Chard', 1.8, 3.7, 1.6, 0.2, '100g'],
    ['Collard Greens', 3.0, 5.4, 4.0, 0.6, '100g'],
    ['Mustard Greens', 2.9, 4.7, 3.2, 0.4, '100g'],
    ['Bok Choy', 1.5, 2.2, 1.0, 0.2, '100g'],
    ['Cabbage (Green)', 1.3, 5.8, 2.5, 0.1, '100g'],
    ['Cabbage (Red)', 1.4, 7.4, 2.1, 0.2, '100g'],
    ['Brussels Sprouts', 3.4, 9.0, 3.8, 0.3, '100g'],
    ['Watercress', 2.3, 1.3, 0.5, 0.1, '100g'],
    
    // Root Vegetables
    ['Carrot', 0.9, 9.6, 2.8, 0.2, '100g'],
    ['Potato', 2.0, 17.5, 2.2, 0.1, '100g'],
    ['Sweet Potato', 1.6, 20.1, 3.0, 0.1, '100g'],
    ['Beetroot', 1.6, 9.6, 2.8, 0.2, '100g'],
    ['Turnip', 0.9, 6.4, 1.8, 0.1, '100g'],
    ['Radish', 0.7, 3.4, 1.6, 0.1, '100g'],
    ['Parsnip', 1.2, 18.0, 4.9, 0.3, '100g'],
    ['Rutabaga', 1.1, 8.6, 2.3, 0.2, '100g'],
    ['Ginger', 1.8, 17.8, 2.0, 0.8, '100g'],
    ['Turmeric', 7.8, 64.9, 21.0, 9.9, '100g'],
    ['Yam', 1.5, 27.9, 4.1, 0.2, '100g'],
    ['Taro Root', 1.5, 26.5, 4.1, 0.2, '100g'],
    
    // Cruciferous Vegetables
    ['Broccoli', 2.8, 7.0, 2.6, 0.4, '100g'],
    ['Cauliflower', 1.9, 5.0, 2.0, 0.3, '100g'],
    ['Kohlrabi', 1.7, 6.2, 3.6, 0.1, '100g'],
    
    // Alliums
    ['Onion', 1.1, 9.3, 1.7, 0.1, '100g'],
    ['Garlic', 6.4, 33.1, 2.1, 0.5, '100g'],
    ['Leek', 1.5, 14.2, 1.8, 0.3, '100g'],
    ['Shallot', 2.5, 16.8, 3.2, 0.1, '100g'],
    ['Scallion (Green Onion)', 1.8, 7.3, 2.6, 0.2, '100g'],
    ['Chives', 3.3, 4.4, 2.5, 0.7, '100g'],
    
    // Squash & Gourds
    ['Zucchini', 1.2, 3.1, 1.0, 0.3, '100g'],
    ['Yellow Squash', 1.2, 3.4, 1.1, 0.2, '100g'],
    ['Butternut Squash', 1.0, 11.7, 2.0, 0.1, '100g'],
    ['Acorn Squash', 0.8, 10.4, 1.5, 0.1, '100g'],
    ['Spaghetti Squash', 0.6, 6.5, 1.4, 0.6, '100g'],
    ['Pumpkin', 1.0, 6.5, 0.5, 0.1, '100g'],
    ['Cucumber', 0.7, 3.6, 0.5, 0.1, '100g'],
    ['Bitter Melon', 1.0, 3.7, 2.8, 0.2, '100g'],
    ['Bottle Gourd', 0.6, 3.4, 0.5, 0.02, '100g'],
    
    // Nightshades
    ['Tomato', 0.9, 3.9, 1.2, 0.2, '100g'],
    ['Cherry Tomatoes', 0.9, 3.9, 1.2, 0.1, '100g'],
    ['Bell Pepper (Red)', 1.0, 6.0, 2.1, 0.3, '100g'],
    ['Bell Pepper (Green)', 0.9, 4.6, 1.7, 0.2, '100g'],
    ['Bell Pepper (Yellow)', 1.0, 6.3, 0.9, 0.2, '100g'],
    ['Jalapeno', 0.9, 6.5, 2.8, 0.4, '100g'],
    ['Serrano Pepper', 1.7, 6.7, 3.7, 0.4, '100g'],
    ['Habanero Pepper', 1.9, 8.8, 1.5, 0.4, '100g'],
    ['Eggplant', 1.0, 6.0, 3.0, 0.2, '100g'],
    
    // Beans & Legumes (Fresh)
    ['Green Beans', 1.8, 7.0, 2.7, 0.1, '100g'],
    ['Snow Peas', 2.8, 7.5, 2.6, 0.2, '100g'],
    ['Snap Peas', 2.8, 7.6, 2.6, 0.2, '100g'],
    ['Edamame', 11.9, 8.6, 5.2, 5.2, '100g'],
    ['Lima Beans', 7.8, 20.9, 7.0, 0.4, '100g'],
    ['Fava Beans', 7.6, 17.6, 5.4, 0.4, '100g'],
    
    // Other Vegetables
    ['Asparagus', 2.2, 3.9, 2.1, 0.1, '100g'],
    ['Celery', 0.7, 3.0, 1.6, 0.2, '100g'],
    ['Artichoke', 3.3, 10.5, 5.4, 0.2, '100g'],
    ['Fennel', 1.2, 7.3, 3.1, 0.2, '100g'],
    ['Okra', 1.9, 7.5, 3.2, 0.2, '100g'],
    ['Corn', 3.3, 19.0, 2.7, 1.5, '100g'],
    ['Mushrooms (White)', 3.1, 3.3, 1.0, 0.3, '100g'],
    ['Mushrooms (Portobello)', 2.1, 3.9, 1.3, 0.4, '100g'],
    ['Mushrooms (Shiitake)', 2.2, 6.8, 2.5, 0.5, '100g'],
    ['Mushrooms (Cremini)', 2.5, 4.3, 0.6, 0.1, '100g'],
    ['Bamboo Shoots', 2.6, 5.2, 2.2, 0.3, '100g'],
    ['Bean Sprouts', 3.0, 5.9, 1.8, 0.2, '100g'],
    ['Water Chestnuts', 1.4, 23.9, 3.0, 0.1, '100g'],
    ['Jicama', 0.7, 8.8, 4.9, 0.1, '100g'],
    ['Rhubarb', 0.9, 4.5, 1.8, 0.2, '100g'],
    ['Seaweed (Nori)', 5.8, 5.1, 0.3, 0.3, '100g'],
    ['Seaweed (Kelp)', 1.7, 9.6, 1.3, 0.6, '100g'],
    ['Hearts of Palm', 2.5, 4.0, 2.4, 0.2, '100g'],
    ['Cactus (Nopales)', 1.3, 3.3, 2.2, 0.1, '100g']
  ];

  vegetables.forEach(item => {
    db.run(
      `INSERT OR IGNORE INTO foods (name, protein, carbs, fiber, fat, unit) VALUES (?, ?, ?, ?, ?, ?)`,
      item
    );
  });

  // Insert fruits with nutritional data (per 100g)
  const fruits = [
    // Berries
    ['Strawberry', 0.7, 7.7, 2.0, 0.3, '100g'],
    ['Blueberry', 0.7, 14.5, 2.4, 0.3, '100g'],
    ['Raspberry', 1.2, 11.9, 6.5, 0.7, '100g'],
    ['Blackberry', 1.4, 9.6, 5.3, 0.5, '100g'],
    ['Cranberry', 0.4, 12.2, 4.6, 0.1, '100g'],
    ['Goji Berry', 14.3, 77.1, 13.0, 0.4, '100g'],
    ['Acai Berry', 1.5, 4.7, 2.0, 5.3, '100g'],
    ['Mulberry', 1.4, 9.8, 1.7, 0.4, '100g'],
    ['Elderberry', 0.7, 18.4, 7.0, 0.5, '100g'],
    ['Gooseberry', 0.9, 10.2, 4.3, 0.6, '100g'],
    
    // Citrus Fruits
    ['Orange', 0.9, 11.8, 2.4, 0.1, '100g'],
    ['Lemon', 1.1, 9.3, 2.8, 0.3, '100g'],
    ['Lime', 0.7, 10.5, 2.8, 0.2, '100g'],
    ['Grapefruit', 0.8, 10.7, 1.6, 0.1, '100g'],
    ['Tangerine', 0.8, 13.3, 1.8, 0.3, '100g'],
    ['Mandarin', 0.8, 13.3, 1.8, 0.3, '100g'],
    ['Clementine', 0.9, 12.0, 1.7, 0.2, '100g'],
    ['Pomelo', 0.8, 9.6, 1.0, 0.04, '100g'],
    ['Blood Orange', 0.9, 12.0, 2.4, 0.1, '100g'],
    ['Kumquat', 1.9, 15.9, 6.5, 0.9, '100g'],
    
    // Tropical Fruits
    ['Banana', 1.1, 22.8, 2.6, 0.3, '100g'],
    ['Mango', 0.8, 15.0, 1.6, 0.4, '100g'],
    ['Pineapple', 0.5, 13.1, 1.4, 0.1, '100g'],
    ['Papaya', 0.5, 10.8, 1.7, 0.3, '100g'],
    ['Coconut (Fresh)', 3.3, 15.2, 9.0, 33.5, '100g'],
    ['Guava', 2.6, 14.3, 5.4, 1.0, '100g'],
    ['Passion Fruit', 2.2, 23.4, 10.4, 0.7, '100g'],
    ['Dragonfruit', 1.2, 11.0, 3.0, 0.4, '100g'],
    ['Lychee', 0.8, 16.5, 1.3, 0.4, '100g'],
    ['Longan', 1.3, 15.1, 1.1, 0.1, '100g'],
    ['Rambutan', 0.7, 20.9, 0.9, 0.2, '100g'],
    ['Mangosteen', 0.4, 17.9, 1.8, 0.6, '100g'],
    ['Jackfruit', 1.7, 23.2, 1.5, 0.6, '100g'],
    ['Durian', 1.5, 27.1, 3.8, 5.3, '100g'],
    ['Starfruit', 1.0, 6.7, 2.8, 0.3, '100g'],
    ['Kiwi', 1.1, 14.7, 3.0, 0.5, '100g'],
    ['Plantain', 1.3, 31.9, 2.3, 0.4, '100g'],
    ['Tamarind', 2.8, 62.5, 5.1, 0.6, '100g'],
    ['Soursop', 1.0, 16.8, 3.3, 0.3, '100g'],
    ['Breadfruit', 1.1, 27.1, 4.9, 0.2, '100g'],
    
    // Stone Fruits
    ['Peach', 0.9, 9.5, 1.5, 0.3, '100g'],
    ['Nectarine', 1.1, 10.6, 1.7, 0.3, '100g'],
    ['Plum', 0.7, 11.4, 1.4, 0.3, '100g'],
    ['Apricot', 1.4, 11.1, 2.0, 0.4, '100g'],
    ['Cherry', 1.1, 16.0, 2.1, 0.2, '100g'],
    ['Mango (Alphonso)', 0.8, 15.0, 1.6, 0.4, '100g'],
    ['Date (Fresh)', 2.5, 75.0, 6.7, 0.2, '100g'],
    ['Olive (Green)', 1.0, 3.8, 3.3, 15.3, '100g'],
    ['Olive (Black)', 0.8, 6.3, 3.2, 10.7, '100g'],
    
    // Pome Fruits
    ['Apple', 0.3, 13.8, 2.4, 0.2, '100g'],
    ['Pear', 0.4, 15.2, 3.1, 0.1, '100g'],
    ['Quince', 0.4, 15.3, 1.9, 0.1, '100g'],
    
    // Melons
    ['Watermelon', 0.6, 7.6, 0.4, 0.2, '100g'],
    ['Cantaloupe', 0.8, 8.2, 0.9, 0.2, '100g'],
    ['Honeydew', 0.5, 9.1, 0.8, 0.1, '100g'],
    ['Galia Melon', 0.5, 8.0, 0.8, 0.1, '100g'],
    
    // Grapes
    ['Grapes (Red)', 0.7, 17.2, 0.9, 0.2, '100g'],
    ['Grapes (Green)', 0.6, 17.2, 0.9, 0.2, '100g'],
    ['Raisins', 3.1, 79.2, 3.7, 0.5, '100g'],
    
    // Other Fruits
    ['Pomegranate', 1.7, 18.7, 4.0, 1.2, '100g'],
    ['Fig (Fresh)', 0.8, 19.2, 2.9, 0.3, '100g'],
    ['Persimmon', 0.6, 18.6, 3.6, 0.2, '100g'],
    ['Avocado', 2.0, 8.5, 6.7, 14.7, '100g'],
    ['Tomato (as Fruit)', 0.9, 3.9, 1.2, 0.2, '100g'],
    
    // Dried Fruits
    ['Dried Apricot', 3.4, 62.6, 7.3, 0.5, '100g'],
    ['Dried Fig', 3.3, 63.9, 9.8, 0.9, '100g'],
    ['Dried Mango', 1.5, 78.6, 2.4, 0.8, '100g'],
    ['Dried Cranberry', 0.1, 82.4, 5.7, 1.4, '100g'],
    ['Prune', 2.2, 63.9, 7.1, 0.4, '100g'],
    ['Dried Apple', 1.3, 57.2, 8.7, 0.3, '100g'],
    ['Dried Banana', 3.9, 88.3, 9.9, 1.8, '100g'],
    ['Dried Pineapple', 0.5, 90.0, 2.0, 0.2, '100g'],
    ['Dried Papaya', 1.0, 90.0, 5.5, 0.2, '100g'],
    ['Medjool Dates', 1.8, 75.0, 6.7, 0.2, '100g']
  ];

  fruits.forEach(item => {
    db.run(
      `INSERT OR IGNORE INTO foods (name, protein, carbs, fiber, fat, unit) VALUES (?, ?, ?, ?, ?, ?)`,
      item
    );
  });

  // Insert beans & legumes with nutritional data (per 100g cooked unless noted)
  const beans = [
    // Common Beans
    ['Black Beans', 8.9, 23.7, 8.7, 0.5, '100g'],
    ['Kidney Beans', 8.7, 22.8, 6.4, 0.5, '100g'],
    ['Pinto Beans', 9.0, 26.2, 9.0, 0.7, '100g'],
    ['Navy Beans', 8.2, 26.1, 10.5, 0.6, '100g'],
    ['Cannellini Beans', 9.7, 24.9, 6.3, 0.6, '100g'],
    ['Great Northern Beans', 8.3, 21.1, 7.0, 0.5, '100g'],
    ['Black-Eyed Peas', 7.7, 20.8, 6.5, 0.5, '100g'],
    ['Chickpeas (Garbanzo)', 8.9, 27.4, 7.6, 2.6, '100g'],
    ['Lentils (Green)', 9.0, 20.1, 7.9, 0.4, '100g'],
    ['Lentils (Red)', 9.0, 20.0, 5.5, 0.4, '100g'],
    ['Lentils (Brown)', 9.0, 20.1, 7.9, 0.4, '100g'],
    ['Lentils (Black)', 9.0, 20.0, 8.0, 0.5, '100g'],
    ['Split Peas (Green)', 8.3, 21.1, 8.3, 0.4, '100g'],
    ['Split Peas (Yellow)', 8.3, 21.1, 8.3, 0.4, '100g'],
    ['Mung Beans', 7.0, 19.2, 7.6, 0.4, '100g'],
    ['Adzuki Beans', 7.5, 24.8, 7.3, 0.1, '100g'],
    ['Soybeans (Cooked)', 16.6, 9.9, 6.0, 9.0, '100g'],
    ['Butter Beans', 7.4, 20.4, 7.2, 0.4, '100g'],
    ['Cranberry Beans', 9.0, 25.0, 9.0, 0.5, '100g'],
    ['Pigeon Peas', 6.8, 23.3, 6.7, 0.4, '100g'],
    ['Lupini Beans', 15.6, 9.9, 2.8, 2.9, '100g'],
    ['Broad Beans (Cooked)', 7.6, 17.6, 5.4, 0.4, '100g'],
    
    // Bean Products
    ['Tofu (Firm)', 15.8, 2.3, 0.9, 8.7, '100g'],
    ['Tofu (Silken)', 5.3, 2.2, 0.2, 2.7, '100g'],
    ['Tempeh', 20.3, 7.6, 0, 10.8, '100g'],
    ['Hummus', 7.9, 14.3, 6.0, 9.6, '100g'],
    ['Refried Beans', 5.4, 15.4, 5.3, 2.5, '100g'],
    ['Baked Beans', 5.5, 21.1, 5.5, 0.5, '100g'],
    ['Bean Curd', 8.1, 1.9, 0.4, 4.8, '100g'],
    ['Miso', 12.8, 26.5, 5.4, 6.0, '100g'],
    ['Natto', 18.0, 14.4, 5.4, 11.0, '100g'],
    
    // Peanuts & Legume Nuts
    ['Peanuts (Raw)', 25.8, 16.1, 8.5, 49.2, '100g'],
    ['Peanut Butter', 25.1, 20.0, 6.0, 50.4, '100g'],
    ['Peanuts (Roasted)', 26.2, 21.5, 8.0, 49.7, '100g']
  ];

  beans.forEach(item => {
    db.run(
      `INSERT OR IGNORE INTO foods (name, protein, carbs, fiber, fat, unit) VALUES (?, ?, ?, ?, ?, ?)`,
      item
    );
  });

  // Insert grains with nutritional data (per 100g cooked unless noted)
  const grains = [
    // Rice
    ['White Rice', 2.7, 28.2, 0.4, 0.3, '100g'],
    ['Brown Rice', 2.6, 23.0, 1.8, 0.9, '100g'],
    ['Basmati Rice', 3.5, 25.2, 0.4, 0.4, '100g'],
    ['Jasmine Rice', 2.7, 28.0, 0.4, 0.3, '100g'],
    ['Wild Rice', 4.0, 21.3, 1.8, 0.3, '100g'],
    ['Black Rice', 3.5, 23.0, 1.4, 1.0, '100g'],
    ['Red Rice', 2.8, 23.5, 1.8, 0.8, '100g'],
    ['Arborio Rice', 2.4, 24.0, 0.6, 0.2, '100g'],
    ['Sticky Rice', 2.0, 21.0, 0.3, 0.2, '100g'],
    ['Parboiled Rice', 2.9, 25.1, 0.5, 0.3, '100g'],
    
    // Wheat & Wheat Products
    ['Whole Wheat Flour', 13.2, 71.2, 10.7, 2.5, '100g'],
    ['All-Purpose Flour', 10.3, 76.3, 2.7, 1.0, '100g'],
    ['Bread (White)', 9.0, 49.0, 2.7, 3.2, '100g'],
    ['Bread (Whole Wheat)', 13.0, 41.3, 7.0, 3.4, '100g'],
    ['Wheat Berries', 9.6, 42.5, 6.8, 1.0, '100g'],
    ['Bulgur Wheat', 3.1, 18.6, 4.5, 0.2, '100g'],
    ['Couscous', 3.8, 23.2, 1.4, 0.2, '100g'],
    ['Semolina', 12.7, 72.8, 3.9, 1.1, '100g'],
    ['Wheat Bran', 15.6, 64.5, 42.8, 4.3, '100g'],
    ['Wheat Germ', 23.2, 51.8, 13.2, 9.7, '100g'],
    ['Pasta (White)', 5.8, 30.9, 1.8, 0.9, '100g'],
    ['Pasta (Whole Wheat)', 5.3, 26.5, 4.5, 0.5, '100g'],
    ['Egg Noodles', 4.5, 25.0, 1.2, 1.6, '100g'],
    ['Ramen Noodles', 4.5, 26.0, 1.0, 1.0, '100g'],
    ['Spaghetti', 5.8, 30.9, 1.8, 0.9, '100g'],
    ['Fettuccine', 5.8, 30.9, 1.8, 0.9, '100g'],
    ['Penne', 5.8, 30.9, 1.8, 0.9, '100g'],
    ['Macaroni', 5.8, 30.9, 1.8, 0.9, '100g'],
    ['Orzo', 5.8, 30.9, 1.8, 0.9, '100g'],
    
    // Oats
    ['Oatmeal (Cooked)', 2.5, 12.0, 1.7, 1.5, '100g'],
    ['Rolled Oats (Dry)', 13.2, 67.7, 10.1, 6.5, '100g'],
    ['Steel Cut Oats', 13.0, 66.0, 10.0, 6.0, '100g'],
    ['Instant Oatmeal', 11.8, 68.2, 9.4, 6.3, '100g'],
    ['Oat Bran', 17.3, 66.2, 15.4, 7.0, '100g'],
    ['Oat Flour', 14.7, 65.7, 6.5, 9.1, '100g'],
    
    // Corn Products
    ['Cornmeal', 8.1, 79.5, 7.3, 3.6, '100g'],
    ['Polenta (Cooked)', 2.1, 13.0, 1.0, 0.3, '100g'],
    ['Grits (Cooked)', 1.4, 13.5, 0.6, 0.2, '100g'],
    ['Corn Tortilla', 5.7, 44.6, 6.3, 2.9, '100g'],
    ['Cornstarch', 0.3, 91.3, 0.9, 0.1, '100g'],
    ['Popcorn (Air Popped)', 12.9, 77.8, 14.5, 4.5, '100g'],
    
    // Ancient Grains
    ['Quinoa', 4.4, 21.3, 2.8, 1.9, '100g'],
    ['Amaranth', 3.8, 19.0, 2.1, 1.6, '100g'],
    ['Buckwheat', 3.4, 19.9, 2.7, 0.6, '100g'],
    ['Millet', 3.5, 23.7, 1.3, 1.0, '100g'],
    ['Teff', 3.9, 19.9, 2.8, 0.7, '100g'],
    ['Sorghum', 3.5, 23.0, 1.6, 1.1, '100g'],
    ['Farro', 6.0, 27.0, 3.0, 1.0, '100g'],
    ['Spelt', 5.5, 26.4, 3.9, 0.9, '100g'],
    ['Kamut', 6.5, 27.6, 3.7, 1.0, '100g'],
    ['Freekeh', 5.3, 24.0, 8.0, 1.2, '100g'],
    ['Einkorn Wheat', 7.0, 28.0, 4.0, 1.5, '100g'],
    
    // Barley & Rye
    ['Barley (Pearled)', 2.3, 28.2, 3.8, 0.4, '100g'],
    ['Barley (Hulled)', 2.3, 28.2, 6.5, 0.4, '100g'],
    ['Rye Berries', 3.0, 28.0, 5.8, 0.8, '100g'],
    ['Rye Flour', 10.9, 75.9, 15.1, 1.5, '100g'],
    ['Rye Bread', 8.5, 48.3, 5.8, 3.3, '100g'],
    
    // Breakfast Cereals
    ['Granola', 9.4, 64.4, 5.3, 14.9, '100g'],
    ['Corn Flakes', 7.5, 84.1, 3.3, 0.4, '100g'],
    ['Bran Flakes', 10.2, 75.4, 18.3, 2.0, '100g'],
    ['Shredded Wheat', 10.6, 79.9, 12.5, 1.6, '100g'],
    ['Muesli', 10.4, 66.3, 7.8, 6.5, '100g'],
    ['Puffed Rice', 6.3, 89.8, 1.2, 0.5, '100g'],
    ['Rice Krispies', 6.6, 87.0, 1.0, 1.0, '100g'],
    ['Cheerios', 11.3, 74.3, 10.1, 6.0, '100g'],
    
    // Other Grain Products
    ['Bread Crumbs', 13.4, 72.0, 4.5, 5.3, '100g'],
    ['Crackers (Whole Wheat)', 9.5, 67.2, 10.9, 14.1, '100g'],
    ['Crackers (Saltine)', 9.3, 74.0, 2.9, 8.6, '100g'],
    ['Bagel', 10.0, 53.0, 2.3, 1.6, '100g'],
    ['English Muffin', 8.7, 46.0, 2.8, 2.0, '100g'],
    ['Pita Bread', 9.1, 55.7, 2.2, 1.2, '100g'],
    ['Naan Bread', 9.1, 50.1, 2.1, 3.4, '100g'],
    ['Tortilla (Flour)', 8.3, 49.9, 3.3, 6.8, '100g'],
    ['Croissant', 8.2, 45.8, 2.6, 21.0, '100g'],
    ['Baguette', 9.0, 54.0, 2.4, 1.0, '100g'],
    ['Ciabatta', 9.5, 50.0, 2.5, 3.5, '100g'],
    ['Focaccia', 8.0, 47.0, 2.0, 9.0, '100g'],
    ['Rice Cakes', 7.9, 81.1, 4.2, 2.8, '100g'],
    ['Rice Paper', 0.8, 86.0, 0.6, 0.1, '100g'],
    
    // Gluten-Free Grains
    ['Rice Flour', 6.0, 80.1, 2.4, 1.4, '100g'],
    ['Tapioca', 0.2, 88.7, 0.9, 0.02, '100g'],
    ['Arrowroot', 0.3, 88.2, 3.4, 0.1, '100g'],
    ['Sago', 0.2, 94.0, 0.4, 0.02, '100g'],
    ['Buckwheat Flour', 12.6, 70.6, 10.0, 3.1, '100g'],
    ['Almond Flour', 21.0, 21.4, 10.5, 49.4, '100g'],
    ['Coconut Flour', 19.3, 60.0, 39.0, 8.8, '100g'],
    ['Chickpea Flour', 22.4, 57.8, 10.8, 6.7, '100g']
  ];

  grains.forEach(item => {
    db.run(
      `INSERT OR IGNORE INTO foods (name, protein, carbs, fiber, fat, unit) VALUES (?, ?, ?, ?, ?, ?)`,
      item
    );
  });

  // Insert nuts and seeds with nutritional data (per 100g)
  const nuts = [
    // Tree Nuts
    ['Almonds', 21.2, 21.7, 12.5, 49.9, '100g'],
    ['Almonds (Blanched)', 21.4, 18.7, 9.9, 52.5, '100g'],
    ['Almonds (Roasted)', 21.0, 21.0, 12.0, 52.5, '100g'],
    ['Almonds (Sliced)', 21.2, 21.7, 12.5, 49.9, '100g'],
    ['Almonds (Slivered)', 21.2, 21.7, 12.5, 49.9, '100g'],
    ['Almond Butter', 21.0, 18.8, 10.3, 55.5, '100g'],
    
    ['Walnuts', 15.2, 13.7, 6.7, 65.2, '100g'],
    ['Walnuts (Black)', 24.1, 9.9, 6.8, 59.0, '100g'],
    ['Walnut Butter', 15.0, 14.0, 6.0, 64.0, '100g'],
    
    ['Cashews', 18.2, 30.2, 3.3, 43.9, '100g'],
    ['Cashews (Roasted)', 15.3, 32.7, 3.0, 46.4, '100g'],
    ['Cashew Butter', 17.6, 27.6, 2.0, 49.4, '100g'],
    
    ['Pecans', 9.2, 13.9, 9.6, 72.0, '100g'],
    ['Pecans (Roasted)', 9.5, 14.3, 9.4, 74.3, '100g'],
    ['Pecan Butter', 9.0, 14.0, 9.5, 71.0, '100g'],
    
    ['Pistachios', 20.2, 27.2, 10.6, 45.3, '100g'],
    ['Pistachios (Roasted)', 20.6, 28.0, 10.3, 45.8, '100g'],
    ['Pistachio Butter', 20.0, 27.0, 10.0, 45.0, '100g'],
    
    ['Hazelnuts', 15.0, 16.7, 9.7, 60.8, '100g'],
    ['Hazelnuts (Roasted)', 15.3, 17.6, 9.4, 62.4, '100g'],
    ['Hazelnut Butter', 15.0, 17.0, 9.0, 61.0, '100g'],
    
    ['Macadamia Nuts', 7.9, 13.8, 8.6, 75.8, '100g'],
    ['Macadamia Nuts (Roasted)', 7.8, 13.4, 8.0, 76.1, '100g'],
    ['Macadamia Butter', 8.0, 14.0, 8.5, 75.0, '100g'],
    
    ['Brazil Nuts', 14.3, 12.3, 7.5, 66.4, '100g'],
    
    ['Pine Nuts', 13.7, 13.1, 3.7, 68.4, '100g'],
    ['Pine Nuts (Roasted)', 14.0, 13.5, 3.5, 69.0, '100g'],
    
    ['Chestnuts', 2.4, 44.2, 5.1, 2.3, '100g'],
    ['Chestnuts (Roasted)', 3.2, 49.1, 5.1, 2.2, '100g'],
    
    ['Horse Chestnuts', 6.0, 41.0, 6.8, 1.6, '100g'],
    
    ['Marcona Almonds', 22.0, 16.0, 11.0, 55.0, '100g'],
    
    // Coconut Products
    ['Coconut (Shredded)', 5.6, 23.7, 16.3, 64.5, '100g'],
    ['Coconut (Dried)', 6.9, 23.7, 16.3, 64.5, '100g'],
    ['Coconut (Desiccated)', 6.9, 23.7, 16.3, 64.5, '100g'],
    ['Coconut Cream', 2.2, 6.6, 2.2, 19.0, '100g'],
    ['Coconut Milk', 2.3, 5.5, 2.2, 23.8, '100g'],
    ['Coconut Oil', 0, 0, 0, 100, '100g'],
    ['Coconut Butter', 6.1, 21.5, 12.1, 62.3, '100g'],
    
    // Seeds
    ['Sunflower Seeds', 20.8, 20.0, 8.6, 51.5, '100g'],
    ['Sunflower Seeds (Roasted)', 19.3, 24.1, 11.1, 49.8, '100g'],
    ['Sunflower Seed Butter', 17.3, 18.8, 5.5, 54.0, '100g'],
    
    ['Pumpkin Seeds', 30.2, 10.7, 6.0, 49.1, '100g'],
    ['Pumpkin Seeds (Roasted)', 29.8, 14.7, 6.5, 49.0, '100g'],
    
    ['Chia Seeds', 16.5, 42.1, 34.4, 30.7, '100g'],
    
    ['Flax Seeds', 18.3, 28.9, 27.3, 42.2, '100g'],
    ['Flax Seeds (Ground)', 18.3, 28.9, 27.3, 42.2, '100g'],
    
    ['Hemp Seeds', 31.6, 8.7, 4.0, 48.8, '100g'],
    ['Hemp Hearts', 31.6, 8.7, 4.0, 48.8, '100g'],
    
    ['Sesame Seeds', 17.7, 23.5, 11.8, 49.7, '100g'],
    ['Sesame Seeds (Black)', 18.0, 23.0, 12.0, 50.0, '100g'],
    ['Tahini', 17.0, 21.2, 9.3, 53.8, '100g'],
    
    ['Poppy Seeds', 17.9, 28.1, 19.5, 41.6, '100g'],
    
    ['Caraway Seeds', 19.8, 49.9, 38.0, 14.6, '100g'],
    
    ['Fennel Seeds', 15.8, 52.3, 39.8, 14.9, '100g'],
    
    ['Cumin Seeds', 17.8, 44.2, 10.5, 22.3, '100g'],
    
    ['Coriander Seeds', 12.4, 55.0, 41.9, 17.8, '100g'],
    
    ['Mustard Seeds', 26.1, 28.1, 12.2, 36.2, '100g'],
    
    ['Fenugreek Seeds', 23.0, 58.4, 24.6, 6.4, '100g'],
    
    ['Sacha Inchi Seeds', 27.0, 35.0, 11.0, 35.0, '100g'],
    
    ['Watermelon Seeds', 28.3, 15.3, 0.9, 47.4, '100g'],
    
    ['Lotus Seeds', 15.4, 64.5, 14.5, 1.9, '100g'],
    
    // Mixed & Specialty
    ['Mixed Nuts', 17.0, 21.0, 7.0, 56.0, '100g'],
    ['Mixed Nuts (Roasted)', 17.5, 22.0, 7.5, 57.0, '100g'],
    ['Trail Mix', 12.8, 44.8, 4.6, 29.0, '100g'],
    ['Trail Mix (Tropical)', 10.0, 52.5, 4.0, 23.5, '100g'],
    
    ['Tiger Nuts', 4.5, 43.3, 33.0, 25.0, '100g'],
    
    ['Acorn Nuts', 6.2, 40.8, 9.1, 24.0, '100g'],
    
    ['Baru Nuts', 23.9, 15.8, 13.4, 38.2, '100g'],
    
    ['Candle Nuts', 19.0, 8.0, 3.5, 79.0, '100g'],
    
    ['Kola Nuts', 7.0, 45.0, 4.0, 0.3, '100g'],
    
    ['Betel Nuts', 4.9, 47.2, 10.0, 4.4, '100g'],
    
    ['Ginkgo Nuts', 4.3, 37.6, 1.0, 1.7, '100g'],
    
    ['Paradise Nuts', 14.0, 8.0, 5.0, 67.0, '100g'],
    
    ['Mongongo Nuts', 27.0, 24.0, 5.0, 57.0, '100g'],
    
    ['Pili Nuts', 10.8, 4.0, 1.0, 79.6, '100g'],
    
    ['Hickory Nuts', 12.7, 18.3, 6.4, 64.4, '100g'],
    
    ['Butternuts', 24.9, 12.1, 4.7, 57.0, '100g'],
    
    ['Beechnuts', 6.2, 33.5, 5.0, 50.0, '100g'],
    
    ['Shea Nuts', 8.0, 42.0, 5.0, 45.0, '100g'],
    
    // Nut-Based Products
    ['Almond Milk', 0.4, 0.3, 0.2, 1.1, '100g'],
    ['Cashew Milk', 0.4, 1.0, 0, 1.0, '100g'],
    ['Hazelnut Milk', 0.4, 3.2, 0.1, 1.6, '100g'],
    ['Walnut Milk', 0.4, 1.0, 0.1, 1.5, '100g'],
    ['Macadamia Milk', 0.2, 0.5, 0, 3.0, '100g'],
    
    ['Nut Brittle', 6.0, 72.0, 2.0, 18.0, '100g'],
    ['Praline', 5.0, 59.0, 2.5, 24.0, '100g'],
    ['Marzipan', 6.0, 49.0, 4.0, 27.0, '100g'],
    ['Nougat', 4.0, 75.0, 1.5, 9.0, '100g']
  ];

  nuts.forEach(item => {
    db.run(
      `INSERT OR IGNORE INTO foods (name, protein, carbs, fiber, fat, unit) VALUES (?, ?, ?, ?, ?, ?)`,
      item
    );
  });

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
