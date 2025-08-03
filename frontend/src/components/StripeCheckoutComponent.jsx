import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Load your Stripe publishable key
const stripePromise = loadStripe('pk_test_51QAD3j05xAWFmGaF8gNGF0eeDn50apxwfR5uk15d9XJy8NSn8guR452FkzSe87p1n6oYpJjWAQMthCmGOHPnGvRu00pZGnPAn8'); // Replace with your actual publishable key

const CheckoutButton = ({ priceId }) => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    // Call the Stripe API to create a checkout session
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: priceId, // Price ID of the product
          quantity: 1,
        },
      ],
      mode: 'payment',
      successUrl: window.location.origin + '/success',
      cancelUrl: window.location.origin + '/canceled',
    });

    if (error) {
      console.error("Error in redirecting to checkout: ", error);
    }
  };

  return (
    <button
      style={{
        padding: '10px',
        backgroundColor: 'blue',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
      }}
      onClick={handleCheckout}
    >
      Checkout
    </button>
  );
};

export default CheckoutButton;
