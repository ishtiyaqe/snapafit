import React, { useState, useEffect } from 'react';
import clients from '../../components/api/client';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const CoachList = ({  label, name, value, onChange }) => {
    const [coaches, setCoaches] = useState([]);
    const [selectedCoachId, setSelectedCoachId] = useState(value || '');

    useEffect(() => {
        // Fetch the list of coaches from the API
        clients.get('/api/GymCoach/')
            .then(response => {
                setCoaches(response.data);
            })
            .catch(error => {
                console.error('Error fetching coaches:', error);
            });
    }, []);

    const handleCoachSelect = (coachId) => {
        setSelectedCoachId(coachId);
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
            <div className="grid grid-cols-1 gap-4">
                {coaches.map(coach => (
                    <div
                        key={coach.id}
                        className={`relative rounded-lg cursor-pointer ${selectedCoachId === coach.id ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'}`}
                        onClick={() => handleCoachSelect(coach.id)}
                    >
                        <img src={`http://localhost:8000${coach.image}`} alt={coach.coach_name} className="w-full rounded-md h-44 object-cover mb-2" />
                        <h2 className="text-lg font-semibold px-2">{coach.coach_name}</h2>
                        <p className='mb-2 px-2'>{coach.text}</p>
                        {selectedCoachId === coach.id && (
                            <div className="absolute bottom-2 right-2">
                                <CheckCircleIcon className="w-6 h-6 text-green-500" />
                            </div>
                        )}
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


