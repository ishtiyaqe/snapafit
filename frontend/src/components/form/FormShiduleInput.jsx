import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const CoachList = ({ label, name, value, onChange }) => {
    const [selectedCoachId, setSelectedCoachId] = useState(value || '');
    const [selectedFrequency, setSelectedFrequency] = useState(value || '');

    const frequencies = [
        '2x per week',
        '3x per week',
        '4x per week',
        '5x per week',
        '6x per week',
        '7x per week'
    ];

    const handleCoachSelect = (coachId) => {
        setSelectedCoachId(coachId);
        setSelectedFrequency(coachId)
        // Notify parent component of the selected coach ID
        if (onChange) {
            onChange({
                target: {
                    name: name,
                    value: coachId
                }
            });
        }
    };

    return (
        <div>
            <h1 className="text-gradient3 mt-10 font-black text-3xl text-center mb-10">{label}</h1>

            <div className="bg-gray-900 p-4 rounded-lg max-w-full">
                {frequencies.map((frequency) => (
                    <div key={frequency} className="">
                        <div
                            onClick={() => handleCoachSelect(frequency)}
                            className="text-gray-300 focus:outline-none flex items-center justify-between mb-2"
                        >
                        <span className="text-gray-300 text-sm">{frequency}</span>
                            {selectedFrequency === frequency ? (
                                <>

                                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                </>
                            ) : (
                                <CheckCircleIcon className="w-6 h-6 text-white" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-10 text-center mb-10 text-green-600">

                Our fitness experts ensure that each AI coach provides accurate guidance tailored to your fitness needs
            </div>

        </div>
    );
};

export default CoachList;


