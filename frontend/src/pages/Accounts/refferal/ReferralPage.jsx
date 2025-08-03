// src/pages/ReferralPage.jsx
import React from 'react';
import AccountLayout from '../AccountPage';
import useAffiliateData from '../../../hooks/useAffiliateData';


const ReferralPage = () => {
  const { data, loading, error } = useAffiliateData();

  if (loading) return <AccountLayout>Loading...</AccountLayout>;
  // if (error) return <AccountLayout>Error: {error.message}</AccountLayout>;

  return (
    <AccountLayout>
      {data ? (
        <div className="affiliate-data px-4 mb-10 ">
          <h2 className="text-gradient3 font-black text-3xl text-center">Affiliate Code: {data.affiliate_code}</h2>
          <div className='grid grid-cols-2 gap-4 '>
            <div className='p-4'>
              <p>Total Amount: ${data.total_amunt}</p>
              <p>Total Orders: {data.total_order}</p>
              <p>Commission Rate: {data.his_comission}%</p>
            </div>
            <div className='p-4'>
              <p>PayPal Address: {data.paypal_address}</p>
              <p>Total Clicks: {data.total_clicks}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">

          <button className='p-2 col-span-2 bg-violet-600 text-white font-semibold rounded-lg  '>Details</button>
          <button className='p-2 bg-violet-600 text-white font-semibold rounded-lg  '>Withdraw</button>
          </div>
        </div>
      ) : (
                <div className="affiliate-data px-4 mb-10 ">
          <p>No affiliate data found.</p>
          <h2 className="text-gradient3 font-black text-3xl text-center">Contact Us For Activate Affiliate Program</h2>
          </div>
      )}
    </AccountLayout>
  );
};

export default ReferralPage;
