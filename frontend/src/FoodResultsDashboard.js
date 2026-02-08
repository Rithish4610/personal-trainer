import React from 'react';

function FoodResultsDashboard({ results }) {
  // Calculate totals
  const totals = results.reduce((acc, item) => ({
    protein: acc.protein + item.protein,
    carbs: acc.carbs + item.carbs,
    fiber: acc.fiber + item.fiber,
    fat: acc.fat + item.fat
  }), { protein: 0, carbs: 0, fiber: 0, fat: 0 });

  // Get time icon
  const getTimeIcon = (time) => {
    switch(time) {
      case 'Breakfast': return '🌅';
      case 'Lunch': return '☀️';
      case 'Post Lunch': return '🌆';
      case 'Dinner': return '🌙';
      default: return '🍽️';
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <div className="section-header">
        <div className="section-icon">📊</div>
        <div>
          <h2 className="section-title">Daily Nutrition Summary</h2>
          <p className="section-subtitle">Complete breakdown of your daily intake</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>🥩</div>
          <div className="stat-value">{totals.protein.toFixed(1)}g</div>
          <div className="stat-label">Total Protein</div>
          <div style={{ 
            marginTop: '10px', 
            height: '4px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${Math.min(totals.protein / 150 * 100, 100)}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #ff6b35, #f7931e)',
              borderRadius: '2px',
              transition: 'width 0.5s ease'
            }}></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #00d4aa, #00b894)' }}>🍞</div>
          <div className="stat-value">{totals.carbs.toFixed(1)}g</div>
          <div className="stat-label">Total Carbs</div>
          <div style={{ 
            marginTop: '10px', 
            height: '4px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${Math.min(totals.carbs / 300 * 100, 100)}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #00d4aa, #00b894)',
              borderRadius: '2px',
              transition: 'width 0.5s ease'
            }}></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)' }}>🥬</div>
          <div className="stat-value">{totals.fiber.toFixed(1)}g</div>
          <div className="stat-label">Total Fiber</div>
          <div style={{ 
            marginTop: '10px', 
            height: '4px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${Math.min(totals.fiber / 30 * 100, 100)}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #6c5ce7, #a29bfe)',
              borderRadius: '2px',
              transition: 'width 0.5s ease'
            }}></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fdcb6e, #f39c12)' }}>🧈</div>
          <div className="stat-value">{totals.fat.toFixed(1)}g</div>
          <div className="stat-label">Total Fat</div>
          <div style={{ 
            marginTop: '10px', 
            height: '4px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${Math.min(totals.fat / 65 * 100, 100)}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #fdcb6e, #f39c12)',
              borderRadius: '2px',
              transition: 'width 0.5s ease'
            }}></div>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="results-container">
        <table className="results-table">
          <thead>
            <tr>
              <th>Meal</th>
              <th>Food Item</th>
              <th style={{ textAlign: 'right' }}>Protein</th>
              <th style={{ textAlign: 'right' }}>Carbs</th>
              <th style={{ textAlign: 'right' }}>Fiber</th>
              <th style={{ textAlign: 'right' }}>Fat</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <span style={{ marginRight: '8px' }}>{getTimeIcon(row.time)}</span>
                  {row.time}
                </td>
                <td style={{ fontWeight: '500' }}>{row.food}</td>
                <td style={{ textAlign: 'right' }}>{row.protein}g</td>
                <td style={{ textAlign: 'right' }}>{row.carbs}g</td>
                <td style={{ textAlign: 'right' }}>{row.fiber}g</td>
                <td style={{ textAlign: 'right' }}>{row.fat}g</td>
              </tr>
            ))}
            <tr className="results-total">
              <td colSpan="2"><strong>🎯 Daily Total</strong></td>
              <td style={{ textAlign: 'right' }}><strong>{totals.protein.toFixed(2)}g</strong></td>
              <td style={{ textAlign: 'right' }}><strong>{totals.carbs.toFixed(2)}g</strong></td>
              <td style={{ textAlign: 'right' }}><strong>{totals.fiber.toFixed(2)}g</strong></td>
              <td style={{ textAlign: 'right' }}><strong>{totals.fat.toFixed(2)}g</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FoodResultsDashboard;
