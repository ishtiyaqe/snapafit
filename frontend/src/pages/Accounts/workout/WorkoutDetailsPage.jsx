import React, { useState, useEffect } from 'react';
import secondWorkutBackground from '../../../assets/images/WorkutBackground.png'
import exerciseVector from '../../../assets/images/exerciseVector.png'
import BackButtonWithImage from '../../../components/BackButtonWithImage'
import clients from '../../../components/api/client';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';


const WorkoutTracker = () => {
    const [currentWeight, setCurrentWeight] = useState('');
    const [totalBurnToday, setTotalBurnToday] = useState('');
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState();
    const { exerciseName } = useParams(); // Get the exercise name from the URL
    const [exercise, setExercise] = useState(null);
    const [data, setData] = useState(null);
    const [datas, setDatas] = useState(null);
    const [exerciseData, setExerciseData] = useState([]);
    const [nextExercises, setNextExercises] = useState([]);
    const [time, setTime] = useState({ minutes: 0, seconds: 0 });
console.log(exercise)
    // Optionally format the exerciseName if needed (e.g., to display properly)
    const formattedExerciseName = exerciseName.replace(/_/g, ' ');
    useEffect(() => {
        const fetchExercise = async () => {
          try {
            const response = await clients.get(`/api/exercises/${formattedExerciseName}/`);
            setExercise(response.data);
          } catch (err) {
            setError(err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchExercise();
      }, [formattedExerciseName]);
      useEffect(() => {
        const fetchWorkoutData = async () => {
          try {
            const response = await clients.get('api/workout/');
            if (response.data === 'No Workout. Please generate.') {
              setTimeout(fetchWorkoutData, 100000); // Retry every 100 seconds
            } else if (response.data === "No User data. Please Fill Data First.") {
              navigate('/user_details');
            }
            else {
                const workoutData = response.data.workout_data;

                // Function to extract exercise names from workout sections
                const extractExerciseNames = (section) => {
                  return section.map((exerciseObj) => Object.keys(exerciseObj)[0]);
                };
      
                const warmUpExercises = extractExerciseNames(workoutData.warm_up || []);
                const mainExercises = extractExerciseNames(workoutData.main_exercises.exercises || []);
                const coolDownExercises = extractExerciseNames(workoutData.cool_down || []);
      
                // Combine all exercise names into a single list
                const allExercises = [
                  ...warmUpExercises,
                  ...mainExercises,
                  ...coolDownExercises
                ];
      
                console.log('Exercise List:', allExercises); // Log the exercise names list
                setData(workoutData);
                setDatas(response.data);
                await fetchExercisesData(allExercises);
                setLoading(false);
            }
          } catch (error) {
            setError('An error occurred');
            setLoading(false);
          }
        };
    

        const fetchExercisesData = async (workoutData) => {
            try {
                console.log(workoutData)
   
              const fetchExercisePromises = workoutData.map((exerciseObj) => {
                return clients.get(`/api/exercises/${exerciseObj}/`);
              });
      
              const responses = await Promise.all(fetchExercisePromises);
              const fetchedExerciseData = responses.map(response => response.data);
              setExerciseData(fetchedExerciseData); // Store all exercise responses
      
              // Get the index of the current exercise
              const currentExerciseIndex = fetchedExerciseData.findIndex(ex => ex.name === exerciseName);
              
              // Get the next 3 exercises after the current exercise
              const nextExercisesSlice = fetchedExerciseData.slice(currentExerciseIndex + 1, currentExerciseIndex + 4);

              setNextExercises(nextExercisesSlice); // Update state with the next exercises
      
            } catch (err) {
              console.error('Error fetching exercise data:', err);
            }
          };

          
        fetchWorkoutData();
      }, [exerciseName, navigate]);
      console.log(datas)
      console.log(nextExercises)
  useEffect(() => {
    clients.get("/api/user")
      .then(function (res) {
        setCurrentUser(true);
      })
      .catch(function (error) {
        setCurrentUser(false);
        navigate('/login');
      });
  }, [currentUser, navigate]);

    useEffect(() => {
        clients.get("/api/current_weight")
            .then(function (res) {
                setCurrentWeight(res.data.count);
            })
            .catch(function (error) {
                console.error(error);
            });

         clients.get("/api/total_burn_today/")
            .then(function (res) {
                setTotalBurnToday(res.data.count);
            })
            .catch(function (error) {
                console.error(error);
            });
    }, [time]);

    

useEffect(() => {
  if (!isTimerRunning) return;

  const timer = setInterval(() => {
    setTime(prevTime => {
      if (prevTime.seconds === 59) {
        return { minutes: prevTime.minutes + 1, seconds: 0 };
      }
      return { ...prevTime, seconds: prevTime.seconds + 1 };
    });
  }, 1000);

  return () => clearInterval(timer);
}, [isTimerRunning]);

const handleStartStop = () => {
    if (isTimerRunning) {
      // Stop the timer
      setIsTimerRunning(false);
      setShowNext(true);
      console.log("timer stop");
      console.log(time);
  
      // Search for the matching exercise in all sections (warm_up, main_exercises, cool_down)
      const findExerciseInSection = (section) => {
        return section.find(exerciseObj => {
          const exerciseNameKey = Object.keys(exerciseObj)[0];
          return exerciseNameKey === exerciseName; // Match with state
        });
      };
  
      const workoutData = datas.workout_data;
  
      // Look in warm_up, main_exercises, and cool_down
      const matchingExercise =
        findExerciseInSection(workoutData.warm_up) ||
        findExerciseInSection(workoutData.main_exercises.exercises) ||
        findExerciseInSection(workoutData.cool_down);
  
      if (matchingExercise) {
        const exerciseData = matchingExercise[exerciseName]; // Access the exercise data (calories, duration, etc.)
        const caloriesBurned = parseInt(exerciseData.calories, 10); // Parse calories to an integer
  
        const dayNumber = datas.day_number; // Example value; replace with actual data
        const workoutName = exerciseName; // Use exerciseName from state
  
        // POST request to complete the workout
        clients.post('/api/complete_workout/', {
          day_number: dayNumber,
          workout_name: workoutName,
          calories: caloriesBurned
        })
        .then(response => {
          if (response.data.status === 'success') {
            console.log('Workout marked as completed:', response.data.message);
            setTime({ minutes: 0, seconds: 0 })
          } else {
            console.error('Error marking workout as completed:', response.data.message);
          }
        })
        .catch(error => {
          console.error('An error occurred:', error);
        });
      } else {
        console.error('Matching exercise not found.');
      }
    } else {
      // Start the timer
      setIsTimerRunning(true);
      setShowNext(false);
      console.log("timer start");
    }
  };
  

    const handleNext = () => {
       
        navigate(`/workout_details/${nextExercises[0].name}`); // Update this to your desired path
    };


const truncateToThreeWords = (str) => {
  const words = str.split(' '); // Split the string into words
  return words.slice(0, 2).join(' '); // Join the first three words back into a string
};
    const handleAI = () => {
        navigate('/chat'); // Update this to your desired path
    };


    return (
        <div className="bg-gray-100 p-4">
            <div className="max-w-md mx-auto overflow-hidden">
                {/* Main Image */}
                <BackButtonWithImage imageSrc={exercise && exercise.image} />
                {/* Stats Section */}
                <div className="grid mt-10 grid-cols-3 items-center gap-2 ">
                    <div className="text-center bg-gray-950 rounded-3xl my-auto mx-auto self-center h-24 p-4 w-32 text-white">
                        <p className="text-sm text-pink-500 font-extrabold">Current Weight</p>
                        <p className="font-extrabold">{currentWeight}</p>
                    </div>
                    <div className="text-center bg-gray-950 rounded-3xl my-auto mx-auto self-center h-24 p-4 w-32 text-white">
                        <p className="font-extrabold text-2xl text-pink-500 ">{totalBurnToday}</p>
                        <p className="text-sm font-extrabold">Burned</p>
                    </div>
                    <div className="text-center bg-gray-950 rounded-3xl my-auto mx-auto self-center h-24 p-4 w-32 text-white">
                        <p className="font-extrabold text-2xl text-pink-500 ">{String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}</p>
                        <p className="text-sm font-extrabold">Time</p>
                    </div>
                </div>

                {/* Description */}
                <div className="p-4 bg-white my-4 rounded-lg shadow-lg">
                    <h2 className="font-semibold text-lg mb-2">Description</h2>
                    <div className="text-sm text-gray-600 space-y-1">
                    {exercise && exercise.instructions.split(/(?=\d+\.)/).map((step, index) => (
    <div key={index}>{step.trim()}</div>
  ))}
                    </div>
                </div>

                {/* Today's Workouts */}
                <div className="p-4">
                    <h2 className="font-semibold text-lg mb-2">Today next workouts</h2>
                    <div className="flex justify-between space-x-2">
                        {nextExercises.map((ex, index) => (
                            <Link 
                            key={index} 
                            to={`/workout_details/${ex.name}`}
                            className="flex-1 relative rounded-3xl"
                            >

                            <div  >
                                <img
                                    src={ex.image}
                                    alt={ex.name}
                                    className="w-full h-24 object-cover rounded-lg"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                                    <p className="font-semibold">{truncateToThreeWords(ex.name)}</p>
                                    <p>00:15 TIME</p>
                                </div>
                            </div>
                            </Link>
                        ))}
                       
                    </div>
                </div>

                {/* Buttons */}
                <div className="p-4 space-y-2">
                    <button
                        className={`w-full ${isTimerRunning ? 'bg-red-500' : 'bg-purple-500'} text-white font-semibold py-3 rounded-lg hover:opacity-80 transition duration-300`}
                        onClick={handleStartStop}
                    >
                        {isTimerRunning ? 'Stop' : 'Start'}
                    </button>
                    {showNext && (
                        <button
                            className="w-full bg-white text-purple-500 font-semibold py-3 rounded-lg border border-purple-500 hover:bg-purple-50 transition duration-300"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    )}
                    <button onClick={handleAI} className="w-full bg-white text-purple-500 font-semibold py-3 rounded-lg border border-purple-500 hover:bg-purple-50 transition duration-300">
            Ask Your AI coach
          </button>
                </div>
            </div>
        </div>
    );
};

export default WorkoutTracker;
