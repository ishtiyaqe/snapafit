import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import thumbsUpImage from '../assets/human-hand-thumb-up-png.webp'; // Replace with your thumbs-up image path
import BaseLayout from '../components/BaseLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import clients from '../components/api/client'; // Import your API client



const SuccessPage = () => {
  const [sessionId, setSessionId] = useState(null);
  const [packageId, setPackageId] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');
    const packageId = query.get('package_id');

    setSessionId(sessionId);
    setPackageId(packageId);

    // Fetch session details from the backend
    const fetchSessionDetails = async () => {
      if (sessionId) {
        try {
          const response = await clients.get(`/api/get-checkout-session/${sessionId}/`);
        //   setSessionDetails(response.data);
         // Navigate to '/workout' after 30 seconds
    const timer = setTimeout(() => {
        navigate('/workout');
      }, 300); // 30 seconds in milliseconds
  
      // Cleanup the timer on component unmount
      return () => clearTimeout(timer);
        } catch (error) {
        //   console.error("Error fetching session details:", error);
        navigate('/canceled')
        }
      }
    };

    fetchSessionDetails();
  }, [location]);

  return (
    <BaseLayout>
      <div className="flex flex-col space-y-5 items-center justify-center w-96 h-96 ">
        {/* Thumbs-up animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <motion.img
            src={thumbsUpImage}
            alt="Thumbs Up"
            className="w-80 h-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
          {/* Sparkling effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0"
          >
            <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-600 rounded-full animate-ping"></div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-600 rounded-full animate-ping"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-600 rounded-full animate-ping"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-600 rounded-full animate-ping"></div>
            <div className="absolute top-1 left-0 w-2 h-2 bg-yellow-600 rounded-full animate-ping"></div>
            <div className="absolute top-1 right-0 w-2 h-2 bg-yellow-600 rounded-full animate-ping"></div>
            <div className="absolute bottom-1 left-0 w-2 h-2 bg-yellow-600 rounded-full animate-ping"></div>
            <div className="absolute bottom-1 right-0 w-2 h-2 bg-yellow-600 rounded-full animate-ping"></div>
          </motion.div>
        </motion.div>

        {/* Success message */}
        <div className="text-center mt-4 text-xl font-bold text-green-600">
          Payment Successful!
        </div>

      
      </div>
    </BaseLayout>
  );
};

export default SuccessPage;
