import React, { useState, useEffect } from 'react';
import AccountLayout from '../AccountPage'
import clients from '../../../components/api/client';
import { Link, useNavigate } from 'react-router-dom';


const nutrationPage = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const response = await clients.get('/api/nutrition/');
        if (response.data === 'No Nutrition Plan for today. Please generate.') {
          setTimeout(fetchNutritionData, 100000); // Retry every 100 seconds
        }
        else if (response.data === 'No Nutrition Plan. Please generate one.') {
          setTimeout(fetchNutritionData, 100000); // Retry every 100 seconds
        }
        else if (response.data === 'Free period finished, please create a new order to continue.'){
          navigate('/package');
        } 
        else {
          setData(response.data);
          setLoading(false);
        }
      } catch (error) {
        setError('Failed to load nutrition data');
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, []);

  

  if (loading) {
    return (
      <AccountLayout>
        <div className="px-4 mb-10">
          {/* Header */}
          <div className="p-4">
            <h1 className="text-gradient3 font-black text-3xl text-center animate-pulse">
              Your Personalized<br />Workout Plan for Today
            </h1>
          </div>

          {/* Loading Skeleton */}
          <div className="p-4 w-92 space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-4 animate-pulse">
                <div className="bg-gray-800 h-6 w-1/4 mb-2"></div>
                <div className="bg-gray-700 h-4 w-3/4 mb-2"></div>
                <div className="bg-gray-700 h-4 w-1/2 mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      </AccountLayout>
    );
  }




  return (
    <AccountLayout>
        <div className="px-4 mb-10">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-gradient3 font-black text-3xl text-center">
          Today's Nutrition Plan
        </h1>
      </div>

      {/* Meals Sections */}
      <div className="p-4 w-92 space-y-4">
        {/* Breakfast Section */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-2">Breakfast</h2>
          <ul className="text-gray-300 space-y-4">
            {data.nutrition_data.breakfast.map((item, index) => (
              <li key={index}>
                <div className='flex space-x-4 '>
                  <div>
                    <img 
                    className='w-20 h-20 object-cover rounded-lg'
                    src={item.image_url}  
                    alt={item.name}   
                    />
                  </div>
                  <div className='flex flex-col font-bold self-center'>
                {item.name}
                <span className='px-4 text-xs'>
                  Details:
                {item.calories} kcal,
                {item.protein} Protein, 
                {item.carbs} Carbs,
                {item.fat} Fat 
                  </span> 

                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Lunch Section */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-2">Lunch</h2>
          <ul className="text-gray-300 space-y-4">
            {data.nutrition_data.lunch.map((item, index) => (
              <li key={index}>
              <div className='flex space-x-4'>
                <div>
                  <img 
                  className='w-20 h-20 object-cover rounded-lg'
                  src={item.image_url}  
                  alt={item.name}   
                  />
                </div>
                <div className='flex flex-col font-bold self-center'>
              {item.name}
              <span className='px-4 text-xs'>
                Details:
              {item.calories} kcal,
              {item.protein} Protein, 
              {item.carbs} Carbs,
              {item.fat} Fat 
                </span> 

                </div>
              </div>
            </li>
            ))}
          </ul>
        </div>

        {/* Snack Section */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-2">Snack</h2>
          <ul className="text-gray-300 space-y-4">
            {data.nutrition_data.snack.map((item, index) => (
              <li key={index}>
              <div className='flex space-x-4'>
                <div>
                  <img 
                  className='w-20 h-20 object-cover rounded-lg'
                  src={item.image_url}  
                  alt={item.name}   
                  />
                </div>
                <div className='flex flex-col font-bold self-center'>
              {item.name}
              <span className='px-4 text-xs'>
                Details:
              {item.calories} kcal,
              {item.protein} Protein, 
              {item.carbs} Carbs,
              {item.fat} Fat 
                </span> 

                </div>
              </div>
            </li>
            ))}
          </ul>
        </div>

        {/* Dinner Section */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-2">Dinner</h2>
          <ul className="text-gray-300 space-y-4">
          {data.nutrition_data.dinner.map((item, index) => (
              <li key={index}>
              <div className='flex space-x-4'>
                <div>
                  <img 
                  className='w-20 h-20 object-cover rounded-lg'
                  src={item.image_url}  
                  alt={item.name}   
                  />
                </div>
                <div className='flex flex-col font-bold self-center'>
              {item.name}
              <span className='px-4 text-xs'>
                Details:
              {item.calories} kcal,
              {item.protein} Protein, 
              {item.carbs} Carbs,
              {item.fat} Fat 
                </span> 

                </div>
              </div>
            </li>
            ))}
          </ul>
        </div>

        {/* Total Calories & Macros */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-2">Total Nutrition</h2>
          <p className="text-gray-300">
            Total Calories: {data.totalCalories} kcal
          </p>
          <p className="text-gray-300">
            Protein: {data.totalProtein}, Carbs: {data.totalCarbs}, Fat: {data.totalFat}
          </p>
        </div>
      </div>
    </div>
    </AccountLayout>
  )
}

export default nutrationPage