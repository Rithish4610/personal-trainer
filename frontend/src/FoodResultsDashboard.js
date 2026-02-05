import React from 'react';

function FoodResultsDashboard({ results }) {
  return (
    <div style={{marginTop: '32px'}}>
      <h2>Food Nutrient Breakdown</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Time</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Food</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Protein (g)</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Carbs (g)</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Fiber (g)</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Fat (g)</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{row.time}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{row.food}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{row.protein}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{row.carbs}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{row.fiber}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{row.fat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FoodResultsDashboard;
