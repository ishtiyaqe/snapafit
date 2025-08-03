import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import thumbsUpImage from '../assets/human-hand-thumb-up-png.webp'; // Replace with your thumbs-up image path
import BaseLayout from '../components/BaseLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import clients from '../components/api/client'; // Import your API client
import Cookies from 'js-cookie';


const GetMoreTokenPage = () => {
    const [tokenPackages, setTokenPackages] = useState(0);

    useEffect(() => {
        const fetchNutritionData = async () => {
            try {
                const response = await clients.get('/api/Token_package/');
                const t = response.data;
                console.log(t);
                setTokenPackages(t);
            } catch (error) {
                console.log('Failed to load nutrition data');
            }
        };

        fetchNutritionData();
    }, []);
    console.log(tokenPackages)

    const getCsrfToken = () => {
        return Cookies.get('csrftoken');
    };

     // Handle Stripe checkout session creation
     const handleCheckout = async (stripeName) => {
        try {
            const csrfToken = getCsrfToken(); // Get CSRF token

            const response = await clients.post('/api/create-token-checkout-session/', {
              package_id: stripeName, // Sending package ID
            }, {
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include CSRF token in the header
              },
            });
              
            // Redirect the user to the Stripe Checkout page
            window.location.href = response.data.checkout_url;
        } catch (error) {
            console.error("Error during Stripe checkout", error);
        }
    };


  return (
    <BaseLayout>
     <div className="overflow-x-auto">
      <table className="w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left font-semibold text-gray-700">ID</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">Name</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">Price (USD)</th>
            <th className="py-2 px-4 text-left font-semibold text-gray-700">Checkout</th>
          </tr>
        </thead>
        <tbody>
          {tokenPackages && tokenPackages.map((tokenPackage) => (
            <tr key={tokenPackage.id} className="border-b">
              <td className="py-2 px-4">{tokenPackage.id}</td>
              <td className="py-2 px-4">{tokenPackage.quantity} Token</td>
              <td className="py-2 px-4">${tokenPackage.price}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleCheckout(tokenPackage.stripe_name)}
                  className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
                >
                  Checkout
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </BaseLayout>
  )
}

export default GetMoreTokenPage