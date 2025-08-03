// src/components/ShareButton.jsx
import React, { useState } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import Snackbar from '@mui/material/Snackbar';
import { IconButton } from '@mui/material';

const ShareButton = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleShareClick = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setSnackbarOpen(true);
        });
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <button className='bg-violet-600 text-white p-4 rounded-lg w-full font-semibold text-3xl mt-10 mb-10' onClick={handleShareClick}>
                <ShareIcon />
            </button>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message="URL copied to clipboard"
            />
        </>
    );
};

export default ShareButton;
