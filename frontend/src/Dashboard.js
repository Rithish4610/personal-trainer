

import React, { useState } from 'react';
import FoodResultsDashboard from './FoodResultsDashboard';

function Dashboard({ goal }) {
  const [morningFoods, setMorningFoods] = useState(['']);
  const [eveningFoods, setEveningFoods] = useState(['']);
  const [postEveningFoods, setPostEveningFoods] = useState(['']);
  const [nightFoods, setNightFoods] = useState(['']);
  const [results, setResults] = useState(null);

  // Nutrition values per unit (protein, carbs, fiber, fat per 100g or per piece/ml as noted)
  // All gram-based values are per gram for easy calculation
  const foodData = {
    // Eggs & Dairy
    'egg': { protein: 6, carbs: 0.6, fiber: 0, fat: 5, unit: 'piece' },
    'egg white': { protein: 3.5, carbs: 0.3, fiber: 0, fat: 0.1, unit: 'piece' },
    'milk': { protein: 0.033, carbs: 0.05, fiber: 0, fat: 0.033, unit: 'ml' },
    'curd': { protein: 0.035, carbs: 0.04, fiber: 0, fat: 0.033, unit: 'gram' },
    'yogurt': { protein: 0.035, carbs: 0.04, fiber: 0, fat: 0.033, unit: 'gram' },
    'paneer': { protein: 0.18, carbs: 0.03, fiber: 0, fat: 0.22, unit: 'gram' },
    'cottage cheese': { protein: 0.11, carbs: 0.034, fiber: 0, fat: 0.043, unit: 'gram' },
    'cheese': { protein: 0.25, carbs: 0.013, fiber: 0, fat: 0.33, unit: 'gram' },
    'butter': { protein: 0.009, carbs: 0.001, fiber: 0, fat: 0.81, unit: 'gram' },
    'ghee': { protein: 0, carbs: 0, fiber: 0, fat: 0.99, unit: 'gram' },

    // Meats & Poultry
    'chicken breast': { protein: 0.31, carbs: 0, fiber: 0, fat: 0.036, unit: 'gram' },
    'chicken': { protein: 0.27, carbs: 0, fiber: 0, fat: 0.14, unit: 'gram' },
    'chicken thigh': { protein: 0.26, carbs: 0, fiber: 0, fat: 0.10, unit: 'gram' },
    'mutton': { protein: 0.25, carbs: 0, fiber: 0, fat: 0.21, unit: 'gram' },
    'lamb': { protein: 0.25, carbs: 0, fiber: 0, fat: 0.21, unit: 'gram' },
    'beef': { protein: 0.26, carbs: 0, fiber: 0, fat: 0.15, unit: 'gram' },
    'pork': { protein: 0.27, carbs: 0, fiber: 0, fat: 0.14, unit: 'gram' },
    'turkey': { protein: 0.29, carbs: 0, fiber: 0, fat: 0.07, unit: 'gram' },
    'duck': { protein: 0.19, carbs: 0, fiber: 0, fat: 0.28, unit: 'gram' },
    'bacon': { protein: 0.37, carbs: 0.013, fiber: 0, fat: 0.42, unit: 'gram' },
    'sausage': { protein: 0.12, carbs: 0.02, fiber: 0, fat: 0.28, unit: 'gram' },
    'salami': { protein: 0.22, carbs: 0.02, fiber: 0, fat: 0.34, unit: 'gram' },
    'ham': { protein: 0.21, carbs: 0.01, fiber: 0, fat: 0.05, unit: 'gram' },

    // Seafood
    'fish': { protein: 0.22, carbs: 0, fiber: 0, fat: 0.05, unit: 'gram' },
    'salmon': { protein: 0.20, carbs: 0, fiber: 0, fat: 0.13, unit: 'gram' },
    'tuna': { protein: 0.29, carbs: 0, fiber: 0, fat: 0.01, unit: 'gram' },
    'mackerel': { protein: 0.19, carbs: 0, fiber: 0, fat: 0.14, unit: 'gram' },
    'sardine': { protein: 0.25, carbs: 0, fiber: 0, fat: 0.11, unit: 'gram' },
    'cod': { protein: 0.18, carbs: 0, fiber: 0, fat: 0.008, unit: 'gram' },
    'tilapia': { protein: 0.26, carbs: 0, fiber: 0, fat: 0.02, unit: 'gram' },
    'pomfret': { protein: 0.20, carbs: 0, fiber: 0, fat: 0.05, unit: 'gram' },
    'prawn': { protein: 0.24, carbs: 0, fiber: 0, fat: 0.003, unit: 'gram' },
    'shrimp': { protein: 0.24, carbs: 0, fiber: 0, fat: 0.003, unit: 'gram' },
    'crab': { protein: 0.19, carbs: 0, fiber: 0, fat: 0.015, unit: 'gram' },
    'lobster': { protein: 0.20, carbs: 0.01, fiber: 0, fat: 0.009, unit: 'gram' },
    'squid': { protein: 0.18, carbs: 0.03, fiber: 0, fat: 0.014, unit: 'gram' },
    'oyster': { protein: 0.09, carbs: 0.05, fiber: 0, fat: 0.023, unit: 'gram' },

    // Legumes & Pulses
    'dal': { protein: 0.08, carbs: 0.20, fiber: 0.07, fat: 0.01, unit: 'gram' },
    'toor dal': { protein: 0.08, carbs: 0.20, fiber: 0.07, fat: 0.01, unit: 'gram' },
    'moong dal': { protein: 0.08, carbs: 0.19, fiber: 0.05, fat: 0.01, unit: 'gram' },
    'urad dal': { protein: 0.08, carbs: 0.19, fiber: 0.06, fat: 0.01, unit: 'gram' },
    'masoor dal': { protein: 0.09, carbs: 0.20, fiber: 0.08, fat: 0.01, unit: 'gram' },
    'channa': { protein: 0.09, carbs: 0.27, fiber: 0.08, fat: 0.03, unit: 'gram' },
    'chickpeas': { protein: 0.09, carbs: 0.27, fiber: 0.08, fat: 0.03, unit: 'gram' },
    'rajma': { protein: 0.09, carbs: 0.22, fiber: 0.07, fat: 0.005, unit: 'gram' },
    'kidney beans': { protein: 0.09, carbs: 0.22, fiber: 0.07, fat: 0.005, unit: 'gram' },
    'black beans': { protein: 0.09, carbs: 0.24, fiber: 0.09, fat: 0.005, unit: 'gram' },
    'lentils': { protein: 0.09, carbs: 0.20, fiber: 0.08, fat: 0.004, unit: 'gram' },
    'green peas': { protein: 0.05, carbs: 0.14, fiber: 0.05, fat: 0.004, unit: 'gram' },
    'black eyed peas': { protein: 0.08, carbs: 0.21, fiber: 0.07, fat: 0.01, unit: 'gram' },
    'soya chunks': { protein: 0.52, carbs: 0.33, fiber: 0.13, fat: 0.005, unit: 'gram' },
    'tofu': { protein: 0.08, carbs: 0.02, fiber: 0.01, fat: 0.048, unit: 'gram' },
    'tempeh': { protein: 0.19, carbs: 0.09, fiber: 0.01, fat: 0.11, unit: 'gram' },

    // Nuts & Seeds
    'peanuts': { protein: 0.26, carbs: 0.16, fiber: 0.09, fat: 0.49, unit: 'gram' },
    'almonds': { protein: 0.21, carbs: 0.22, fiber: 0.12, fat: 0.49, unit: 'gram' },
    'cashews': { protein: 0.18, carbs: 0.30, fiber: 0.03, fat: 0.44, unit: 'gram' },
    'walnuts': { protein: 0.15, carbs: 0.14, fiber: 0.07, fat: 0.65, unit: 'gram' },
    'pistachios': { protein: 0.20, carbs: 0.28, fiber: 0.10, fat: 0.45, unit: 'gram' },
    'hazelnuts': { protein: 0.15, carbs: 0.17, fiber: 0.10, fat: 0.61, unit: 'gram' },
    'macadamia': { protein: 0.08, carbs: 0.14, fiber: 0.09, fat: 0.76, unit: 'gram' },
    'brazil nuts': { protein: 0.14, carbs: 0.12, fiber: 0.08, fat: 0.66, unit: 'gram' },
    'pine nuts': { protein: 0.14, carbs: 0.13, fiber: 0.04, fat: 0.68, unit: 'gram' },
    'sunflower seeds': { protein: 0.21, carbs: 0.20, fiber: 0.09, fat: 0.51, unit: 'gram' },
    'pumpkin seeds': { protein: 0.30, carbs: 0.11, fiber: 0.06, fat: 0.49, unit: 'gram' },
    'flax seeds': { protein: 0.18, carbs: 0.29, fiber: 0.27, fat: 0.42, unit: 'gram' },
    'chia seeds': { protein: 0.17, carbs: 0.42, fiber: 0.34, fat: 0.31, unit: 'gram' },
    'sesame seeds': { protein: 0.18, carbs: 0.23, fiber: 0.12, fat: 0.50, unit: 'gram' },
    'coconut': { protein: 0.03, carbs: 0.15, fiber: 0.09, fat: 0.33, unit: 'gram' },

    // Grains & Cereals
    'rice': { protein: 0.028, carbs: 0.28, fiber: 0.004, fat: 0.003, unit: 'gram' },
    'brown rice': { protein: 0.027, carbs: 0.23, fiber: 0.018, fat: 0.009, unit: 'gram' },
    'basmati rice': { protein: 0.028, carbs: 0.28, fiber: 0.004, fat: 0.003, unit: 'gram' },
    'wheat': { protein: 0.12, carbs: 0.72, fiber: 0.12, fat: 0.02, unit: 'gram' },
    'oats': { protein: 0.17, carbs: 0.66, fiber: 0.11, fat: 0.07, unit: 'gram' },
    'oatmeal': { protein: 0.025, carbs: 0.12, fiber: 0.016, fat: 0.014, unit: 'gram' },
    'quinoa': { protein: 0.04, carbs: 0.21, fiber: 0.03, fat: 0.019, unit: 'gram' },
    'barley': { protein: 0.10, carbs: 0.73, fiber: 0.17, fat: 0.012, unit: 'gram' },
    'millet': { protein: 0.11, carbs: 0.73, fiber: 0.09, fat: 0.04, unit: 'gram' },
    'ragi': { protein: 0.07, carbs: 0.72, fiber: 0.04, fat: 0.013, unit: 'gram' },
    'jowar': { protein: 0.11, carbs: 0.75, fiber: 0.06, fat: 0.03, unit: 'gram' },
    'bajra': { protein: 0.12, carbs: 0.67, fiber: 0.09, fat: 0.05, unit: 'gram' },
    'corn': { protein: 0.03, carbs: 0.19, fiber: 0.02, fat: 0.015, unit: 'gram' },
    'maize': { protein: 0.03, carbs: 0.19, fiber: 0.02, fat: 0.015, unit: 'gram' },
    'popcorn': { protein: 0.13, carbs: 0.78, fiber: 0.15, fat: 0.04, unit: 'gram' },
    'cornflakes': { protein: 0.07, carbs: 0.84, fiber: 0.04, fat: 0.004, unit: 'gram' },
    'muesli': { protein: 0.10, carbs: 0.66, fiber: 0.08, fat: 0.06, unit: 'gram' },
    'granola': { protein: 0.10, carbs: 0.64, fiber: 0.05, fat: 0.18, unit: 'gram' },

    // Breads & Bakery
    'bread': { protein: 0.09, carbs: 0.49, fiber: 0.03, fat: 0.03, unit: 'gram' },
    'white bread': { protein: 0.09, carbs: 0.49, fiber: 0.03, fat: 0.03, unit: 'gram' },
    'brown bread': { protein: 0.034, carbs: 0.13, fiber: 0.015, fat: 0.01, unit: 'gram' },
    'brown bread slice': { protein: 0.85, carbs: 3.25, fiber: 0.38, fat: 0.25, unit: 'slice' },
    'whole wheat bread': { protein: 0.13, carbs: 0.41, fiber: 0.07, fat: 0.04, unit: 'gram' },
    'multigrain bread': { protein: 0.13, carbs: 0.43, fiber: 0.06, fat: 0.04, unit: 'gram' },
    'chapathi': { protein: 3, carbs: 18, fiber: 2, fat: 3, unit: 'piece' },
    'roti': { protein: 3, carbs: 18, fiber: 2, fat: 3, unit: 'piece' },
    'paratha': { protein: 4, carbs: 30, fiber: 2, fat: 10, unit: 'piece' },
    'naan': { protein: 8, carbs: 45, fiber: 2, fat: 5, unit: 'piece' },
    'puri': { protein: 3, carbs: 18, fiber: 1, fat: 8, unit: 'piece' },
    'bhatura': { protein: 5, carbs: 35, fiber: 1, fat: 15, unit: 'piece' },
    'dosa': { protein: 4, carbs: 30, fiber: 1, fat: 5, unit: 'piece' },
    'idli': { protein: 2, carbs: 12, fiber: 0.5, fat: 0.3, unit: 'piece' },
    'vada': { protein: 3, carbs: 15, fiber: 1, fat: 8, unit: 'piece' },
    'uttapam': { protein: 5, carbs: 25, fiber: 2, fat: 5, unit: 'piece' },
    'upma': { protein: 0.03, carbs: 0.17, fiber: 0.02, fat: 0.04, unit: 'gram' },
    'poha': { protein: 0.02, carbs: 0.23, fiber: 0.01, fat: 0.03, unit: 'gram' },
    'tortilla': { protein: 0.08, carbs: 0.46, fiber: 0.03, fat: 0.07, unit: 'gram' },
    'pasta': { protein: 0.05, carbs: 0.25, fiber: 0.02, fat: 0.01, unit: 'gram' },
    'noodles': { protein: 0.05, carbs: 0.25, fiber: 0.01, fat: 0.02, unit: 'gram' },
    'macaroni': { protein: 0.05, carbs: 0.25, fiber: 0.02, fat: 0.01, unit: 'gram' },
    'spaghetti': { protein: 0.05, carbs: 0.25, fiber: 0.02, fat: 0.01, unit: 'gram' },
    'maggi': { protein: 0.09, carbs: 0.58, fiber: 0.02, fat: 0.17, unit: 'gram' },

    // Vegetables
    'potato': { protein: 0.02, carbs: 0.17, fiber: 0.02, fat: 0.001, unit: 'gram' },
    'sweet potato': { protein: 0.016, carbs: 0.20, fiber: 0.03, fat: 0.001, unit: 'gram' },
    'tomato': { protein: 0.009, carbs: 0.04, fiber: 0.01, fat: 0.002, unit: 'gram' },
    'onion': { protein: 0.01, carbs: 0.09, fiber: 0.02, fat: 0.001, unit: 'gram' },
    'garlic': { protein: 0.06, carbs: 0.33, fiber: 0.02, fat: 0.005, unit: 'gram' },
    'ginger': { protein: 0.02, carbs: 0.18, fiber: 0.02, fat: 0.008, unit: 'gram' },
    'carrot': { protein: 0.009, carbs: 0.10, fiber: 0.03, fat: 0.002, unit: 'gram' },
    'beetroot': { protein: 0.016, carbs: 0.10, fiber: 0.03, fat: 0.002, unit: 'gram' },
    'radish': { protein: 0.007, carbs: 0.03, fiber: 0.02, fat: 0.001, unit: 'gram' },
    'turnip': { protein: 0.009, carbs: 0.06, fiber: 0.02, fat: 0.001, unit: 'gram' },
    'cabbage': { protein: 0.013, carbs: 0.06, fiber: 0.025, fat: 0.001, unit: 'gram' },
    'cauliflower': { protein: 0.019, carbs: 0.05, fiber: 0.02, fat: 0.003, unit: 'gram' },
    'broccoli': { protein: 0.028, carbs: 0.07, fiber: 0.026, fat: 0.004, unit: 'gram' },
    'spinach': { protein: 0.029, carbs: 0.036, fiber: 0.022, fat: 0.004, unit: 'gram' },
    'lettuce': { protein: 0.013, carbs: 0.03, fiber: 0.013, fat: 0.002, unit: 'gram' },
    'kale': { protein: 0.043, carbs: 0.09, fiber: 0.04, fat: 0.009, unit: 'gram' },
    'methi': { protein: 0.04, carbs: 0.06, fiber: 0.05, fat: 0.009, unit: 'gram' },
    'palak': { protein: 0.029, carbs: 0.036, fiber: 0.022, fat: 0.004, unit: 'gram' },
    'cucumber': { protein: 0.007, carbs: 0.04, fiber: 0.005, fat: 0.001, unit: 'gram' },
    'zucchini': { protein: 0.012, carbs: 0.03, fiber: 0.01, fat: 0.003, unit: 'gram' },
    'bottle gourd': { protein: 0.006, carbs: 0.03, fiber: 0.004, fat: 0.001, unit: 'gram' },
    'bitter gourd': { protein: 0.01, carbs: 0.04, fiber: 0.03, fat: 0.002, unit: 'gram' },
    'ridge gourd': { protein: 0.005, carbs: 0.03, fiber: 0.005, fat: 0.001, unit: 'gram' },
    'pumpkin': { protein: 0.01, carbs: 0.07, fiber: 0.005, fat: 0.001, unit: 'gram' },
    'eggplant': { protein: 0.01, carbs: 0.06, fiber: 0.03, fat: 0.002, unit: 'gram' },
    'brinjal': { protein: 0.01, carbs: 0.06, fiber: 0.03, fat: 0.002, unit: 'gram' },
    'capsicum': { protein: 0.009, carbs: 0.06, fiber: 0.02, fat: 0.003, unit: 'gram' },
    'bell pepper': { protein: 0.009, carbs: 0.06, fiber: 0.02, fat: 0.003, unit: 'gram' },
    'green chili': { protein: 0.02, carbs: 0.09, fiber: 0.015, fat: 0.004, unit: 'gram' },
    'okra': { protein: 0.02, carbs: 0.07, fiber: 0.03, fat: 0.002, unit: 'gram' },
    'bhindi': { protein: 0.02, carbs: 0.07, fiber: 0.03, fat: 0.002, unit: 'gram' },
    'beans': { protein: 0.02, carbs: 0.07, fiber: 0.03, fat: 0.001, unit: 'gram' },
    'french beans': { protein: 0.02, carbs: 0.07, fiber: 0.03, fat: 0.001, unit: 'gram' },
    'green beans': { protein: 0.02, carbs: 0.07, fiber: 0.03, fat: 0.001, unit: 'gram' },
    'drumstick': { protein: 0.02, carbs: 0.08, fiber: 0.02, fat: 0.002, unit: 'gram' },
    'mushroom': { protein: 0.031, carbs: 0.033, fiber: 0.01, fat: 0.003, unit: 'gram' },
    'asparagus': { protein: 0.022, carbs: 0.04, fiber: 0.02, fat: 0.001, unit: 'gram' },
    'celery': { protein: 0.007, carbs: 0.03, fiber: 0.016, fat: 0.002, unit: 'gram' },
    'leek': { protein: 0.015, carbs: 0.14, fiber: 0.02, fat: 0.003, unit: 'gram' },
    'spring onion': { protein: 0.02, carbs: 0.07, fiber: 0.03, fat: 0.002, unit: 'gram' },
    'coriander': { protein: 0.021, carbs: 0.037, fiber: 0.028, fat: 0.005, unit: 'gram' },
    'mint': { protein: 0.036, carbs: 0.08, fiber: 0.08, fat: 0.009, unit: 'gram' },
    'curry leaves': { protein: 0.066, carbs: 0.16, fiber: 0.066, fat: 0.01, unit: 'gram' },
    'sprouts': { protein: 0.08, carbs: 0.15, fiber: 0.04, fat: 0.006, unit: 'gram' },
    'sprouts (green gram)': { protein: 0.08, carbs: 0.15, fiber: 0.04, fat: 0.006, unit: 'gram' },
    'peanut chutney': { protein: 0.2, carbs: 0.16, fiber: 0.06, fat: 0.30, unit: 'gram' },

    // Fruits
    'apple': { protein: 0.003, carbs: 0.14, fiber: 0.024, fat: 0.002, unit: 'gram' },
    'banana': { protein: 0.011, carbs: 0.23, fiber: 0.026, fat: 0.003, unit: 'gram' },
    'orange': { protein: 0.009, carbs: 0.12, fiber: 0.024, fat: 0.001, unit: 'gram' },
    'mango': { protein: 0.008, carbs: 0.15, fiber: 0.016, fat: 0.004, unit: 'gram' },
    'grapes': { protein: 0.007, carbs: 0.18, fiber: 0.009, fat: 0.002, unit: 'gram' },
    'watermelon': { protein: 0.006, carbs: 0.08, fiber: 0.004, fat: 0.002, unit: 'gram' },
    'muskmelon': { protein: 0.008, carbs: 0.08, fiber: 0.009, fat: 0.002, unit: 'gram' },
    'papaya': { protein: 0.005, carbs: 0.11, fiber: 0.018, fat: 0.003, unit: 'gram' },
    'pineapple': { protein: 0.005, carbs: 0.13, fiber: 0.014, fat: 0.001, unit: 'gram' },
    'pomegranate': { protein: 0.017, carbs: 0.19, fiber: 0.04, fat: 0.012, unit: 'gram' },
    'guava': { protein: 0.026, carbs: 0.14, fiber: 0.053, fat: 0.01, unit: 'gram' },
    'strawberry': { protein: 0.007, carbs: 0.08, fiber: 0.02, fat: 0.003, unit: 'gram' },
    'blueberry': { protein: 0.007, carbs: 0.14, fiber: 0.024, fat: 0.003, unit: 'gram' },
    'raspberry': { protein: 0.012, carbs: 0.12, fiber: 0.065, fat: 0.007, unit: 'gram' },
    'blackberry': { protein: 0.014, carbs: 0.10, fiber: 0.053, fat: 0.005, unit: 'gram' },
    'cherry': { protein: 0.01, carbs: 0.16, fiber: 0.021, fat: 0.003, unit: 'gram' },
    'peach': { protein: 0.009, carbs: 0.10, fiber: 0.015, fat: 0.003, unit: 'gram' },
    'plum': { protein: 0.007, carbs: 0.11, fiber: 0.014, fat: 0.003, unit: 'gram' },
    'apricot': { protein: 0.014, carbs: 0.11, fiber: 0.02, fat: 0.004, unit: 'gram' },
    'pear': { protein: 0.004, carbs: 0.15, fiber: 0.031, fat: 0.001, unit: 'gram' },
    'kiwi': { protein: 0.011, carbs: 0.15, fiber: 0.03, fat: 0.005, unit: 'gram' },
    'fig': { protein: 0.008, carbs: 0.19, fiber: 0.029, fat: 0.003, unit: 'gram' },
    'dates': { protein: 0.024, carbs: 0.75, fiber: 0.07, fat: 0.004, unit: 'gram' },
    'raisins': { protein: 0.031, carbs: 0.79, fiber: 0.037, fat: 0.005, unit: 'gram' },
    'prunes': { protein: 0.022, carbs: 0.64, fiber: 0.07, fat: 0.004, unit: 'gram' },
    'lemon': { protein: 0.011, carbs: 0.09, fiber: 0.028, fat: 0.003, unit: 'gram' },
    'lime': { protein: 0.007, carbs: 0.11, fiber: 0.028, fat: 0.002, unit: 'gram' },
    'grapefruit': { protein: 0.008, carbs: 0.08, fiber: 0.011, fat: 0.001, unit: 'gram' },
    'avocado': { protein: 0.02, carbs: 0.09, fiber: 0.067, fat: 0.15, unit: 'gram' },
    'coconut water': { protein: 0.002, carbs: 0.04, fiber: 0.011, fat: 0.002, unit: 'ml' },
    'jackfruit': { protein: 0.017, carbs: 0.24, fiber: 0.015, fat: 0.006, unit: 'gram' },
    'litchi': { protein: 0.008, carbs: 0.17, fiber: 0.013, fat: 0.004, unit: 'gram' },
    'sapota': { protein: 0.004, carbs: 0.20, fiber: 0.053, fat: 0.011, unit: 'gram' },
    'chikoo': { protein: 0.004, carbs: 0.20, fiber: 0.053, fat: 0.011, unit: 'gram' },
    'custard apple': { protein: 0.021, carbs: 0.24, fiber: 0.044, fat: 0.003, unit: 'gram' },

    // Beverages
    'tea': { protein: 0, carbs: 0.004, fiber: 0, fat: 0, unit: 'ml' },
    'coffee': { protein: 0.001, carbs: 0, fiber: 0, fat: 0, unit: 'ml' },
    'green tea': { protein: 0, carbs: 0, fiber: 0, fat: 0, unit: 'ml' },
    'buttermilk': { protein: 0.033, carbs: 0.048, fiber: 0, fat: 0.009, unit: 'ml' },
    'lassi': { protein: 0.03, carbs: 0.10, fiber: 0, fat: 0.02, unit: 'ml' },
    'orange juice': { protein: 0.007, carbs: 0.10, fiber: 0.002, fat: 0.002, unit: 'ml' },
    'apple juice': { protein: 0.001, carbs: 0.11, fiber: 0.001, fat: 0.001, unit: 'ml' },
    'sugarcane juice': { protein: 0, carbs: 0.13, fiber: 0, fat: 0, unit: 'ml' },

    // Sweets & Snacks
    'sugar': { protein: 0, carbs: 1, fiber: 0, fat: 0, unit: 'gram' },
    'jaggery': { protein: 0.004, carbs: 0.98, fiber: 0, fat: 0.001, unit: 'gram' },
    'honey': { protein: 0.003, carbs: 0.82, fiber: 0, fat: 0, unit: 'gram' },
    'chocolate': { protein: 0.05, carbs: 0.60, fiber: 0.07, fat: 0.31, unit: 'gram' },
    'biscuit': { protein: 0.06, carbs: 0.68, fiber: 0.02, fat: 0.20, unit: 'gram' },
    'cake': { protein: 0.05, carbs: 0.50, fiber: 0.01, fat: 0.20, unit: 'gram' },
    'ice cream': { protein: 0.035, carbs: 0.24, fiber: 0.01, fat: 0.11, unit: 'gram' },
    'samosa': { protein: 4, carbs: 25, fiber: 2, fat: 12, unit: 'piece' },
    'pakora': { protein: 2, carbs: 10, fiber: 1, fat: 8, unit: 'piece' },
    'bhaji': { protein: 2, carbs: 12, fiber: 1, fat: 6, unit: 'piece' },

    // Oils (mainly fat, minimal protein/carbs/fiber)
    'olive oil': { protein: 0, carbs: 0, fiber: 0, fat: 1, unit: 'gram' },
    'coconut oil': { protein: 0, carbs: 0, fiber: 0, fat: 1, unit: 'gram' },
    'sunflower oil': { protein: 0, carbs: 0, fiber: 0, fat: 1, unit: 'gram' },
    'mustard oil': { protein: 0, carbs: 0, fiber: 0, fat: 1, unit: 'gram' },
    'groundnut oil': { protein: 0, carbs: 0, fiber: 0, fat: 1, unit: 'gram' },
  };

  function parseFoodEntry(entry) {
    if (!entry) return { food: entry, protein: 0, carbs: 0, fiber: 0, fat: 0 };
    const parts = entry.split(' ');
    let name = parts[0];
    let qty = 1;
    let unit = '';

    // Multi-word food names
    if (foodData[entry]) {
      name = entry;
    } else if (foodData[parts.slice(0,2).join(' ')]) {
      name = parts.slice(0,2).join(' ');
      if (parts.length > 2) {
        // e.g. brown bread 2 slice
        const num = parseFloat(parts[2]);
        if (!isNaN(num)) qty = num;
        if (parts.length > 3) unit = parts[3];
        else unit = parts[2].replace(/[0-9]/g, '');
      }
    } else {
      // e.g. rice 200g
      if (parts.length > 1) {
        const num = parseFloat(parts[1]);
        if (!isNaN(num)) qty = num;
        unit = parts[1].replace(/[0-9]/g, '');
      }
    }

    // Default units
    if (foodData[name]) {
      unit = foodData[name].unit;
    }

    // Special handling for rice and bread
    if (name === 'rice' && unit.includes('g')) {
      // qty is already in grams
      const data = foodData['rice'];
      return {
        food: entry,
        protein: +(data.protein * qty).toFixed(2),
        carbs: +(data.carbs * qty).toFixed(2),
        fiber: +(data.fiber * qty).toFixed(2),
        fat: +((data.fat || 0) * qty).toFixed(2)
      };
    }
    if (name === 'brown bread' && unit.includes('slice')) {
      // Use slice nutrition
      const data = foodData['brown bread slice'];
      return {
        food: entry,
        protein: +(data.protein * qty).toFixed(2),
        carbs: +(data.carbs * qty).toFixed(2),
        fiber: +(data.fiber * qty).toFixed(2),
        fat: +((data.fat || 0) * qty).toFixed(2)
      };
    }
    // Default: per piece
    const data = foodData[name] || { protein: 0, carbs: 0, fiber: 0, fat: 0 };
    return {
      food: entry,
      protein: +(data.protein * qty).toFixed(2),
      carbs: +(data.carbs * qty).toFixed(2),
      fiber: +(data.fiber * qty).toFixed(2),
      fat: +((data.fat || 0) * qty).toFixed(2)
    };
  }

  const handleCalculate = () => {
    const resultArr = [];
    
    // Process morning foods
    morningFoods.filter(f => f.trim()).forEach(food => {
      resultArr.push({ time: 'Morning', ...parseFoodEntry(food) });
    });
    
    // Process evening foods
    eveningFoods.filter(f => f.trim()).forEach(food => {
      resultArr.push({ time: 'Evening', ...parseFoodEntry(food) });
    });
    
    // Process post evening foods
    postEveningFoods.filter(f => f.trim()).forEach(food => {
      resultArr.push({ time: 'Post Evening', ...parseFoodEntry(food) });
    });
    
    // Process night foods
    nightFoods.filter(f => f.trim()).forEach(food => {
      resultArr.push({ time: 'Night', ...parseFoodEntry(food) });
    });
    
    setResults(resultArr);
  };

  // Get list of all food names for autocomplete
  const foodNames = Object.keys(foodData);

  // Filter suggestions based on input
  const getSuggestions = (input) => {
    if (!input) return [];
    const inputLower = input.toLowerCase();
    return foodNames.filter(name => name.toLowerCase().includes(inputLower)).slice(0, 8);
  };

  // Autocomplete input component for a single food item
  const FoodInput = ({ value, onChange, onRemove, placeholder, showRemove }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestions = getSuggestions(value);

    const handleSelect = (suggestion) => {
      onChange(suggestion);
      setShowSuggestions(false);
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={e => {
              onChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            style={{ width: '250px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              zIndex: 100,
              maxHeight: '180px',
              overflowY: 'auto',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  onMouseDown={() => handleSelect(s)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    background: '#fff'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#f0f0f0'}
                  onMouseOut={e => e.currentTarget.style.background = '#fff'}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        {showRemove && (
          <button 
            onClick={onRemove} 
            style={{ 
              marginLeft: '8px', 
              padding: '6px 12px', 
              background: '#ff4444', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        )}
      </div>
    );
  };

  // Calculate nutrition for a single meal
  // Check if a food entry contains a valid food name
  const isValidFoodEntry = (entry) => {
    if (!entry || !entry.trim()) return false;
    const entryLower = entry.toLowerCase().trim();
    const parts = entryLower.split(' ');
    
    // Check if entry itself is a food name
    if (foodData[entryLower]) return true;
    
    // Check if first word is a food name (e.g., "egg 3")
    if (foodData[parts[0]]) return true;
    
    // Check if first two words are a food name (e.g., "brown bread 2")
    if (parts.length >= 2 && foodData[parts.slice(0, 2).join(' ')]) return true;
    
    // Check if first three words are a food name
    if (parts.length >= 3 && foodData[parts.slice(0, 3).join(' ')]) return true;
    
    return false;
  };

  const calculateMeal = (label, foods) => {
    const resultArr = [];
    foods.filter(f => f.trim()).forEach(food => {
      resultArr.push({ time: label, ...parseFoodEntry(food) });
    });
    return resultArr;
  };

  // Multi-food input section for a meal time
  const MealSection = ({ label, foods, setFoods, placeholder }) => {
    const [mealResults, setMealResults] = useState(null);

    const addFood = () => {
      setFoods([...foods, '']);
    };

    const updateFood = (index, value) => {
      const newFoods = [...foods];
      newFoods[index] = value;
      setFoods(newFoods);
      setMealResults(null); // Clear results when food changes
    };

    const removeFood = (index) => {
      const newFoods = foods.filter((_, i) => i !== index);
      setFoods(newFoods.length > 0 ? newFoods : ['']);
      setMealResults(null);
    };

    const handleCalculateMeal = () => {
      const results = calculateMeal(label, foods);
      setMealResults(results);
    };

    // Only show calculate button if at least one food entry is valid
    const hasValidFoods = foods.some(f => isValidFoodEntry(f));

    // Calculate totals for this meal
    const totals = mealResults ? mealResults.reduce((acc, item) => ({
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fiber: acc.fiber + item.fiber,
      fat: acc.fat + item.fat
    }), { protein: 0, carbs: 0, fiber: 0, fat: 0 }) : null;

    return (
      <div style={{ marginBottom: '24px', padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h4 style={{ marginTop: 0, marginBottom: '12px', color: '#333' }}>{label}:</h4>
        {foods.map((food, index) => (
          <FoodInput
            key={index}
            value={food}
            onChange={(value) => updateFood(index, value)}
            onRemove={() => removeFood(index)}
            placeholder={placeholder}
            showRemove={foods.length > 1}
          />
        ))}
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button 
            onClick={addFood}
            style={{ 
              padding: '6px 16px', 
              background: '#4CAF50', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            + Add Food
          </button>
          {hasValidFoods && (
            <button 
              onClick={handleCalculateMeal}
              style={{ 
                padding: '6px 16px', 
                background: '#2196F3', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Calculate {label}
            </button>
          )}
        </div>
        {mealResults && mealResults.length > 0 && (
          <div style={{ marginTop: '12px', padding: '12px', background: '#fff', borderRadius: '6px', border: '1px solid #ddd' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Food</th>
                  <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Protein (g)</th>
                  <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Carbs (g)</th>
                  <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Fiber (g)</th>
                  <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Fat (g)</th>
                </tr>
              </thead>
              <tbody>
                {mealResults.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.food}</td>
                    <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{item.protein}</td>
                    <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{item.carbs}</td>
                    <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{item.fiber}</td>
                    <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{item.fat}</td>
                  </tr>
                ))}
                {mealResults.length > 1 && (
                  <tr style={{ background: '#e8f5e9', fontWeight: 'bold' }}>
                    <td style={{ padding: '8px' }}>Total</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>{totals.protein.toFixed(2)}</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>{totals.carbs.toFixed(2)}</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>{totals.fiber.toFixed(2)}</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>{totals.fat.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Check if at least one food is entered
  const hasAnyFood = () => {
    return morningFoods.some(f => f.trim()) || 
           eveningFoods.some(f => f.trim()) || 
           postEveningFoods.some(f => f.trim()) || 
           nightFoods.some(f => f.trim());
  };

  return (
    <div>
      <h2>Your Dashboard</h2>
      <p>Goal: {goal || 'Not set'}</p>
      <div style={{marginTop: '20px'}}>
        <h3>Food Tracker</h3>
        <MealSection 
          label="Morning" 
          foods={morningFoods} 
          setFoods={setMorningFoods} 
          placeholder="Enter morning food (e.g., egg 2, rice 200g)" 
        />
        <MealSection 
          label="Evening" 
          foods={eveningFoods} 
          setFoods={setEveningFoods} 
          placeholder="Enter evening food" 
        />
        <MealSection 
          label="Post Evening" 
          foods={postEveningFoods} 
          setFoods={setPostEveningFoods} 
          placeholder="Enter post evening food" 
        />
        <MealSection 
          label="Night" 
          foods={nightFoods} 
          setFoods={setNightFoods} 
          placeholder="Enter night food" 
        />
        {hasAnyFood() && (
          <button 
            style={{
              marginTop: '16px', 
              padding: '12px 24px', 
              fontSize: '16px',
              background: '#2196F3',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }} 
            onClick={handleCalculate}
          >
            Calculate Nutrition
          </button>
        )}
      </div>
      {results && <FoodResultsDashboard results={results} />}
    </div>
  );
}

export default Dashboard;
