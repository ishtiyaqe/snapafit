import React, { useState, useEffect } from 'react';
import womanGym from '../../assets/images/ManGym.png';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import clients from '../api/client';

const TargetAreaSelector = ({ label, name, value, onChange }) => {
    const [selectedOptions, setSelectedOptions] = useState(value ? value.split(',') : []);
    const [Bodyareas, setBodyareas] = useState([]);

    useEffect(() => {
        clients.get('/api/target_list/')
            .then((res) => {
                setBodyareas(res.data.eqp_list);
            })
            .catch((error) => {
                console.error("Error fetching body areas:", error);
            });
    }, []);

    const handleOptionToggle = (option) => {
        const updatedSelection = selectedOptions.includes(option)
            ? selectedOptions.filter(selected => selected !== option)
            : [...selectedOptions, option];

        setSelectedOptions(updatedSelection);

        if (onChange) {
            onChange({
                target: {
                    name: name,
                    value: updatedSelection.join(',') // Convert array to comma-separated string
                }
            });
        }
    };

    const isSelected = (option) => selectedOptions.includes(option);

    return (
        <div className="flex flex-col  bg-white p-4">
            <h1 className="text-2xl font-bold text-center py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                {label}
            </h1>

            <div className="flex-1 relative flex flex-col items-center">

                <img
                    src={womanGym}
                    alt="Fitness model"
                    className="w-full h-auto max-h-80 object-cover rounded-3xl mb-4"
                />
                <div className="flex flex-wrap justify-center gap-4 mb-10 mt-4 max-h-60 overflow-y-auto">
                    {Bodyareas.map((area) => (
                        <div
                            key={area}
                            className={`relative cursor-pointer whitespace-nowrap flex items-center ${isSelected(area) ? 'bg-green-200' : 'bg-gray-300'} p-4 h-12 rounded-lg text-left font-semibold hover:bg-opacity-100 transition-all duration-200 text-xl`}
                            onClick={() => handleOptionToggle(area)}
                        >
                            {isSelected(area) && (
                                <CheckCircleIcon className="w-6 h-6 text-green-500 absolute right-2" />
                            )}
                            {area}
                        </div>
                    ))}
                </div>
            </div>

            <input
                type="hidden"
                name={name}
                value={selectedOptions.join(',') || ''}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />

            <p className="text-sm text-gray-600 text-center px-4 py-2 mt-2">
                Select the body part you want to focus on today and get personalized workouts tailored to your goals!
            </p>
        </div>
    );
};

export default TargetAreaSelector;
