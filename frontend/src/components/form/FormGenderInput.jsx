import React, { useState } from 'react';
import man from '../../assets/images/man.png';
import woman from '../../assets/images/woman.png';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const FormInput = ({ label, name, value, onChange }) => {
    const [selectedCoachId, setSelectedCoachId] = useState(value || '');

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
        <div className="mb-4">
            <h1 className="text-gradient3 mt-10 font-black text-3xl text-center mb-10">{label}</h1>
            <div className="grid grid-cols-2 gap-6">
                <div className='relative cursor-pointer' onClick={() => handleCoachSelect('man')}>
                    <img src={man} alt="Man" className='w-full h-auto object-cover rounded-md' />
                    {selectedCoachId === 'man' && (
                        <div className="absolute -bottom-0 right-2">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                        </div>
                    )}
                    <p className="text-center font-semibold text-lg mt-2">Man</p>
                </div>
                <div className='relative cursor-pointer' onClick={() => handleCoachSelect('woman')}>
                    <img src={woman} alt="Woman" className='w-full h-auto object-cover rounded-md' />
                    {selectedCoachId === 'woman' && (
                        <div className="absolute -bottom-0 right-2">
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                        </div>
                    )}
                    <p className="text-center font-semibold text-lg mt-2">Woman</p>
                </div>
            </div>
            
            <input
                type="hidden"
                name={name}
                value={selectedCoachId || ''}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <div className="mt-10 text-center mb-10 px-6">
                Ready to transform? Let’s make today your best workout yet!
            </div>
        </div>
    );
};

export default FormInput;
