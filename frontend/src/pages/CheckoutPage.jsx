import React, { useEffect, useState } from 'react';
import BaseLayout from '../components/BaseLayout';
import clients from '../components/api/client';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const CheckoutPage = () => {
    const [prices, setPrices] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [couponCode, setCouponCode] = useState(""); // State to hold coupon code
    const { id } = useParams();

    useEffect(() => {
        // Fetch data from the API
        const fetchPrices = async () => {
            try {
                const response = await clients.get(`/api/Pkg_Price/${id}`);
                setPrices(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchPrices();
    }, [id]);

    const getCsrfToken = () => {
        return Cookies.get('csrftoken');
    };
    
    // Handle Stripe checkout session creation
    const handleCheckout = async () => {
        const price = prices.discounted_price_usd || prices.price_usd;
        try {
            const csrfToken = getCsrfToken(); // Get CSRF token

            const response = await clients.post('/api/create-checkout-session/', {
              package_id: prices.price_id, // Sending package ID
              coupon: couponCode || null // Send coupon code if entered
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
            setError(error);
        }
    };

    // Render loading state, error message, or the price details
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching data: {error.message}</p>;

    return (
        <BaseLayout>
            <div className="price-list">
                {prices && (
                    <div key={prices.id} className="price-card bg-black rounded-lg p-4 m-4 text-white text-center">
                        <img
                            src={`http://localhost:8000${prices.image}`}
                            alt={prices.name}
                            className="package-image w-80 h-80 rounded-md flex justify-center mx-auto mb-4"
                        />
                        <h2 className="text-2xl font-bold">{prices.name}</h2>
                        <p>Duration: {prices.duration_months} months</p>
                        <p>Price: ${prices.price_usd}</p>
                        <p>Discount: {prices.discount}%</p>
                        <p>Discounted Price: ${prices.discounted_price_usd}</p>

                        {/* Input for Coupon Code */}
                        <div className="flex items-center gap-5 mt-5 mb-3">
                       <div>

                            <input
                                type="text"
                                id="couponCode"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 h-10 text-black leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter Coupon Code (if any):"
                            />
                       </div>
                       <div>
                        <button
                            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded "
                            onClick={handleCheckout}
                        >
                            Checkout
                        </button>
                        </div>
                        </div>
                        {/* Checkout Button */}
                    </div>
                )}
            </div>
        </BaseLayout>
    );
};

export default CheckoutPage;
