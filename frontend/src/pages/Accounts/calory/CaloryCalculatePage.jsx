import React, { useState } from 'react';
import BaseLayout from '../AccountPage';

const CalorieCalculator = () => {
  const [unit, setUnit] = useState('Imperial');
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weight, setWeight] = useState('');
  const [bmr, setBmr] = useState(null);
  const [tdee, setTdee] = useState(null);

  const calculateCalories = () => {
    let bmrValue = 0;
    const heightInInches = unit === 'Imperial' ? (parseFloat(heightFt) * 12 + parseFloat(heightIn)) : parseFloat(heightIn) / 2.54;
    const weightInPounds = unit === 'Imperial' ? parseFloat(weight) : parseFloat(weight) * 2.20462;

    if (sex === 'Male') {
      if (unit === 'Imperial') {
        bmrValue = 66 + (6.23 * weightInPounds) + (12.7 * heightInInches) - (6.8 * parseFloat(age));
      } else {
        bmrValue = 88.362 + (13.397 * parseFloat(weight)) + (4.799 * heightInInches * 2.54) - (5.677 * parseFloat(age));
      }
    } else if (sex === 'Female') {
      if (unit === 'Imperial') {
        bmrValue = 655 + (4.35 * weightInPounds) + (4.7 * heightInInches) - (4.7 * parseFloat(age));
      } else {
        bmrValue = 447.593 + (9.247 * parseFloat(weight)) + (3.098 * heightInInches * 2.54) - (4.330 * parseFloat(age));
      }
    }

    let activityFactor = 1.2; // Sedentary by default
    // Adjust activity factor based on user input or provide options for user to select activity level

    const tdeeValue = bmrValue * activityFactor;

    setBmr(bmrValue);
    setTdee(tdeeValue);
  };

  return (
    <BaseLayout>
    <div className="bg-white min-h-screen p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-pink-500 mb-6">Calorie Calculator</h1>
      
      <div className="mb-6">
        <div className="inline-flex rounded-full bg-purple-100 p-1">
          <button 
            className={`px-4 py-2 rounded-full ${unit === 'Imperial' ? 'bg-purple-500 text-white' : 'text-purple-700'}`}
            onClick={() => setUnit('Imperial')}
          >
            Imperial
          </button>
          <button 
            className={`px-4 py-2 rounded-full ${unit === 'Metric' ? 'bg-purple-500 text-white' : 'text-purple-700'}`}
            onClick={() => setUnit('Metric')}
          >
            Metric
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-blue-500 mb-1">Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="years" className="w-full p-2 border rounded" />
        </div>
        
        <div>
          <label className="block text-blue-500 mb-1">Height</label>
          <div className="flex space-x-2">
            {unit === 'Imperial' ? (
              <>
                <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="ft" className="w-1/2 p-2 border rounded" />
                <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="in" className="w-1/2 p-2 border rounded" />
              </>
            ) : (
              <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="cm" className="w-full p-2 border rounded" />
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-blue-500 mb-1">Weight</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unit === 'Imperial' ? "lbs" : "kg"} className="w-full p-2 border rounded" />
        </div>
        
        <div>
          <label className="block text-blue-500 mb-1">Sex</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input type="radio" name="sex" value="Male" onChange={() => setSex('Male')} className="form-radio text-purple-500" />
              <span className="ml-2">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="sex" value="Female" onChange={() => setSex('Female')} className="form-radio text-purple-500" />
              <span className="ml-2">Female</span>
            </label>
          </div>
        </div>
      </div>

      <button
        className="w-full bg-purple-500 text-white font-bold py-3 rounded-full mt-6 hover:bg-purple-600 transition duration-300"
        onClick={calculateCalories}
      >
        Calculate Calories
      </button>

      {bmr !== null && tdee !== null && (
        <div className="mt-6 p-4 bg-gray-100 rounded border">
          <h2 className="text-xl font-bold">Results</h2>
          <div className="text-center">
          <p><strong>BMR:</strong> {bmr.toFixed(2)} calories/day</p>
          <p><strong>TDEE:</strong> {tdee.toFixed(2)} calories/day</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-600 text-sm text-center">Remember you are always amazing</p>
    
      </div>
    </div>
    </BaseLayout>
  );
};

export default CalorieCalculator;
