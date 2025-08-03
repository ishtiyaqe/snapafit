import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import FormInput from './FormInput'; // Adjust the import path based on your file structure
import FormCoachInput from './form/FormCoachInput'; 
import FormGenderInput from './form/FormGenderInput'; 
import FormHeightInput from './form/FormHeightInput'; 
import FormWeightInput from './form/FormWeightInput'; 
import FormWhereInput from './form/FormWhereInput'; 
import FormEuipmentInput from './form/FormEuipmentInput'; 
import FormFitInput from './form/FormFitManInput'; 
import FormFitwomanInput from './form/FormFitwomanInput'; 
import FormChoseManAreaInput from './form/FormChoseManAreaInput'; 
import FormChoseWomanAreaInput from './form/FormChoseWomanAreaInput'; 
import FormShiduleInput from './form/FormShiduleInput'; 
import Cookies from 'js-cookie';
import clients from './api/client';
import SuccessPage from './Success';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';



const StepForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [currentUser, setCurrentUser] = useState();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        coach: '',
        gender: '',
        height: '',
        weight: '',
        practiceLocation: '',
        equipment: '',
        fit: '',
        targetArea: '',
        shidule: '',
    });
    const [isSuccess, setIsSuccess] = useState(false); // Track success status
     const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await clients.get('/api/user-data/detail/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': Cookies.get('csrftoken'), // Get CSRF token if needed
                    }
                });

                // Map API response keys to formData keys
                const data = response.data;
                setFormData({
                    coach: data.coach || '',
                    gender: data.gender || '',
                    height: data.height || '',
                    weight: data.weight || '',
                    practiceLocation: data.practice_location || '',
                    equipment: data.equipment || '',
                    fit: data.fit || '',
                    targetArea: data.target_area || '',
                    shidule: data.schedule || '',
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

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

    const handleNext = () => {
        if (currentStep < 9) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        console.log('FormData Updated:', formData);
    }, [formData]);

    const handleSave = async () => {
        try {
            const csrfToken = Cookies.get('csrftoken'); // Get the CSRF token from cookies

            const response = await clients.post('/api/user-data/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken, // Use the retrieved CSRF token
                }
            });

            console.log('Form data saved:', response.data);
            setIsSuccess(true); // Set success status to true on success
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    };

    const isFormComplete = () => {
        const requiredFields = {
            1: 'coach',
            2: 'gender',
            3: 'height',
            4: 'weight',
            5: 'practiceLocation',
            6: 'equipment',
            7: 'fit',
            8: 'targetArea',
            9: 'shidule'
        };
        
        const currentField = formData[requiredFields[currentStep]];

        if (typeof currentField === 'string') {
            return currentField.trim() !== '';
        }
        if (typeof currentField === 'number') {
            return !isNaN(currentField) && currentField !== 0;
        }

        return false;
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 1:
                return (
                    <FormCoachInput
                        label="Select Your Goal"
                        name="coach"
                        value={formData.coach}
                        onChange={handleChange}
                    />
                );
            case 2:
                return (
                    <FormGenderInput
                        label="Choose Your Gender?"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    />
                );
            case 3:
                return (
                    <FormHeightInput
                        label="What is your height?"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                    />
                );
            case 4:
                return (
                    <FormWeightInput
                        label="What is your weight?"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                    />
                );
            case 5:
                return (
                    <FormWhereInput
                        label="Where to practice"
                        name="practiceLocation"
                        value={formData.practiceLocation}
                        onChange={handleChange}
                    />
                );
            case 6:
                return (
                    <FormEuipmentInput
                        label="Equipment Selection if available"
                        name="equipment"
                        value={formData.equipment}
                        onChange={handleChange}
                    />
                );
            case 7:
                return formData.gender === 'man' ? (
                    <FormFitInput
                        label="Find Your Fit"
                        name="fit"
                        value={formData.fit}
                        onChange={handleChange}
                    />
                ) : (
                    <FormFitwomanInput
                        label="Find Your Fit"
                        name="fit"
                        value={formData.fit}
                        onChange={handleChange}
                    />
                );
            case 8:
                return formData.gender === 'man' ? (
                    <FormChoseManAreaInput
                        label="Choose Your Target Area"
                        name="targetArea"
                        value={formData.targetArea}
                        onChange={handleChange}
                    />
                ) : (
                    <FormChoseWomanAreaInput
                        label="Choose Your Target Area"
                        name="targetArea"
                        value={formData.targetArea}
                        onChange={handleChange}
                    />
                );
            case 9:
                return (
                    <FormShiduleInput
                        label="How often would you like to workout?"
                        name="shidule"
                        value={formData.shidule}
                        onChange={handleChange}
                    />
                );
            default:
                return null;
        }
    };

    if (isSuccess) {
        return <SuccessPage />;
    }
    if (loading) {
        return <div>Loading...</div>; // Display a loading state while fetching data
    }

    return (
        <div className="p-6 max-w-lg mx-auto">
            <div className="mb-6">
                <div className="flex justify-between mb-10">
                    {Array.from({ length: 9 }, (_, index) => index + 1).map((step) => (
                        <div
                            key={step}
                            className={classNames(
                                'w-1/12 h-2 rounded-full',
                                {
                                    'bg-blue-500': step <= currentStep,
                                    'bg-gray-300': step > currentStep,
                                },
                                'transition-colors duration-300'
                            )}
                        ></div>
                    ))}
                </div>
            </div>
            <div className="mb-10">
                {renderStepContent(currentStep)}
            </div>
            <div className="flex mt-10 justify-between mb-6">
                <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-80"
                >
                    Previous
                </button>
                <div className='grid grid-cols-2 gap-4'>
                    {currentStep === 9 ? (
                        <button
                            disabled
                            className={classNames(
                                'px-4 py-2 rounded-lg',
                                'bg-gray-400',
                                'text-white'
                            )}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={!isFormComplete()}
                            className={classNames(
                                'px-4 py-2 rounded-lg',
                                {
                                    'bg-blue-500': isFormComplete(),
                                    'bg-gray-400': !isFormComplete(),
                                },
                                'text-white'
                            )}
                        >
                            Next
                        </button>
                    )}
                    {currentStep === 9 && (
                        <button
                            onClick={handleSave}
                            disabled={!isFormComplete()}
                            className={classNames(
                                'px-4 py-2 rounded-lg',
                                {
                                    'bg-green-500': isFormComplete(),
                                    'bg-gray-400': !isFormComplete(),
                                },
                                'text-white'
                            )}
                        >
                            Save
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StepForm;
