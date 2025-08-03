import React, { useState, useEffect } from 'react';
import height from '../../assets/images/weight.png';

const FormInput = ({ label, name, value, onChange }) => {
    const [selectedCoachId, setSelectedCoachId] = useState(value || '');
    const [unitPart, measurementPart] = value.split(':').map(part => part.trim());
    const [measurement, setMeasurement] = useState(measurementPart);
    const [unit, setUnit] = useState(unitPart || 'Kg')


    const handleUnitChange = (newUnit) => {
        setUnit(newUnit);
        setSelectedCoachId(`${newUnit}: ${measurement}`)
    if (onChange) {
        onChange({
            target: {
                name: name,
                value: selectedCoachId
            }
        });
    }
    };

    const updateMeasurement = (value) => {
        setMeasurement(value);
        setSelectedCoachId(`${unit}: ${value}`)
    if (onChange) {
        onChange({
            target: {
                name: name,
                value: selectedCoachId
            }
        });
    }
    };
    useEffect(() => {
        const newCoachId = `${unit}: ${measurement}`;
        setSelectedCoachId(newCoachId);
        console.log({ unit });
        handleUnitChange(unit)
    }, [measurement, unit]);


   
    return (
        <div className="mb-32 relative">
            <h1 className="text-gradient3 mt-10 font-black text-3xl text-center mb-10 ">{label}</h1>

            <div className="flex items-center justify-end mb-10">
                <button
                    className={`text-white font-bold py-2 px-4 rounded-l-lg ${unit === 'Lb' ? 'bg-purple-600' : 'bg-purple-300'}`}
                    onClick={() => handleUnitChange('Lb')}
                >
                    Lb
                </button>
                <button
                    className={`text-white font-bold py-2 px-4 rounded-r-lg ${unit === 'Kg' ? 'bg-purple-600' : 'bg-purple-300'}`}
                    onClick={() => handleUnitChange('Kg')}
                >
                    Kg
                </button>
            </div>

            <img src={height} alt="Height Measurement" className='w-full h-auto rounded-3xl mb-10' />
            <div className="flex absolute -bottom-28 w-full flex-col items-center justify-center ">
                <div className="bg-gray-950 opacity-90 text-white shadow-lg rounded-3xl p-6 w-full max-w-md">
                    <div className="text-4xl text-center font-bold mb-4">
                        {unit}: {measurement}
                    </div>
                    <input
                        type="text"
                        className="bg-gray-100 border border-gray-300 text-black rounded-lg px-4 py-2 w-full mb-4"
                        value={measurement}
                        placeholder='232 or 73'
                        onChange={(e) => updateMeasurement(e.target.value)}
                    />
                </div>
                <input
                    type="hidden"
                    name={name}
                    value={selectedCoachId || ''}
                    onChange={onChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
        </div>
    );
};

export default FormInput;

