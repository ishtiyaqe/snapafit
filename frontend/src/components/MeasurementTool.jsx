import React, { useState,useEffect } from 'react';

const MeasurementTool = ({onChange, name, value}) => {
  const [measurement, setMeasurement] = useState('5\'10"');
  const [unit, setUnit] = useState('Ft');
  const [selectedCoachId, setSelectedCoachId] = useState(value || '');

  const toggleUnit = () => {
    setUnit(unit === 'Ft' ? 'Cm' : 'Ft');
  };

  const updateMeasurement = (value) => {
    setMeasurement(value);
  };

   useEffect(() => {
    setSelectedCoachId(`${unit}: ${measurement}`)
    if (onChange) {
        onChange({
            target: {
                name: name,
                value: selectedCoachId
            }
        });
    }
    }, [measurement, unit]);

  return (
    <div className="flex absolute -bottom-20 w-full flex-col items-center justify-center ">
      <div className="bg-gray-950 opacity-90 text-white shadow-lg rounded-3xl p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <button
            className={`bg-purple-500 text-white font-bold py-2 px-4 rounded-l-lg ${unit === 'Ft' ? 'bg-purple-600' : 'bg-purple-500'}`}
            onClick={toggleUnit}
          >
            Ft
          </button>
          <button
            className={`bg-purple-300 text-white font-bold py-2 px-4 rounded-r-lg ${unit === 'Cm' ? 'bg-purple-400' : 'bg-purple-300'}`}
            onClick={toggleUnit}
          >
            Cm
          </button>
        </div>
        <div className="text-4xl text-center font-bold mb-4 ">
          {measurement}
        </div>
        <input
          type="text"
          className="bg-gray-100 border border-gray-300 text-black rounded-lg px-4 py-2 w-full mb-4"
          value={measurement}
          onChange={(e) => updateMeasurement(e.target.value)}
        />
      
      </div>
       <input
                type="text"
                name={name}
                value={selectedCoachId || ''}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
    </div>
  );
};

export default MeasurementTool;