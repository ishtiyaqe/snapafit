// src/components/BackButtonWithImage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButtonWithImage = ({ imageSrc, title }) => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className="relative">
            <img src={imageSrc} alt={title} className="w-full rounded-b-3xl h-full object-cover" />
            <div className="absolute top-4 left-4 flex items-center cursor-pointer" onClick={handleBackClick}>
                <ArrowBackIcon className="text-black" />
                <span className="text-black ml-2">Back</span>
            </div>
        </div>
    );
};

export default BackButtonWithImage;
