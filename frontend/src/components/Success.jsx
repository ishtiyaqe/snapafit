import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'; // Updated import path for Heroicons

const SuccessPage = () => {
    const navigate = useNavigate(); // Use useNavigate for navigation

    const handleHomeClick = () => {
        navigate('/'); // Navigate to the home page
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <CheckCircleIcon className="h-24 w-24 text-green-500" />
            <h1 className="text-2xl font-semibold mt-4">User data updated successfully</h1>
            <button
                onClick={handleHomeClick}
                className="mt-6 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Home
            </button>
        </div>
    );
};

export default SuccessPage;
