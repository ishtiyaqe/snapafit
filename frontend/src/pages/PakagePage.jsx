import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa'; // Import the FaStar icon
import { Link } from 'react-router-dom'; // Import Link for navigation
import thumbsUpImage from '../assets/human-hand-thumb-up-png.webp'; // Replace with your thumbs-up image path
import BaseLayout from '../components/BaseLayout';
import clients from '../components/api/client'; // Import your API client

const PakagePage = () => {
    const [data, setData] = useState({ packages: [], package_elements: {} });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await clients.get('/api/home');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching packages:", error);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <BaseLayout>
            <div className="">
                <h1 className="text-gradient3 font-inter text-[50px] font-black leading-[49px] tracking-[-1px] text-center">
                    Choose Your Package!
                </h1>

                <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 m-10">
                    {data.packages && data.packages.map((pkg, index) => (
                        <div key={index} className={`border border-gray-200 ${index % 2 === 1 ? 'bg-black' : 'bg-white'} rounded-xl relative pt-10 pb-16 md:px-10 px-1`}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-10">
                                    <h1 className={`uppercase text-center md:text-start font-black text-lg leading-[24px] font-inter ${index % 2 === 1 ? 'text-white' : 'text-blue-700'}`}>
                                        {pkg.name}
                                    </h1>
                                    <div className="flex gap-2 md:ml-7 ml-0 justify-center md:justify-start">
                                        <h1 className={`font-black md:text-lg text-sm font-inter ${index % 2 === 1 ? 'text-white' : 'text-black'}`}>${pkg.discounted_price_usd}</h1>
                                        <h1 className={`font-black md:text-lg text-sm ${index % 2 === 1 ? 'text-gray-100' : 'text-gray-300'} font-inter`}>
                                            /{pkg.duration_months} MONTH
                                        </h1>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {data.package_elements[pkg.id.toString()] && data.package_elements[pkg.id.toString()].map(element => (
                                        <div key={element.id} className="flex md:gap-3 items-center">
                                            <FaStar className="w-6 h-6" style={{ color: '#F2A922' }} />
                                            <h1 className={`font-semibold md:text-lg text-xs md:leading-[24px] uppercase font-inter ${index % 2 === 1 ? 'text-white' : 'text-gray-400'}`}>
                                                {element.pointer}
                                            </h1>
                                        </div>
                                    ))}
                                    <hr className={`md:w-[272px] border ${index % 2 === 1 ? 'border-black' : 'border-gray-200'} w-[170px]`} />
                                    <div>
                                        <Link to={`/checkout/${pkg.id}`}>
                                            <button className="sm:px-9 px-2 md:text-lg text-xs py-[5px] hover:scale-105 duration-200 transition-all font-inter font-black text-black leading-[24px] bg-white border-2 border-gray-200 uppercase rounded-md">
                                                Choose {pkg.duration_months} Month Plan
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </BaseLayout>
    );
};

export default PakagePage;
