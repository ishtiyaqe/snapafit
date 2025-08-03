import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import clients from '../api/client';

const FormInput = ({ label, name, value, onChange }) => {
    const [selectedOptions, setSelectedOptions] = useState(value ? value.split(',') : []);
    const [Bodyareas, setBodyareas] = useState([]);

    useEffect(() => {
        clients.get('/api/equipment_list/')
            .then((res) => {
                setBodyareas(res.data);
            })
            .catch((error) => {
                console.error("Error fetching body areas:", error);
            });
    }, []);

    const handleOptionToggle = (optionId) => {
        const updatedSelection = selectedOptions.includes(optionId)
            ? selectedOptions.filter(selected => selected !== optionId)
            : [...selectedOptions, optionId];

        setSelectedOptions(updatedSelection);

        if (onChange) {
            onChange({
                target: {
                    name: name,
                    value: updatedSelection.join(','), // Convert array to comma-separated string
                },
            });
        }
    };

    const isSelected = (optionId) => selectedOptions.includes(optionId);

    return (
        <div className="mb-4">
            <h1 className="text-gradient3 mt-10 font-black text-3xl text-center mb-10">{label}</h1>
            <div className="grid grid-cols-2 gap-6">
                {Bodyareas.map(option => (
                    <div
                        key={option.id}
                        className={`relative cursor-pointer flex items-center flex-col `}
                        onClick={() => handleOptionToggle(option.name)}
                    >
                        <img
                            src={`http://localhost:8000${option.image}`}
                            alt={option.name}
                            className='w-40 h-40 object-fill shadow-lg rounded-3xl'
                        />
                        {isSelected(option.name) && (
                            <div className="absolute -bottom-0 right-2">
                                <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            </div>
                        )}
                        <p className="text-center capitalize font-semibold text-lg mt-2">{option.name}</p>
                    </div>
                ))}
            </div>
            
            <input
                type="hidden"
                name={name}
                value={selectedOptions.join(',') || ''}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <div className="mt-10 text-center text-black font-semibold mb-10 px-6">
                Craft your perfect workout tailored to the equipment you have on hand!
            </div>
        </div>
    );
};

export default FormInput;
