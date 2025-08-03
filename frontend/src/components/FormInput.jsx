import React from 'react';

const FormInput = ({ label, name, value, onChange }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </label>
        </div>
    );
};

export default FormInput;
