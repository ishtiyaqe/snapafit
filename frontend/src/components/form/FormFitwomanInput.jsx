import React, { useState } from 'react';
import ManEctomorph from '../../assets/images/WomanEchop.png';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const FormInput = ({ label, name, value, onChange }) => {
    const [selectedOptions, setSelectedOptions] = useState(value ? value.split(',') : []);

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
        <div className="mb-4">
            <h1 className="text-gradient3 mt-10 font-black text-3xl text-center mb-10">{label}</h1>
            <div className="mt-10 text-center text-black font-semibold mb-10 px-6">
            Select the body type closest to yours to get started
            </div>
            <div className="grid grid-cols-2 gap-6">
                {[
                    { id: 'Ectomorph', image: ManEctomorph, label: 'Ectomorph' },
                    { id: 'Mesomorph', image: ManEctomorph, label: 'Mesomorph' },
                    { id: 'Endomorph', image: ManEctomorph, label: 'Endomorph' },
                    { id: 'Athletic', image: ManEctomorph, label: 'Athletic' },
                ].map(option => (
                    <div
                        key={option.id}
                        className={`relative cursor-pointer flex items-center flex-col `}
                        onClick={() => handleOptionToggle(option.id)}
                    >
                        <img src={option.image} alt={option.label} className='w-40 h-40 object-cover rounded-3xl' />
                        {isSelected(option.id) && (
                            <div className="absolute -bottom-0 right-2">
                                <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            </div>
                        )}
                        <p className="text-center font-semibold text-lg mt-2">{option.label}</p>
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
                Unlock Your Strength and Confidence!
                Embrace a healthier, more confident you. Let's achieve greatness together!
            </div>
        </div>
    );
};

export default FormInput;
