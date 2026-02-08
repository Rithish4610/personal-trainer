

import React, { useState, useCallback, memo, useRef } from 'react';
import FoodResultsDashboard from './FoodResultsDashboard';

// FoodInput component moved outside Dashboard to prevent re-creation on each render
const FoodInput = memo(({ value, onChange, onRemove, placeholder, showRemove, getSuggestions, isValidFoodEntry }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = getSuggestions(value);

  const handleSelect = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const isValid = isValidFoodEntry(value);

  return (
    <div className="food-input-wrapper">
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          className="food-input"
          placeholder={placeholder}
          value={value}
          onChange={e => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          style={{
            borderColor: value && isValid ? '#00d4aa' : value ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
            width: '100%'
          }}
        />
        {value && isValid && (
          <span style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#00d4aa',
            fontSize: '18px'
          }}>✓</span>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                className="suggestion-item"
                onMouseDown={() => handleSelect(s)}
              >
                <span className="suggestion-icon">🍽️</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {showRemove && (
        <button onClick={onRemove} className="btn-remove">
          ✕
        </button>
      )}
    </div>
  );
});

// MealSection component moved outside Dashboard
const MealSection = memo(({ label, foods, setFoods, placeholder, mealClass, icon, time, getSuggestions, isValidFoodEntry, calculateMeal }) => {
  const [mealResults, setMealResults] = useState(null);

  const addFood = () => {
    setFoods([...foods, '']);
  };

  const updateFood = (index, value) => {
    const newFoods = [...foods];
    newFoods[index] = value;
    setFoods(newFoods);
    setMealResults(null);
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

  const hasValidFoods = foods.some(f => isValidFoodEntry(f));

  const totals = mealResults ? mealResults.reduce((acc, item) => ({
    protein: acc.protein + item.protein,
    carbs: acc.carbs + item.carbs,
    fiber: acc.fiber + item.fiber,
    fat: acc.fat + item.fat
  }), { protein: 0, carbs: 0, fiber: 0, fat: 0 }) : null;

  return (
    <div className={`meal-card ${mealClass || ''}`}>
      <div className="meal-card-header">
        <div className="meal-icon">{icon || '🍽️'}</div>
        <div>
          <h4 className="meal-title">{label}</h4>
          <span className="meal-time">{time || ''}</span>
        </div>
      </div>
      
      {foods.map((food, index) => (
        <FoodInput
          key={`${label}-${index}`}
          value={food}
          onChange={(value) => updateFood(index, value)}
          onRemove={() => removeFood(index)}
          placeholder={placeholder}
          showRemove={foods.length > 1}
          getSuggestions={getSuggestions}
          isValidFoodEntry={isValidFoodEntry}
        />
      ))}
      
      <div className="meal-actions">
        <button onClick={addFood} className="btn-add-food">
          <span>➕</span> Add Food
        </button>
        {hasValidFoods && (
          <button onClick={handleCalculateMeal} className="btn-calculate">
            <span>📊</span> Calculate {label}
          </button>
        )}
      </div>

      {mealResults && mealResults.length > 0 && (
        <div className="results-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Food</th>
                <th style={{ textAlign: 'right' }}>Protein</th>
                <th style={{ textAlign: 'right' }}>Carbs</th>
                <th style={{ textAlign: 'right' }}>Fiber</th>
                <th style={{ textAlign: 'right' }}>Fat</th>
              </tr>
            </thead>
            <tbody>
              {mealResults.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.food}</td>
                  <td style={{ textAlign: 'right' }}>{item.protein}g</td>
                  <td style={{ textAlign: 'right' }}>{item.carbs}g</td>
                  <td style={{ textAlign: 'right' }}>{item.fiber}g</td>
                  <td style={{ textAlign: 'right' }}>{item.fat}g</td>
                </tr>
              ))}
              {mealResults.length > 1 && (
                <tr className="results-total">
                  <td><strong>Total</strong></td>
                  <td style={{ textAlign: 'right' }}><strong>{totals.protein.toFixed(2)}g</strong></td>
                  <td style={{ textAlign: 'right' }}><strong>{totals.carbs.toFixed(2)}g</strong></td>
                  <td style={{ textAlign: 'right' }}><strong>{totals.fiber.toFixed(2)}g</strong></td>
                  <td style={{ textAlign: 'right' }}><strong>{totals.fat.toFixed(2)}g</strong></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

function Dashboard({ goal, weight, dob, username, onLogout }) {
  const [morningFoods, setMorningFoods] = useState(['']);
  const [eveningFoods, setEveningFoods] = useState(['']);
  const [postEveningFoods, setPostEveningFoods] = useState(['']);
  const [nightFoods, setNightFoods] = useState(['']);
  const [results, setResults] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showFoodTracker, setShowFoodTracker] = useState(false);
  const foodTrackerRef = useRef(null);

  // Calculate age from DOB
  const calculateAge = (dobString) => {
    if (!dobString) return null;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(dob);
  const weightNum = parseFloat(weight) || 0;

  // Calculate protein goal based on goal type and weight
  const getProteinGoal = () => {
    if (!weightNum) return { min: 0, max: 0, recommended: 0 };
    
    switch(goal?.toLowerCase()) {
      case 'fat loss':
        // Higher protein for fat loss: 1.6-2.2g per kg
        return { min: Math.round(weightNum * 1.6), max: Math.round(weightNum * 2.2), recommended: Math.round(weightNum * 1.8) };
      case 'muscle':
        // Highest protein for muscle building: 1.8-2.4g per kg
        return { min: Math.round(weightNum * 1.8), max: Math.round(weightNum * 2.4), recommended: Math.round(weightNum * 2.0) };
      case 'body recomp':
        // High protein for body recomposition: 1.8-2.2g per kg
        return { min: Math.round(weightNum * 1.8), max: Math.round(weightNum * 2.2), recommended: Math.round(weightNum * 2.0) };
      case 'general fitness':
        // Moderate protein: 1.2-1.6g per kg
        return { min: Math.round(weightNum * 1.2), max: Math.round(weightNum * 1.6), recommended: Math.round(weightNum * 1.4) };
      default:
        return { min: Math.round(weightNum * 1.2), max: Math.round(weightNum * 1.8), recommended: Math.round(weightNum * 1.5) };
    }
  };

  const proteinGoal = getProteinGoal();

  // Calculate daily calorie target based on goal, weight, and age
  const getCalorieTarget = () => {
    if (!weightNum) return { min: 0, max: 0, recommended: 0, deficit: 0 };
    // Base metabolic rate estimate (simplified Mifflin-St Jeor)
    const bmr = 10 * weightNum + (age ? 5 * 170 - 5 * age : 500) + 5; // Assuming average height
    const tdee = bmr * 1.55; // Moderate activity multiplier
    
    switch(goal?.toLowerCase()) {
      case 'fat loss':
        return { 
          min: Math.round(tdee - 700), 
          max: Math.round(tdee - 300), 
          recommended: Math.round(tdee - 500),
          deficit: -500,
          description: 'Caloric deficit for fat loss'
        };
      case 'muscle':
        return { 
          min: Math.round(tdee + 200), 
          max: Math.round(tdee + 500), 
          recommended: Math.round(tdee + 300),
          deficit: 300,
          description: 'Caloric surplus for muscle gain'
        };
      case 'body recomp':
        return { 
          min: Math.round(tdee - 200), 
          max: Math.round(tdee + 200), 
          recommended: Math.round(tdee),
          deficit: 0,
          description: 'Maintenance calories for recomposition'
        };
      case 'general fitness':
        return { 
          min: Math.round(tdee - 200), 
          max: Math.round(tdee + 200), 
          recommended: Math.round(tdee),
          deficit: 0,
          description: 'Maintenance for general health'
        };
      default:
        return { min: Math.round(tdee - 200), max: Math.round(tdee + 200), recommended: Math.round(tdee), deficit: 0, description: 'Estimated daily calories' };
    }
  };

  const calorieTarget = getCalorieTarget();

  // Get macro split based on goal
  const getMacroSplit = () => {
    switch(goal?.toLowerCase()) {
      case 'fat loss':
        return { protein: 40, carbs: 30, fat: 30, description: 'High protein, moderate carbs & fat' };
      case 'muscle':
        return { protein: 30, carbs: 45, fat: 25, description: 'High carbs for energy & growth' };
      case 'body recomp':
        return { protein: 35, carbs: 35, fat: 30, description: 'Balanced macros for recomp' };
      case 'general fitness':
        return { protein: 25, carbs: 45, fat: 30, description: 'Balanced nutrition' };
      default:
        return { protein: 30, carbs: 40, fat: 30, description: 'Balanced macros' };
    }
  };

  const macroSplit = getMacroSplit();

  // Get workout recommendations based on goal
  const getWorkoutPlan = () => {
    switch(goal?.toLowerCase()) {
      case 'fat loss':
        return {
          focus: 'HIIT + Strength',
          cardio: '4-5 sessions/week',
          strength: '3-4 sessions/week',
          tips: [
            '🔥 30-45 min HIIT sessions burn maximum calories',
            '💪 Include compound lifts to preserve muscle',
            '🚶 Add 10,000 daily steps for extra burn',
            '⏰ Morning fasted cardio can enhance fat oxidation'
          ]
        };
      case 'muscle':
        return {
          focus: 'Heavy Lifting',
          cardio: '1-2 sessions/week (light)',
          strength: '5-6 sessions/week',
          tips: [
            '🏋️ Focus on progressive overload each week',
            '💥 Compound movements: Squats, Deadlifts, Bench',
            '⏱️ Rest 2-3 minutes between heavy sets',
            '🔄 Train each muscle group 2x per week'
          ]
        };
      case 'body recomp':
        return {
          focus: 'Strength + Moderate Cardio',
          cardio: '2-3 sessions/week',
          strength: '4-5 sessions/week',
          tips: [
            '⚖️ Prioritize strength training to build muscle',
            '🎯 Train in the 6-12 rep range for hypertrophy',
            '🏃 Low-intensity cardio on rest days',
            '📊 Track lifts - aim to increase weight weekly'
          ]
        };
      case 'general fitness':
        return {
          focus: 'Balanced Training',
          cardio: '3-4 sessions/week',
          strength: '2-3 sessions/week',
          tips: [
            '🌟 Mix cardio, strength, and flexibility work',
            '🧘 Include yoga or stretching 2x per week',
            '🚴 Try different activities to stay engaged',
            '👥 Group classes are great for motivation'
          ]
        };
      default:
        return {
          focus: 'General Fitness',
          cardio: '3 sessions/week',
          strength: '2-3 sessions/week',
          tips: ['Start with a balanced mix of cardio and strength training']
        };
    }
  };

  const workoutPlan = getWorkoutPlan();

  // Calculate BMI (assuming average height of 170cm if not provided)
  const getBMI = () => {
    if (!weightNum) return null;
    const heightM = 1.70; // Default height assumption
    const bmi = weightNum / (heightM * heightM);
    let category, color, recommendation;
    
    if (bmi < 18.5) {
      category = 'Underweight';
      color = '#3498db';
      recommendation = 'Focus on nutrient-dense foods and gradual weight gain';
    } else if (bmi < 25) {
      category = 'Normal';
      color = '#00d4aa';
      recommendation = 'Maintain your healthy weight with balanced nutrition';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = '#ffc107';
      recommendation = 'Gradual caloric deficit with regular exercise recommended';
    } else {
      category = 'Obese';
      color = '#ff4757';
      recommendation = 'Consult a healthcare provider for personalized guidance';
    }
    
    return { value: bmi.toFixed(1), category, color, recommendation };
  };

  const bmiData = getBMI();

  // Calculate daily water intake based on weight and goal
  const getWaterIntake = () => {
    if (!weightNum) return { min: 2, max: 3, recommended: 2.5 };
    
    // Base: 35ml per kg of body weight
    const baseWater = weightNum * 0.035;
    
    switch(goal?.toLowerCase()) {
      case 'fat loss':
        // Extra water helps with metabolism and fullness
        return { 
          min: Math.round((baseWater + 0.5) * 10) / 10, 
          max: Math.round((baseWater + 1.5) * 10) / 10, 
          recommended: Math.round((baseWater + 1) * 10) / 10,
          tip: 'Drink water before meals to reduce appetite'
        };
      case 'muscle':
        // Muscle tissue needs more hydration
        return { 
          min: Math.round((baseWater + 0.5) * 10) / 10, 
          max: Math.round((baseWater + 1.5) * 10) / 10, 
          recommended: Math.round((baseWater + 1) * 10) / 10,
          tip: 'Stay hydrated for optimal muscle protein synthesis'
        };
      case 'body recomp':
        return { 
          min: Math.round((baseWater + 0.3) * 10) / 10, 
          max: Math.round((baseWater + 1) * 10) / 10, 
          recommended: Math.round((baseWater + 0.7) * 10) / 10,
          tip: 'Proper hydration supports both fat loss and muscle gain'
        };
      default:
        return { 
          min: Math.round(baseWater * 10) / 10, 
          max: Math.round((baseWater + 0.5) * 10) / 10, 
          recommended: Math.round((baseWater + 0.3) * 10) / 10,
          tip: 'Consistent hydration improves energy and focus'
        };
    }
  };

  const waterIntake = getWaterIntake();

  // Sleep recommendations based on goal and age
  const getSleepRecommendation = () => {
    let minHours, maxHours, recommended, quality;
    
    // Age-based adjustments
    if (age && age < 25) {
      minHours = 7;
      maxHours = 9;
    } else if (age && age > 50) {
      minHours = 7;
      maxHours = 8;
    } else {
      minHours = 7;
      maxHours = 9;
    }
    
    switch(goal?.toLowerCase()) {
      case 'fat loss':
        recommended = 8;
        quality = 'Sleep deprivation increases hunger hormones (ghrelin) and cravings';
        break;
      case 'muscle':
        recommended = 8.5;
        quality = 'Growth hormone is released during deep sleep - crucial for gains';
        break;
      case 'body recomp':
        recommended = 8;
        quality = 'Quality sleep optimizes hormones for both fat loss and muscle building';
        break;
      default:
        recommended = 7.5;
        quality = 'Consistent sleep schedule improves overall health and energy';
    }
    
    return { min: minHours, max: maxHours, recommended, quality };
  };

  const sleepRecommendation = getSleepRecommendation();

  // Daily fiber goal
  const getFiberGoal = () => {
    // Base: 14g per 1000 calories
    const baseCalories = calorieTarget.recommended || 2000;
    const baseFiber = Math.round((baseCalories / 1000) * 14);
    
    switch(goal?.toLowerCase()) {
      case 'fat loss':
        // Higher fiber for satiety
        return { min: baseFiber, max: baseFiber + 10, recommended: baseFiber + 5, tip: 'Fiber keeps you full longer' };
      case 'muscle':
        return { min: baseFiber - 5, max: baseFiber + 5, recommended: baseFiber, tip: 'Moderate fiber supports digestion without excess fullness' };
      default:
        return { min: baseFiber - 3, max: baseFiber + 5, recommended: baseFiber, tip: 'Fiber supports gut health and digestion' };
    }
  };

  const fiberGoal = getFiberGoal();

  // Weekly workout split recommendations
  const getWeeklyWorkoutSplit = () => {
    switch(goal?.toLowerCase()) {
      case 'fat loss':
        return {
          schedule: [
            { day: 'Monday', workout: 'HIIT Cardio + Abs', duration: '45 min', icon: '🔥' },
            { day: 'Tuesday', workout: 'Full Body Strength', duration: '50 min', icon: '💪' },
            { day: 'Wednesday', workout: 'Steady State Cardio', duration: '40 min', icon: '🚶' },
            { day: 'Thursday', workout: 'Upper Body + HIIT', duration: '50 min', icon: '🏋️' },
            { day: 'Friday', workout: 'Lower Body Strength', duration: '45 min', icon: '🦵' },
            { day: 'Saturday', workout: 'Active Recovery/Yoga', duration: '30 min', icon: '🧘' },
            { day: 'Sunday', workout: 'Rest or Light Walk', duration: '20-30 min', icon: '😴' }
          ],
          restDays: 1,
          activeDays: 6
        };
      case 'muscle':
        return {
          schedule: [
            { day: 'Monday', workout: 'Chest & Triceps', duration: '60 min', icon: '💪' },
            { day: 'Tuesday', workout: 'Back & Biceps', duration: '60 min', icon: '🔙' },
            { day: 'Wednesday', workout: 'Legs & Glutes', duration: '65 min', icon: '🦵' },
            { day: 'Thursday', workout: 'Shoulders & Arms', duration: '55 min', icon: '💪' },
            { day: 'Friday', workout: 'Chest & Back', duration: '60 min', icon: '🏋️' },
            { day: 'Saturday', workout: 'Legs & Core', duration: '60 min', icon: '🦵' },
            { day: 'Sunday', workout: 'Rest & Recovery', duration: 'Full rest', icon: '😴' }
          ],
          restDays: 1,
          activeDays: 6
        };
      case 'body recomp':
        return {
          schedule: [
            { day: 'Monday', workout: 'Upper Body Push', duration: '55 min', icon: '💪' },
            { day: 'Tuesday', workout: 'Lower Body + Cardio', duration: '50 min', icon: '🦵' },
            { day: 'Wednesday', workout: 'Active Recovery', duration: '30 min', icon: '🧘' },
            { day: 'Thursday', workout: 'Upper Body Pull', duration: '55 min', icon: '🔙' },
            { day: 'Friday', workout: 'Lower Body Heavy', duration: '55 min', icon: '🏋️' },
            { day: 'Saturday', workout: 'HIIT or Sports', duration: '40 min', icon: '🔥' },
            { day: 'Sunday', workout: 'Complete Rest', duration: 'Full rest', icon: '😴' }
          ],
          restDays: 2,
          activeDays: 5
        };
      default:
        return {
          schedule: [
            { day: 'Monday', workout: 'Full Body Strength', duration: '45 min', icon: '💪' },
            { day: 'Tuesday', workout: 'Cardio & Core', duration: '40 min', icon: '🏃' },
            { day: 'Wednesday', workout: 'Rest or Yoga', duration: '30 min', icon: '🧘' },
            { day: 'Thursday', workout: 'Upper Body', duration: '45 min', icon: '💪' },
            { day: 'Friday', workout: 'Lower Body', duration: '45 min', icon: '🦵' },
            { day: 'Saturday', workout: 'Active Fun', duration: '30-60 min', icon: '🚴' },
            { day: 'Sunday', workout: 'Full Rest', duration: 'Rest', icon: '😴' }
          ],
          restDays: 2,
          activeDays: 5
        };
    }
  };

  const weeklyWorkoutSplit = getWeeklyWorkoutSplit();

  // Heart rate zones for cardio
  const getHeartRateZones = () => {
    const maxHR = age ? 220 - age : 185;
    
    return {
      maxHR,
      zones: [
        { name: 'Recovery', range: `${Math.round(maxHR * 0.5)}-${Math.round(maxHR * 0.6)}`, percent: '50-60%', color: '#3498db', description: 'Light activity, warm-up' },
        { name: 'Fat Burn', range: `${Math.round(maxHR * 0.6)}-${Math.round(maxHR * 0.7)}`, percent: '60-70%', color: '#00d4aa', description: 'Steady cardio, fat oxidation' },
        { name: 'Cardio', range: `${Math.round(maxHR * 0.7)}-${Math.round(maxHR * 0.8)}`, percent: '70-80%', color: '#ffc107', description: 'Aerobic fitness improvement' },
        { name: 'Threshold', range: `${Math.round(maxHR * 0.8)}-${Math.round(maxHR * 0.9)}`, percent: '80-90%', color: '#ff6b35', description: 'High intensity, HIIT' },
        { name: 'Maximum', range: `${Math.round(maxHR * 0.9)}-${maxHR}`, percent: '90-100%', color: '#ff4757', description: 'Peak effort, sprints' }
      ],
      recommended: goal?.toLowerCase() === 'fat loss' ? 'Fat Burn & Threshold' : 
                   goal?.toLowerCase() === 'muscle' ? 'Recovery & Fat Burn' :
                   goal?.toLowerCase() === 'body recomp' ? 'Fat Burn & Cardio' : 'All zones'
    };
  };

  const heartRateZones = getHeartRateZones();

  // Recovery recommendations
  const getRecoveryTips = () => {
    const baseTips = [
      { icon: '🧊', title: 'Cold Exposure', desc: 'Cold showers reduce inflammation and speed recovery' },
      { icon: '🎾', title: 'Foam Rolling', desc: 'Self-myofascial release improves mobility' },
      { icon: '💆', title: 'Stretching', desc: '10-15 min daily improves flexibility' }
    ];
    
    switch(goal?.toLowerCase()) {
      case 'fat loss':
        return [
          ...baseTips,
          { icon: '🚶', title: 'Active Recovery', desc: 'Light walks on rest days burn extra calories' },
          { icon: '🧘', title: 'Yoga', desc: 'Reduces cortisol which can cause fat storage' }
        ];
      case 'muscle':
        return [
          { icon: '😴', title: 'Sleep Priority', desc: 'Growth hormone peaks during deep sleep' },
          { icon: '🍗', title: 'Post-Workout Protein', desc: 'Consume protein within 2 hours of training' },
          ...baseTips,
          { icon: '🛀', title: 'Epsom Salt Bath', desc: 'Magnesium absorption aids muscle recovery' }
        ];
      case 'body recomp':
        return [
          { icon: '⚖️', title: 'Calorie Cycling', desc: 'Higher calories on training days' },
          { icon: '😴', title: 'Sleep 8+ Hours', desc: 'Critical for both fat loss and muscle' },
          ...baseTips
        ];
      default:
        return baseTips;
    }
  };

  const recoveryTips = getRecoveryTips();

  // Supplement recommendations based on goal
  const getSupplementRecommendations = () => {
    const base = [
      { name: 'Multivitamin', priority: 'Essential', icon: '💊' },
      { name: 'Vitamin D3', priority: 'High', icon: '☀️' },
      { name: 'Omega-3', priority: 'High', icon: '🐟' }
    ];
    
    switch(goal?.toLowerCase()) {
      case 'fat loss':
        return [
          ...base,
          { name: 'Green Tea Extract', priority: 'Optional', icon: '🍵' },
          { name: 'L-Carnitine', priority: 'Optional', icon: '🔥' },
          { name: 'Caffeine', priority: 'Optional', icon: '☕' }
        ];
      case 'muscle':
        return [
          { name: 'Whey Protein', priority: 'Essential', icon: '🥛' },
          { name: 'Creatine Monohydrate', priority: 'Essential', icon: '💪' },
          ...base,
          { name: 'BCAAs', priority: 'Optional', icon: '🧪' },
          { name: 'ZMA', priority: 'Optional', icon: '😴' }
        ];
      case 'body recomp':
        return [
          { name: 'Whey Protein', priority: 'Essential', icon: '🥛' },
          { name: 'Creatine', priority: 'High', icon: '💪' },
          ...base,
          { name: 'Caffeine (pre-workout)', priority: 'Optional', icon: '☕' }
        ];
      default:
        return base;
    }
  };

  const supplementRecommendations = getSupplementRecommendations();

  // Meal timing recommendations
  const getMealTiming = () => {
    switch(goal?.toLowerCase()) {
      case 'fat loss':
        return {
          meals: 3,
          snacks: 1,
          timing: [
            { meal: 'Breakfast', time: '8:00 AM', notes: 'High protein, moderate carbs' },
            { meal: 'Lunch', time: '12:30 PM', notes: 'Largest meal, balanced macros' },
            { meal: 'Snack', time: '4:00 PM', notes: 'Protein + fiber (optional)' },
            { meal: 'Dinner', time: '7:00 PM', notes: 'Light, protein-focused' }
          ],
          fastingWindow: '8PM - 8AM (12 hours)',
          tip: 'Consider 16:8 intermittent fasting for enhanced fat loss'
        };
      case 'muscle':
        return {
          meals: 4,
          snacks: 2,
          timing: [
            { meal: 'Breakfast', time: '7:00 AM', notes: 'High protein + carbs' },
            { meal: 'Pre-Workout', time: '11:00 AM', notes: 'Carbs + moderate protein' },
            { meal: 'Post-Workout', time: '2:00 PM', notes: 'Fast protein + carbs' },
            { meal: 'Dinner', time: '6:00 PM', notes: 'Protein + carbs + fats' },
            { meal: 'Pre-Sleep', time: '9:00 PM', notes: 'Casein protein or cottage cheese' }
          ],
          fastingWindow: 'Not recommended',
          tip: 'Spread protein evenly across meals (30-40g each)'
        };
      case 'body recomp':
        return {
          meals: 4,
          snacks: 1,
          timing: [
            { meal: 'Breakfast', time: '8:00 AM', notes: 'Protein-rich start' },
            { meal: 'Lunch', time: '12:00 PM', notes: 'Balanced macros' },
            { meal: 'Pre/Post Workout', time: '4:00 PM', notes: 'Carbs around training' },
            { meal: 'Dinner', time: '7:30 PM', notes: 'Protein + vegetables' }
          ],
          fastingWindow: 'Optional 14:10 on rest days',
          tip: 'Eat more carbs on training days, fewer on rest days'
        };
      default:
        return {
          meals: 3,
          snacks: 2,
          timing: [
            { meal: 'Breakfast', time: '8:00 AM', notes: 'Balanced start' },
            { meal: 'Lunch', time: '12:30 PM', notes: 'Moderate portions' },
            { meal: 'Dinner', time: '7:00 PM', notes: 'Light and nutritious' }
          ],
          fastingWindow: 'Natural overnight fast',
          tip: 'Eat at consistent times each day'
        };
    }
  };

  const mealTiming = getMealTiming();

  // Progress milestones based on goal
  const getProgressMilestones = () => {
    switch(goal?.toLowerCase()) {
      case 'fat loss':
        return [
          { week: 1, milestone: 'Establish routine, track everything', icon: '📝' },
          { week: 2, milestone: 'Notice reduced cravings', icon: '🎯' },
          { week: 4, milestone: 'Visible changes, clothes fit better', icon: '👔' },
          { week: 8, milestone: 'Significant transformation', icon: '🔥' },
          { week: 12, milestone: 'Goal weight achievable', icon: '🏆' }
        ];
      case 'muscle':
        return [
          { week: 1, milestone: 'Learn proper form', icon: '📚' },
          { week: 4, milestone: 'Strength gains noticeable', icon: '💪' },
          { week: 8, milestone: 'Visible muscle definition', icon: '👀' },
          { week: 12, milestone: 'Significant size increase', icon: '📈' },
          { week: 24, milestone: 'Major transformation', icon: '🏆' }
        ];
      case 'body recomp':
        return [
          { week: 2, milestone: 'Routine established', icon: '📝' },
          { week: 6, milestone: 'Scale stable, body changing', icon: '⚖️' },
          { week: 12, milestone: 'Clothes fit differently', icon: '👔' },
          { week: 16, milestone: 'Clear visual progress', icon: '📸' },
          { week: 24, milestone: 'Full body recomposition', icon: '🏆' }
        ];
      default:
        return [
          { week: 1, milestone: 'Start moving daily', icon: '🚶' },
          { week: 4, milestone: 'Energy levels improve', icon: '⚡' },
          { week: 8, milestone: 'Fitness becomes habit', icon: '✅' },
          { week: 12, milestone: 'Measurable improvements', icon: '📊' }
        ];
    }
  };

  const progressMilestones = getProgressMilestones();

  // Get today's date as a number for rotating tips
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

  // Get personalized trainer tips based on goal, age, and weight - CHANGES DAILY!
  const getTrainerTips = () => {
    const allTips = {
      'fat loss': [
        "🔥 Focus on high-protein, low-calorie foods like chicken breast, fish, and egg whites",
        "💧 Drink at least 3-4 liters of water daily to boost metabolism",
        "🥗 Fill half your plate with vegetables for fiber and fullness",
        "⏰ Try intermittent fasting - eat within an 8-hour window",
        "🚶 Take a 15-minute walk after each meal to aid digestion and burn calories",
        "🍵 Green tea can boost your metabolism - try 2-3 cups daily",
        "🥒 Snack on cucumbers, celery, or carrots when hungry between meals",
        "🍳 Start your day with protein - it reduces cravings throughout the day",
        "🚫 Avoid liquid calories - sodas and juices add up fast",
        "😴 Poor sleep increases hunger hormones - aim for 7-8 hours",
        "🥄 Use smaller plates - it tricks your brain into feeling satisfied",
        "📝 Track everything you eat - awareness is the first step to change",
        "🏋️ Add strength training - muscle burns more calories at rest",
        "🍽️ Eat slowly and chew thoroughly - it takes 20 min to feel full",
        "🥑 Don't fear healthy fats - they keep you satisfied longer"
      ],
      'muscle': [
        "💪 Eat protein within 30 minutes after your workout for best results",
        "🍚 Don't skip carbs! They fuel your workouts and muscle growth",
        "🥚 Include a protein source in every meal (eggs, chicken, fish, paneer)",
        "😴 Get 7-8 hours of sleep - muscles grow during rest!",
        "🏋️ Progressive overload is key - increase weights gradually",
        "🍌 Eat a banana before workout for quick energy",
        "🥛 Consider a casein protein shake before bed for overnight muscle repair",
        "💧 Dehydration reduces strength by up to 25% - drink up!",
        "🍗 Aim for 4-6 protein-rich meals spread throughout the day",
        "🥩 Red meat is great for muscle - rich in iron and creatine",
        "🧘 Don't skip rest days - overtraining hurts muscle growth",
        "🥜 Nuts and nut butters are calorie-dense perfect for gaining mass",
        "⏰ Train each muscle group 2x per week for optimal growth",
        "🎯 Focus on compound lifts - squats, deadlifts, bench press",
        "📊 Track your lifts - what gets measured gets improved"
      ],
      'general fitness': [
        "🏃 Aim for 150 minutes of moderate exercise per week",
        "🥗 Eat a balanced diet with all food groups",
        "💧 Stay hydrated - drink 2-3 liters of water daily",
        "🍎 Include fruits and vegetables in every meal",
        "🚶 Take the stairs instead of the elevator",
        "🧘 Try yoga or stretching for flexibility and stress relief",
        "🚴 Mix cardio and strength training for overall fitness",
        "😴 Consistent sleep schedule improves energy levels",
        "🥜 Healthy snacks keep your metabolism active",
        "📱 Set hourly reminders to stand and stretch if you sit a lot",
        "🎵 Music can boost workout performance by up to 15%",
        "👥 Find a workout buddy for accountability and motivation",
        "🌅 Morning workouts boost energy for the entire day",
        "🍽️ Meal prep on weekends saves time and ensures healthy eating",
        "🎯 Set small, achievable weekly goals to stay motivated"
      ],
      'body recomp': [
        "⚖️ Body recomp needs patience - trust the process!",
        "💪 Prioritize protein intake to build muscle while losing fat",
        "🏋️ Lift heavy - strength training is key for recomposition",
        "📊 Scale weight may not change much - track measurements instead",
        "🍗 Eat protein with every meal - aim for 4-5 servings daily",
        "⏰ Timing matters - eat more on training days, less on rest days",
        "😴 Sleep is crucial - aim for 7-9 hours for optimal results",
        "🔄 Cycle calories: higher on workout days, lower on rest days",
        "📸 Take progress photos weekly - the mirror tells the truth",
        "🎯 Focus on getting stronger - muscle will come with strength",
        "🥩 Don't fear protein - you need 2g per kg bodyweight minimum",
        "💧 Stay hydrated - water helps with nutrient transport",
        "🧠 Recomp is a marathon, not a sprint - be consistent",
        "🏃 Keep cardio moderate - too much can hinder muscle growth",
        "📈 Track your lifts - progressive overload drives results"
      ]
    };

    const ageSpecificTips = {
      young: [
        "🌱 Your body is still growing - never skip meals!",
        "🏃 Your recovery is fast - take advantage with consistent training",
        "📚 Build good habits now - they'll last a lifetime",
        "🥛 Calcium is crucial at your age - include dairy or fortified foods"
      ],
      prime: [
        "⚡ This is your prime time - push hard and build good habits!",
        "💼 Busy schedule? Try 20-minute high-intensity workouts",
        "🎯 Set ambitious goals - your body can handle the challenge",
        "🧠 Exercise boosts brain function - great for your career!"
      ],
      experienced: [
        "🎯 Focus on consistency over intensity - sustainable habits win!",
        "🧘 Include mobility work to prevent injuries",
        "⚖️ Metabolism slows down - watch portion sizes",
        "💪 Strength training prevents age-related muscle loss"
      ],
      wise: [
        "🧘 Include flexibility exercises and prioritize recovery",
        "🚶 Low-impact exercises like swimming and walking are excellent",
        "🦴 Weight-bearing exercises help maintain bone density",
        "❤️ Regular exercise keeps your heart healthy and strong"
      ]
    };

    const weightTips = {
      underweight: [
        "📈 Focus on caloric surplus with clean, nutrient-dense foods",
        "🥜 Add healthy calorie-dense foods like nuts, avocados, and olive oil",
        "🍚 Don't skip carbs - they're essential for gaining healthy weight"
      ],
      overweight: [
        "🎯 Focus on lean protein sources to preserve muscle while losing fat",
        "📉 Create a moderate calorie deficit - crash diets don't work long-term",
        "🏋️ Strength training helps prevent muscle loss during weight loss"
      ]
    };

    // Get goal-specific tips
    const goalKey = goal?.toLowerCase() || 'general fitness';
    const goalTips = allTips[goalKey] || allTips['general fitness'];
    
    // Get age-specific tips
    let ageTips = [];
    if (age) {
      if (age < 20) ageTips = ageSpecificTips.young;
      else if (age < 30) ageTips = ageSpecificTips.prime;
      else if (age < 45) ageTips = ageSpecificTips.experienced;
      else ageTips = ageSpecificTips.wise;
    }

    // Get weight-specific tips
    let weightTipsList = [];
    if (weightNum) {
      if (weightNum < 55) weightTipsList = weightTips.underweight;
      else if (weightNum > 85) weightTipsList = weightTips.overweight;
    }

    // Combine all tips
    const allAvailableTips = [...goalTips, ...ageTips, ...weightTipsList];
    
    // Shuffle based on day of year so tips change daily but are consistent throughout the day
    const shuffled = allAvailableTips.sort((a, b) => {
      const hashA = (a.charCodeAt(0) + dayOfYear) % allAvailableTips.length;
      const hashB = (b.charCodeAt(0) + dayOfYear) % allAvailableTips.length;
      return hashA - hashB;
    });

    // Return top 4 tips for today
    return shuffled.slice(0, 4);
  };

  const trainerTips = getTrainerTips();

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

  // Check if a food entry contains a valid food name
  const isValidFoodEntry = useCallback((entry) => {
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
  }, []);

  // Filter suggestions based on input
  const getSuggestions = useCallback((input) => {
    if (!input) return [];
    const inputLower = input.toLowerCase();
    return foodNames.filter(name => name.toLowerCase().includes(inputLower)).slice(0, 8);
  }, [foodNames]);

  const calculateMeal = useCallback((label, foods) => {
    const resultArr = [];
    foods.filter(f => f.trim()).forEach(food => {
      resultArr.push({ time: label, ...parseFoodEntry(food) });
    });
    return resultArr;
  }, []);

  // Check if at least one food is entered
  const hasAnyFood = () => {
    return morningFoods.some(f => f.trim()) || 
           eveningFoods.some(f => f.trim()) || 
           postEveningFoods.some(f => f.trim()) || 
           nightFoods.some(f => f.trim());
  };

  // Check if any valid food is entered for total calculation
  const hasAnyValidFood = () => {
    return morningFoods.some(f => isValidFoodEntry(f)) || 
           eveningFoods.some(f => isValidFoodEntry(f)) || 
           postEveningFoods.some(f => isValidFoodEntry(f)) || 
           nightFoods.some(f => isValidFoodEntry(f));
  };

  // Motivational quotes
  const quotes = [
    { text: "The only bad workout is the one that didn't happen.", author: "Rithi" },
    { text: "Take care of your body. It's the only place you have to live.", author: "Rithi" },
    { text: "Fitness is not about being better than someone else. It's about being better than you used to be.", author: "Rithi" },
    { text: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Rithi" },
    { text: "Success isn't always about greatness. It's about consistency.", author: "Rithi" },
    { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Rithi" },
    { text: "Don't wish for a good body, work for it.", author: "Rithi" },
    { text: "Your health is an investment, not an expense.", author: "Rithi" },
    { text: "Sweat is just fat crying.", author: "Rithi" },
    { text: "The hardest lift of all is lifting your butt off the couch.", author: "Rithi" },
    { text: "Eat clean, train dirty.", author: "Rithi" },
    { text: "Sore today, strong tomorrow.", author: "Rithi" },
    { text: "If it doesn't challenge you, it won't change you.", author: "Rithi" },
    { text: "Champions are made when no one is watching.", author: "Rithi" },
    { text: "The body achieves what the mind believes.", author: "Rithi" },
    { text: "Discipline is choosing between what you want now and what you want most.", author: "Rithi" },
    { text: "No excuses, just results.", author: "Rithi" },
    { text: "The only way to finish is to start.", author: "Rithi" },
    { text: "Be stronger than your excuses.", author: "Rithi" },
    { text: "Progress, not perfection.", author: "Rithi" }
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // Get goal icon
  const getGoalIcon = () => {
    switch(goal?.toLowerCase()) {
      case 'fat loss': return '🔥';
      case 'muscle': return '💪';
      case 'body recomp': return '⚖️';
      case 'general fitness': return '🏃';
      default: return '🎯';
    }
  };

  return (
    <div className="dashboard">
      {/* Profile Modal */}
      {showProfile && (
        <div className="profile-modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2>👤 My Profile</h2>
              <button className="profile-close-btn" onClick={() => setShowProfile(false)}>✕</button>
            </div>
            <div className="profile-modal-content">
              <div className="profile-avatar-large">
                {username ? username.charAt(0).toUpperCase() : '👤'}
              </div>
              <div className="profile-info-list">
                <div className="profile-info-item">
                  <span className="profile-info-icon">👤</span>
                  <div className="profile-info-details">
                    <span className="profile-info-label">Name</span>
                    <span className="profile-info-value">{username || 'Not set'}</span>
                  </div>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-icon">🎂</span>
                  <div className="profile-info-details">
                    <span className="profile-info-label">Age</span>
                    <span className="profile-info-value">{age ? `${age} years old` : 'Not set'}</span>
                  </div>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-icon">📅</span>
                  <div className="profile-info-details">
                    <span className="profile-info-label">Date of Birth</span>
                    <span className="profile-info-value">{dob ? new Date(dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set'}</span>
                  </div>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-icon">⚖️</span>
                  <div className="profile-info-details">
                    <span className="profile-info-label">Weight</span>
                    <span className="profile-info-value">{weightNum ? `${weightNum} kg` : 'Not set'}</span>
                  </div>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-icon">{getGoalIcon()}</span>
                  <div className="profile-info-details">
                    <span className="profile-info-label">Fitness Goal</span>
                    <span className="profile-info-value">{goal ? goal.charAt(0).toUpperCase() + goal.slice(1) : 'Not set'}</span>
                  </div>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-icon">🎯</span>
                  <div className="profile-info-details">
                    <span className="profile-info-label">Daily Protein Target</span>
                    <span className="profile-info-value">{proteinGoal.recommended}g ({proteinGoal.min}g - {proteinGoal.max}g)</span>
                  </div>
                </div>
              </div>
              <button className="profile-logout-btn" onClick={onLogout}>
                <span>🚪</span> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, <span>{username || 'Champion'}!</span></h1>
          <p>Ready to crush your fitness goals today? Let's track your nutrition.</p>
        </div>
        <div className="header-actions">
          {goal && (
            <div className="goal-badge">
              <span className="goal-badge-icon">{getGoalIcon()}</span>
              {goal.charAt(0).toUpperCase() + goal.slice(1)}
            </div>
          )}
          <button className="profile-icon-btn" onClick={() => setShowProfile(true)} title="View Profile">
            <span className="profile-avatar">{username ? username.charAt(0).toUpperCase() : '👤'}</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{proteinGoal.recommended}g</div>
          <div className="stat-label">Protein Goal</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{results ? results.reduce((acc, r) => acc + r.protein, 0).toFixed(0) : '0'}g</div>
          <div className="stat-label">Consumed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-value">{morningFoods.filter(f => f.trim()).length + eveningFoods.filter(f => f.trim()).length + postEveningFoods.filter(f => f.trim()).length + nightFoods.filter(f => f.trim()).length}</div>
          <div className="stat-label">Foods Logged</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">{results ? Math.round((results.reduce((acc, r) => acc + r.protein, 0) / proteinGoal.recommended) * 100) : 0}%</div>
          <div className="stat-label">Progress</div>
        </div>
      </div>

      {/* Food Tracker Quick Action Button */}
      <div className="quick-action-container">
        <button 
          className="food-tracker-btn" 
          onClick={() => {
            setShowFoodTracker(!showFoodTracker);
            if (!showFoodTracker) {
              setTimeout(() => foodTrackerRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            }
          }}
        >
          <span className="food-tracker-btn-icon">🍴</span>
          <div className="food-tracker-btn-content">
            <span className="food-tracker-btn-title">Food Tracker</span>
            <span className="food-tracker-btn-subtitle">Log your meals and track your nutrition</span>
          </div>
          <span className="food-tracker-btn-arrow">{showFoodTracker ? '↓' : '→'}</span>
        </button>
      </div>

      {/* Personal Trainer Card */}
      <div className="trainer-card">
        <div className="trainer-header">
          <div className="trainer-avatar">🏋️</div>
          <div>
            <h3 className="trainer-title">Your Personal Trainer</h3>
            <p className="trainer-subtitle">Personalized insights based on your profile</p>
          </div>
        </div>

        {/* User Stats */}
        <div className="user-stats">
          {weightNum > 0 && (
            <div className="user-stat-item">
              <span className="user-stat-icon">⚖️</span>
              <span className="user-stat-value">{weightNum} kg</span>
              <span className="user-stat-label">Weight</span>
            </div>
          )}
          {age && (
            <div className="user-stat-item">
              <span className="user-stat-icon">🎂</span>
              <span className="user-stat-value">{age} yrs</span>
              <span className="user-stat-label">Age</span>
            </div>
          )}
          {goal && (
            <div className="user-stat-item">
              <span className="user-stat-icon">{getGoalIcon()}</span>
              <span className="user-stat-value">{goal.charAt(0).toUpperCase() + goal.slice(1)}</span>
              <span className="user-stat-label">Goal</span>
            </div>
          )}
        </div>

        {/* Protein Goal */}
        {proteinGoal.recommended > 0 && (
          <div className="protein-goal-card">
            <div className="protein-goal-header">
              <span className="protein-goal-icon">🎯</span>
              <h4>Today's Protein Target</h4>
            </div>
            <div className="protein-goal-value">
              <span className="protein-main">{proteinGoal.recommended}g</span>
              <span className="protein-range">Range: {proteinGoal.min}g - {proteinGoal.max}g</span>
            </div>
            <div className="protein-progress-bar">
              <div 
                className="protein-progress-fill"
                style={{ 
                  width: `${Math.min((results ? results.reduce((acc, r) => acc + r.protein, 0) : 0) / proteinGoal.recommended * 100, 100)}%` 
                }}
              ></div>
            </div>
            <p className="protein-status">
              {results ? (
                <>
                  You've consumed <strong>{results.reduce((acc, r) => acc + r.protein, 0).toFixed(1)}g</strong> protein 
                  ({Math.round((results.reduce((acc, r) => acc + r.protein, 0) / proteinGoal.recommended) * 100)}% of daily goal)
                </>
              ) : (
                'Start logging your meals to track protein intake'
              )}
            </p>
          </div>
        )}

        {/* Calorie Target */}
        {calorieTarget.recommended > 0 && (
          <div className="calorie-target-card">
            <div className="calorie-target-header">
              <span className="calorie-target-icon">🔥</span>
              <h4>Daily Calorie Target</h4>
            </div>
            <div className="calorie-target-value">
              <span className="calorie-main">{calorieTarget.recommended} kcal</span>
              <span className="calorie-range">Range: {calorieTarget.min} - {calorieTarget.max} kcal</span>
            </div>
            <p className="calorie-description">{calorieTarget.description}</p>
            {calorieTarget.deficit !== 0 && (
              <span className={`calorie-badge ${calorieTarget.deficit > 0 ? 'surplus' : 'deficit'}`}>
                {calorieTarget.deficit > 0 ? `+${calorieTarget.deficit}` : calorieTarget.deficit} kcal/day
              </span>
            )}
          </div>
        )}

        {/* Macro Split */}
        <div className="macro-split-card">
          <div className="macro-split-header">
            <span className="macro-split-icon">📊</span>
            <h4>Recommended Macro Split</h4>
          </div>
          <p className="macro-description">{macroSplit.description}</p>
          <div className="macro-bars">
            <div className="macro-bar-item">
              <div className="macro-bar-label">
                <span>🥩 Protein</span>
                <span>{macroSplit.protein}%</span>
              </div>
              <div className="macro-bar-track">
                <div className="macro-bar-fill protein-fill" style={{ width: `${macroSplit.protein}%` }}></div>
              </div>
            </div>
            <div className="macro-bar-item">
              <div className="macro-bar-label">
                <span>🍚 Carbs</span>
                <span>{macroSplit.carbs}%</span>
              </div>
              <div className="macro-bar-track">
                <div className="macro-bar-fill carbs-fill" style={{ width: `${macroSplit.carbs}%` }}></div>
              </div>
            </div>
            <div className="macro-bar-item">
              <div className="macro-bar-label">
                <span>🥑 Fat</span>
                <span>{macroSplit.fat}%</span>
              </div>
              <div className="macro-bar-track">
                <div className="macro-bar-fill fat-fill" style={{ width: `${macroSplit.fat}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Workout Plan */}
        <div className="workout-plan-card">
          <div className="workout-plan-header">
            <span className="workout-plan-icon">🏋️</span>
            <h4>Your Workout Plan</h4>
          </div>
          <div className="workout-focus">
            <span className="focus-label">Focus:</span>
            <span className="focus-value">{workoutPlan.focus}</span>
          </div>
          <div className="workout-schedule">
            <div className="schedule-item">
              <span className="schedule-icon">🏃</span>
              <span className="schedule-label">Cardio:</span>
              <span className="schedule-value">{workoutPlan.cardio}</span>
            </div>
            <div className="schedule-item">
              <span className="schedule-icon">💪</span>
              <span className="schedule-label">Strength:</span>
              <span className="schedule-value">{workoutPlan.strength}</span>
            </div>
          </div>
          <ul className="workout-tips">
            {workoutPlan.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>

      </div>

      {/* Fitness Metrics Section */}
      <div className="fitness-metrics-section">
        <div className="section-header">
          <div className="section-icon">📊</div>
          <div>
            <h2 className="section-title">Your Fitness Metrics</h2>
            <p className="section-subtitle">Personalized targets based on your profile</p>
          </div>
        </div>

        <div className="metrics-grid">
          {/* Water Intake Card */}
          <div className="metric-card water-card">
            <div className="metric-header">
              <span className="metric-icon">💧</span>
              <h4>Daily Water Intake</h4>
            </div>
            <div className="metric-value-large water-value">
              {waterIntake.recommended}L
            </div>
            <div className="metric-range">
              Range: {waterIntake.min}L - {waterIntake.max}L
            </div>
            <p className="metric-tip">{waterIntake.tip}</p>
          </div>

          {/* Sleep Card */}
          <div className="metric-card sleep-card">
            <div className="metric-header">
              <span className="metric-icon">😴</span>
              <h4>Sleep Target</h4>
            </div>
            <div className="metric-value-large sleep-value">
              {sleepRecommendation.recommended}h
            </div>
            <div className="metric-range">
              Optimal: {sleepRecommendation.min}-{sleepRecommendation.max} hours
            </div>
            <p className="metric-tip">{sleepRecommendation.quality}</p>
          </div>

          {/* Fiber Card */}
          <div className="metric-card fiber-card">
            <div className="metric-header">
              <span className="metric-icon">🥬</span>
              <h4>Daily Fiber Goal</h4>
            </div>
            <div className="metric-value-large fiber-value">
              {fiberGoal.recommended}g
            </div>
            <div className="metric-range">
              Range: {fiberGoal.min}g - {fiberGoal.max}g
            </div>
            <p className="metric-tip">{fiberGoal.tip}</p>
          </div>
        </div>
      </div>

      {/* Weekly Workout Schedule */}
      <div className="weekly-schedule-section">
        <div className="section-header">
          <div className="section-icon">📅</div>
          <div>
            <h2 className="section-title">Weekly Workout Schedule</h2>
            <p className="section-subtitle">{weeklyWorkoutSplit.activeDays} training days, {weeklyWorkoutSplit.restDays} rest day(s)</p>
          </div>
        </div>

        <div className="weekly-schedule-grid">
          {weeklyWorkoutSplit.schedule.map((day, idx) => (
            <div key={idx} className={`schedule-day-card ${day.workout.includes('Rest') ? 'rest-day' : ''}`}>
              <div className="day-name">{day.day}</div>
              <div className="day-icon">{day.icon}</div>
              <div className="day-workout">{day.workout}</div>
              <div className="day-duration">{day.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Heart Rate Zones */}
      <div className="heart-rate-section">
        <div className="section-header">
          <div className="section-icon">❤️</div>
          <div>
            <h2 className="section-title">Heart Rate Training Zones</h2>
            <p className="section-subtitle">Max HR: {heartRateZones.maxHR} BPM | Recommended: {heartRateZones.recommended}</p>
          </div>
        </div>

        <div className="hr-zones-container">
          {heartRateZones.zones.map((zone, idx) => (
            <div key={idx} className="hr-zone-card" style={{ borderLeftColor: zone.color }}>
              <div className="hr-zone-header">
                <span className="hr-zone-name" style={{ color: zone.color }}>{zone.name}</span>
                <span className="hr-zone-percent">{zone.percent}</span>
              </div>
              <div className="hr-zone-range">{zone.range} BPM</div>
              <div className="hr-zone-desc">{zone.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Timing */}
      <div className="meal-timing-section">
        <div className="section-header">
          <div className="section-icon">⏰</div>
          <div>
            <h2 className="section-title">Optimal Meal Timing</h2>
            <p className="section-subtitle">{mealTiming.meals} meals + {mealTiming.snacks} snack(s) | Fasting: {mealTiming.fastingWindow}</p>
          </div>
        </div>

        <div className="meal-timing-grid">
          {mealTiming.timing.map((meal, idx) => (
            <div key={idx} className="meal-timing-card">
              <div className="meal-timing-time">{meal.time}</div>
              <div className="meal-timing-name">{meal.meal}</div>
              <div className="meal-timing-notes">{meal.notes}</div>
            </div>
          ))}
        </div>
        <div className="meal-timing-tip">💡 {mealTiming.tip}</div>
      </div>

      {/* Recovery Tips */}
      <div className="recovery-section">
        <div className="section-header">
          <div className="section-icon">🔄</div>
          <div>
            <h2 className="section-title">Recovery Recommendations</h2>
            <p className="section-subtitle">Optimize your rest for better results</p>
          </div>
        </div>

        <div className="recovery-grid">
          {recoveryTips.map((tip, idx) => (
            <div key={idx} className="recovery-card">
              <span className="recovery-icon">{tip.icon}</span>
              <div className="recovery-content">
                <h4>{tip.title}</h4>
                <p>{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supplements */}
      <div className="supplements-section">
        <div className="section-header">
          <div className="section-icon">💊</div>
          <div>
            <h2 className="section-title">Supplement Guide</h2>
            <p className="section-subtitle">Recommended for your {goal || 'fitness'} goal</p>
          </div>
        </div>

        <div className="supplements-grid">
          {supplementRecommendations.map((supp, idx) => (
            <div key={idx} className={`supplement-card priority-${supp.priority.toLowerCase()}`}>
              <span className="supplement-icon">{supp.icon}</span>
              <div className="supplement-name">{supp.name}</div>
              <div className={`supplement-priority ${supp.priority.toLowerCase()}`}>{supp.priority}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Milestones */}
      <div className="milestones-section">
        <div className="section-header">
          <div className="section-icon">🏆</div>
          <div>
            <h2 className="section-title">Your Progress Journey</h2>
            <p className="section-subtitle">What to expect on your fitness path</p>
          </div>
        </div>

        <div className="milestones-timeline">
          {progressMilestones.map((milestone, idx) => (
            <div key={idx} className="milestone-item">
              <div className="milestone-marker">
                <span className="milestone-icon">{milestone.icon}</span>
              </div>
              <div className="milestone-content">
                <div className="milestone-week">Week {milestone.week}</div>
                <div className="milestone-text">{milestone.milestone}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="quote-card">
        <p className="quote-text">{randomQuote.text}</p>
        <p className="quote-author">— {randomQuote.author}</p>
      </div>

      {/* Food Tracker Section */}
      {showFoodTracker && (
        <div className="food-tracker-section" ref={foodTrackerRef}>
          <div className="section-header">
            <div className="section-icon">🍴</div>
            <div>
              <h2 className="section-title">Food Tracker</h2>
              <p className="section-subtitle">Log your meals and track your nutrition</p>
            </div>
          </div>

          <MealSection 
          label="Morning" 
          foods={morningFoods} 
          setFoods={setMorningFoods} 
          placeholder="e.g., egg 3, brown bread 2, milk 200" 
          mealClass="meal-morning"
          icon="🌅"
          time="6:00 AM - 10:00 AM"
          getSuggestions={getSuggestions}
          isValidFoodEntry={isValidFoodEntry}
          calculateMeal={calculateMeal}
        />
        <MealSection 
          label="Evening" 
          foods={eveningFoods} 
          setFoods={setEveningFoods} 
          placeholder="e.g., rice 200, chicken 150, dal 100" 
          mealClass="meal-evening"
          icon="☀️"
          time="12:00 PM - 2:00 PM"
          getSuggestions={getSuggestions}
          isValidFoodEntry={isValidFoodEntry}
          calculateMeal={calculateMeal}
        />
        <MealSection 
          label="Post Evening" 
          foods={postEveningFoods} 
          setFoods={setPostEveningFoods} 
          placeholder="e.g., banana 2, almonds 30" 
          mealClass="meal-post-evening"
          icon="🌆"
          time="4:00 PM - 6:00 PM"
          getSuggestions={getSuggestions}
          isValidFoodEntry={isValidFoodEntry}
          calculateMeal={calculateMeal}
        />
        <MealSection 
          label="Night" 
          foods={nightFoods} 
          setFoods={setNightFoods} 
          placeholder="e.g., chapathi 3, paneer 100" 
          mealClass="meal-night"
          icon="🌙"
          time="7:00 PM - 9:00 PM"
          getSuggestions={getSuggestions}
          isValidFoodEntry={isValidFoodEntry}
          calculateMeal={calculateMeal}
        />

        {/* Trainer Tips */}
        <div className="trainer-tips">
          <div className="tips-header">
            <h4><span>💡</span> Today's Tips for You</h4>
            <span className="tips-date">🔄 {today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
          <ul className="tips-list">
            {trainerTips.map((tip, idx) => (
              <li key={idx} className="tip-item">{tip}</li>
            ))}
          </ul>
          <p className="tips-refresh-note">✨ New personalized tips every day!</p>
        </div>

        {hasAnyValidFood() && (
          <button 
            className="btn btn-primary btn-lg"
            style={{ marginTop: '24px' }}
            onClick={handleCalculate}
          >
            <span>📊</span> Calculate Total Nutrition
          </button>
        )}
        </div>
      )}

      {results && <FoodResultsDashboard results={results} />}
    </div>
  );
}

export default Dashboard;
