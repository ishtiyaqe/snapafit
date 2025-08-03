import React from 'react';

const Analytics = () => {
  return (
    <div className="bg-white mb-10 ">
      
      <div className="bg-purple-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-purple-800 font-semibold">Health Grade</span>
          <div className="w-12 h-12 rounded-full border-4 border-purple-500 flex items-center justify-center">
            <span className="text-purple-800 font-bold">80%</span>
          </div>
        </div>
        <p className="text-purple-600 text-sm mt-2">Calories burned, estimated</p>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-center">
          <div className="w-32 h-16 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-t-full relative">
            <div className="absolute bottom-0 left-1/2 w-1 h-8 bg-black"></div>
          </div>
        </div>
        <p className="text-center font-bold mt-2">284kcal</p>
        <p className="text-center text-gray-500 text-sm">Consumed</p>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-2">Calories burned, estimated</p>
        <div className="h-24 bg-gray-100 rounded-lg"></div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">BMI (kg/m²)</span>
          <span className="text-gray-500">19.95</span>
        </div>
        <div className="h-2 bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 rounded-full">
          <div className="h-full w-1/3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Underweight</span>
          <span>Normal</span>
          <span>Overweight</span>
          <span>Obese</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;