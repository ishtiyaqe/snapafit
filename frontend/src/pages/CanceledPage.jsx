import React from 'react';
import { motion } from 'framer-motion';
import BaseLayout from '../components/BaseLayout';


const CanceledPage = () => {
  return (
    <BaseLayout>
    
    <div className="flex flex-col items-center justify-center h-96 w-96 space-y-5">
      {/* Container for the cross-mark animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative"
      >
        {/* Cross mark */}
        <motion.div
          className="text-red-600 text-9xl font-bold"
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -20, 20, -10, 10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          &#x2716;
        </motion.div>

        {/* Sparkling effect for cross-mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 left-0 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
        </motion.div>
      </motion.div>

      {/* Canceled message */}
      <div className="text-center mt-4 text-xl font-bold text-red-600">
        Payment Canceled!
      </div>
    </div>
    </BaseLayout>
  );
};

export default CanceledPage;
