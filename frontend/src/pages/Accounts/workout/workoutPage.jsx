import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AccountLayout from '../AccountPage';
import { Link, useNavigate } from 'react-router-dom';
import clients from '../../../components/api/client';

const WorkoutPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const response = await clients.get('api/workout/');
        if (response.data === 'No Workout. Please generate.') {
          setTimeout(fetchWorkoutData, 100000); // Retry every 100 seconds
        } else if (response.data === 'No Nutrition Plan for today. Please generate.') {
          setTimeout(fetchWorkoutData, 100000); // Retry every 100 seconds
        } else if (response.data === "No User data. Please Fill Data First.") {
          navigate('/user_details');
        } else if (response.data === "Free period finished, please create a new order to continue.") {
          navigate('/package');
        }
        else {
          setData(response.data);
          setLoading(false);
        }
      } catch (error) {
        setError('An error occurred');
        setLoading(false);
      }
    };

    fetchWorkoutData();
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

  if (error) {
    return <div>Error: {error}</div>;
  }
  console.log(data);

  const workoutData = data?.workout_data || {};

  // Access the warm-up array
  const warmupItems = Array.isArray(workoutData?.warm_up) ? workoutData.warm_up : [];

  // Access the main exercises array (inside main_exercises)
  const mainItems = Array.isArray(workoutData?.main_exercises?.exercises)
    ? workoutData.main_exercises.exercises
    : [];

  // Access the cool down array
  const stretchItems = Array.isArray(workoutData?.cool_down) ? workoutData.cool_down : [];

  console.log("Warm-up items:", warmupItems);
  console.log("Main items:", mainItems);
  console.log("Cool down/stretch items:", stretchItems);


  return (
    <AccountLayout>
      <div className="px-4 mb-10">
        {/* Header */}
        <div className="p-4">
          <h1 className="text-gradient3 font-black text-3xl text-center">
            Your Personalized<br />Workout Plan for Today
          </h1>
        </div>

        {/* Warmup Section */}
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <h2 className="text-white font-semibold mb-2">Warmup</h2>
          <ul className="text-gray-300 space-y-1">
            {warmupItems.map((item, index) => {
              const exerciseName = Object.keys(item)[0]; // Get the exercise name
              const exerciseDetails = item[exerciseName]; // Get the details of the exercise
              return (
                <li key={index}>
                  <Link to={`/workout_details/${exerciseName}`}>
                    {exerciseName} - Duration: {exerciseDetails.duration}, Calories: {exerciseDetails.calories}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Main Section */}
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <h2 className="text-white font-semibold mb-2">Main</h2>

          <h3 className="text-gray-400 mb-1 capitalize">{workoutData.main_exercises.target_muscle_groups}</h3>
          <ul className="text-gray-300 space-y-1">
            {mainItems.map((item, index) => {
              const exerciseName = Object.keys(item)[0]; // Get the exercise name
              const exerciseDetails = item[exerciseName]; // Get the details of the exercise
              return (
                <li key={index}>
                  <Link to={`/workout_details/${exerciseName}`}>
                    {exerciseName} - Duration: {exerciseDetails.duration}, Calories: {exerciseDetails.calories}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Stretch Section */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-2">Stretch</h2>
          <ul className="text-gray-300 space-y-1">
            {stretchItems.map((item, index) => {
              const exerciseName = Object.keys(item)[0]; // Get the exercise name
              const exerciseDetails = item[exerciseName]; // Get the details of the exercise
              return (
                <li key={index}>
                  <Link to={`/workout_details/${exerciseName}`}>
                    {exerciseName} - Duration: {exerciseDetails.duration}, Calories: {exerciseDetails.calories}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </AccountLayout>
  );
};

export default WorkoutPage;
