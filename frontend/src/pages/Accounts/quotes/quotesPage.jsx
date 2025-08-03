import React, { useState, useEffect } from 'react';
import BaseLayout from '../AccountPage';
import ShareButton from '.././../../components/ShareButton';
import clients from '../../../components/api/client';

const quotesPage = () => {
   const [quotes, setQuotes] = useState([]);
   console.log(quotes)
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await clients.get(`/api/get_daily_quotes/`);
        setQuotes(response.data);
      } catch (err) {
        console.log(err);
      } 
    };

    fetchExercise();
  }, []);


  return (
    <BaseLayout>
      <div className='mb-10'>
        <h2 className="text-gradient3 font-black text-3xl text-center">Daily quotes</h2>


        <div className="flex justify-center mb-4">
          <div className='bg-purple-500 rounded-lg mt-10 text-white text-3xl font-bold lg:w-96 w-80  h-auto text-center p-4 '>
          {quotes && quotes.quote ? quotes.quote.replace(/"/g, '') : 'Loding..'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 px-4">
          <button className="bg-violet-600 text-white p-2 col-span-2 rounded-lg w-full font-semibold text-md mt-10 mb-10">
            Get Inspired Today
          </button>
          <ShareButton />
        </div>

        <p className="text-gray-600 text-sm text-center mt-4">
          Believe in yourself every day
        </p>
      </div>

    </BaseLayout>
  )
}

export default quotesPage