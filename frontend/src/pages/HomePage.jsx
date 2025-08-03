import React, { useEffect, useState, useRef } from 'react';
import BaseLayout from '../components/BaseLayout';
import Client from '../components/api/client'
import footerImage from '../assets/images/13Image.png'
import DoubleQuote from '../assets/images/6Image.png'
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null); // Ref to keep track of interval
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Client.get('/api/home');
        setData(response.data);
        console.log(response.data); // Log the data received from the API
        setLoading(false); // Stop loading after data is fetched
        if (intervalRef.current) {
          clearInterval(intervalRef.current); // Clear interval on successful fetch
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Stop loading on error as well
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval to fetch data every 6 seconds if data is null
    intervalRef.current = setInterval(() => {
      if (data === null) {
        fetchData();
      } else {
        clearInterval(intervalRef.current); // Stop interval once data is not null
      }
    }, 6000);

    // Clean up interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Add data to dependency array

  return (
    <BaseLayout>
      <div className="max-w-screen bg-white mx-auto">
        {/* First Section */}
        <div className="md:ml-[82px] ml-0 px-4 mr-10 flex lg:flex-row flex-col justify-between">
          <div className="flex flex-col pt-12">
            <div className="flex space-y-5 flex-col justify-center text-center">
              <h1 className="md:text-5xl text-3xl font-inter font-black leading-[66px] tracking-[-1px] md:text-left text-center text-gradient">
                Missing Equipment?
              </h1>
              <h1 className="md:text-5xl md:-translate-y-0 -translate-y-10 text-3xl font-inter font-black leading-[66px] tracking-[-1px] md:text-left text-center text-gradient">
                Just Snap a Picture!
              </h1>
            </div>
            <div className="md:mt-[30px] -mt-10 md:w-[566px] w-full flex items-center justify-center">
              <p className="font-inter font-semibold text-start tracking-[0.3px] md:text-[22px] text-sm md:ml-0 ml-5 leading-[44px] text-black">
                Our AI-driven WhatsApp chatbot, Snapafit, creates custom workout
                plans based on your equipment. Snap a photo and get a
                personalized plan tailored to your needs. Start your fitness
                journey today!
              </p>
            </div>
            <div className="pl-[62px] flex items-center pt-8 md:pt-28">
              <button className="px-5 font-inter hover:scale-105 duration-200 transition-all py-2 bg-gradient-to from-purple-700 to-red-500 text-white rounded-md">
                Start Your Free Trial Now!
              </button>
            </div>
            <div className="flex flex-col mt:mt-24 mt-12 ">
              <h1 className="md:text-[33px] text-xl font-inter m-[1px] font-black leading-[1px] tracking-[1px] text-left">
                We've Got You Covered!
              </h1>
              <hr className="mt-4 flex items-start md:min-w-[295px] min-w-[180px] max-w-[20px] md:ml-16 ml-11 border-b border-black" />
            </div>
          </div>
          <div className="pt-12 lg:pt-0 flex justify-center">
            {data && data.hr && data.hr.image_url && (
              <img src={`http://localhost:8000${data.hr.image_url}`} alt="Hero" className="w-full h-auto" />
            )}
          </div>
        </div>
        <div className="md:mt-0 mt-10">
          <h1
            className="font-roboto pb-20 pt-12 text-[50px] font-black leading-[48px] tracking-[-1px] text-center text-gradient1">
            Why Choose Us?
          </h1>
        </div>
        {/* secoundSection */}
        <div className="md:ml-[82px] ml-0 px-4 mr-10 flex lg:flex-row flex-col justify-between">
          <div className="flex flex-col mt-[-40px] md:mt-12">
            <div className="space-y-[30px]">
              <h1
                className="md:text-[22px] text-lg font-inter font-black leading-[25px] tracking-[1px] text-left text-gradient2">
                Personalized AI Fitness Plans On Whatsapp
              </h1>
              <div className="md:w-[540px] h-[78px] md:ml-10 ml-0">
                <p className="text-customColor font-inter text-[18px] font-normal leading-[26px] text-left">
                  Get customized workout plans by simply taking pictures of your equipment. Our AI
                  tailors
                  workouts to your goals and resources, ensuring you don’t need a full gym to get fit.
                </p>
              </div>
            </div>
            <div className="space-y-8 md:pt-[43px] pt-16">
              <h1
                className="md:text-[22px] text-lg font-inter font-black leading-[25px] tracking-[1px] text-left text-gradient2">
                Anytime, Anywhere Access
              </h1>
              <div className="md:w-[540px] h-[78px] md:ml-10 ml-0">
                <p
                  className="text-customColor font-inter text-[18px] m-[10px] font-normal leading-[26px] text-left">
                  Conveniently access your fitness plan and coaching directly through WhatsApp, making
                  it easy to stay on track no matter where you are.
                </p>
              </div>
            </div>
            <div className="space-y-9 md:pt-[43px] pt-16">
              <h1
                className="md:text-[22px] text-lg font-inter font-black leading-[25px] tracking-[1px] text-left text-gradient2">
                Adaptive Workouts
              </h1>
              <div className="md:w-[540px] h-[78px] md:ml-10 ml-0">
                <p
                  className="text-customColor font-inter text-[18px] m-[10px] font-normal leading-[26px] text-left">
                  Progress faster with adaptive workouts that evolve with your fitness level, keeping you
                  challenged and motivated.
                </p>
              </div>
            </div>
          </div>
          <div className="py-14 lg:py-0">
            {data && data.pp && data.pp.image_url && (
              <img src={`http://localhost:8000${data.pp.image_url}`} alt="Why  chose Us" className="md:w-[585px] w-full md:h-[587px] h-3/4" />
            )}
          </div>
        </div>
        {/* ThirdSection */}
        <div className="md:ml-[82px] md:pt-0 pt-5 px-4 mr-10 flex items-start">
          <div className="text-left text-[50px] font-black leading-[49px] tracking-[-1px] text-gradient3">
            How it works
          </div>
        </div>
        <div
          className="md:ml-[82px] gap-10 md:gap-0 ml-0 md:mr-10 mr-0 px-4 flex lg:flex-row flex-col pt-16 justify-between">
          <div className="flex flex-col gap-5 md:ml-10 md:mt-0 mt-[-30px] ml-0 md:w-[540px] h-[656px]">
            <div className="flex flex-col gap-2">
              <h1 className="text-customColor font-inter text-3xl">1</h1>
              <div>
                <h2 className="text-customColor font-inter text-xl font-semibold">Sign Up & Set Goals</h2>
                <p className="text-base font-inter text-customColor font-normal text-left">
                  Register and set your fitness objectives
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-customColor font-inter text-3xl">2</h1>
              <div>
                <h2 className="text-customColor font-inter text-xl font-semibold ">Scan Your Equipment</h2>
                <p
                  className="text-base text-customColor font-inter font-normal leading-[26px] w-full text-left  ">
                  Use your phone to take pictures of the equipment you have available. Our AI will
                  customize a workout plan based on what you have.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-customColor font-inter text-3xl">3</h1>
              <div>
                <h2 className="text-customColor text-xl font-inter font-semibold ">
                  Personalized Training & Real-Time
                  Feedback</h2>
                <p
                  className="text-base text-customColor font-inter font-normal leading-[26px] w-full text-left ">
                  Receive a custom workout plan tailored to your goals and equipment. Get real-time
                  feedback on your form to ensure proper technique
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-customColor text-3xl font-inter">4</h1>
              <div>
                <h2 className="text-customColor text-xl font-semibold font-inter ">Track Progress & Adapt</h2>
                <p
                  className="text-base text-customColor font-normal leading-[26px] w-full text-left font-inter ">
                  Monitor your progress with detailed analytics and enjoy adaptive workouts that
                  evolve with your fitness journey. Connect with a supportive community for extra
                  motivation.
                </p>
              </div>
            </div>
          </div>
          {/* image tap */}
          <div className="flex flex-col items-center pt-5">
            <div className="md:ml-[152px] ml-0 md:mr-0 mr-20">
              {data && data.hw[0] && data.hw[0].image && (
                <img src={`http://localhost:8000/media/${data.hw[0].image}`} alt="Why  chose Us" className="w-[225px] h-[237px] object-contain" />
              )}

            </div>
            <div className="md:-translate-y-[125px] -translate-y-36 ml-[200px] md:ml-[465px]">
              {data && data.hw[1] && data.hw[1].image && (
                <img src={`http://localhost:8000/media/${data.hw[1].image}`} alt="Why  chose Us"
                  className="md:w-[295px] w-[200px] h-[292px] object-contain" />
              )}
            </div>
            <div className="md:ml-14 ml-0 md:mr-0 mr-20 md:-translate-y-[266px] -translate-y-72">
              {data && data.hw[2] && data.hw[2].image && (
                <img src={`http://localhost:8000/media/${data.hw[2].image}`} alt="Why  chose Us"
                  className="md:w-[331px] w-[260px] h-[335px] object-contain" />
              )}

            </div>
          </div>
        </div>
        {/* FourthSection */}
        <div className="md:mt-[-150px] mt-[-240px] lg:-mb-96 flex flex-col items-center justify-center">
          <h1
            className="text-gradient3 md:text-[50px] text-5xl font-black leading-[49px] tracking-[-1px] text-center ">
            What Our Clients Say About Us
          </h1>
          <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-16 lg:gap-8 pt-[158px] md:px-20 px-4">
            {data && data.sy && data.sy.map((client, index) => (
              <div
                key={index}
                className="border border-gray-100 shadow-md flex flex-col px-5 py-[77px] rounded-xl hover:scale-105 duration-200 transition-all">
                <div className="flex flex-col items-center justify-center text-center gap-2 relative">
                  <div className="flex absolute -translate-y-[220px] items-center justify-center">
                    {client.image && (
                      <img src={`http://localhost:8000/media/${client.image}`} alt="Client" className="w-[102px] h-[102px] rounded-full" />
                    )}
                  </div>
                  <h1 className="font-lato text-[24px] font-bold leading-[28.8px] text-center text-customColor">
                    {client.name}
                  </h1>

                  <img src={DoubleQuote} alt="image" className="w-9 h-9" />
                  <p className="w-[346px] text-lg font-inter font-normal leading-[21.78px] text-center text-customColor">
                    {client.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <!-- responsive card slider --> */}
        <div className="md:hidden">
          <div className="swiper mySwiper p-5 ">
            <div className="swiper-wrapper">
              {data && data.sy && data.sy.map((client, index) => (
                <div className="swiper-slide" key={index}>
                  <div className="flex items-center translate-y-12 justify-center">
                    {client.image && (
                      <img src={`http://localhost:8000/media/${client.image}`} alt={client.name} className="w-[102px] h-[102px] rounded-full" />
                    )}
                  </div>
                  <div className="border border-gray-100 shadow-md py-20 px-2 rounded-xl">
                    <div className="flex flex-col items-center justify-center text-center gap-2 relative">
                      <h1 className="font-lato text-[24px] font-bold leading-[28.8px] text-center text-customColor">
                        {client.name}
                      </h1>

                      <img src={DoubleQuote} alt="rating" className="w-9 h-9" />
                      <p className="text-lg font-inter font-normal leading-[21.78px] text-center text-customColor">
                        {client.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="swiper-pagination"></div>
          </div>
        </div>
        {/* <!--FiveSection end --> */}
        <div className="flex flex-col items-center md:translate-y-0 translate-y-1 justify-center md:pt-96 my-[109px] gap-[95px] px-2">
          <h1 className="text-gradient3 font-inter text-[50px] font-black leading-[49px] tracking-[-1px] text-center">
            Choose Your Package!
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-1 md:gap-8 gap-2 pb-10 md:-translate-y-0 -translate-y-10">
            {data && data.packages && data.packages.map((pkg, index) => (
              <div key={index} className={`border border-gray-200 ${index % 2 === 1 ? 'bg-black' : 'bg-white'} rounded-xl relative pt-10 pb-16 md:px-10 px-1`}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-10">
                    <h1 className={`uppercase text-center md:text-start font-black text-lg leading-[24px] font-inter ${index % 2 === 1 ? 'text-white' : 'text-blue-700'}`}>
                      {pkg.name}
                    </h1>
                    <div className="flex gap-2 md:ml-7 ml-0 justify-center md:justify-start">
                      <h1 className={`font-black md:text-lg text-sm font-inter ${index % 2 === 1 ? 'text-white' : 'text-black'}`}>${pkg.discounted_price_usd}</h1>
                      <h1 className={`font-black md:text-lg text-sm ${index % 2 === 1 ? 'text-gray-100' : 'text-gray-300'} font-inter`}>/{pkg.duration_months} MONTH</h1>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {data.package_elements[pkg.id.toString()] && data.package_elements[pkg.id.toString()].map(element => (
                      <div key={element.id} className="flex md:gap-3 items-center">
                        <FaStar className="w-6 h-6 " style={{color: '#F2A922',}} />
                        <h1 className={`font-semibold md:text-lg text-xs md:leading-[24px] uppercase font-inter ${index % 2 === 1 ? 'text-white' : 'text-gray-400'}`}>
                          {element.pointer}
                        </h1>
                      </div>
                    ))}
                    <hr className={`md:w-[272px] border ${index % 2 === 1 ? 'border-black' : 'border-gray-200'} w-[170px]`} />
                    <div>
                      <Link to={`checkout/${pkg.id}`} >
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
        {/* <!--SaverSection --> */}


        <div className="mt-24 relative bg-cover bg-center h-full" style={{ backgroundImage: `url(${footerImage})` }}>
          <div className="flex items-center justify-center px-4">
            <div className="-translate-y-12">
              <div className="md:w-[768px] md:h-[463px] bg-gray-100 py-12 rounded-2xl">
                <div className="flex flex-col gap-[14px]">
                  {data && data.faqs && data.faqs.map((faq, index) => (
                    <div key={faq.id} className="mx-6 bg-white rounded-md">
                      <button
                        className="w-full text-left py-4 px-6 flex justify-between items-center"
                        onClick={() => toggleAccordion(index)}
                      >
                        <span className="text-lg leading-[21.6px] font-inter font-bold">
                          {faq.question}
                        </span>
                        <div>
                          <svg
                            id={`icon-${faq.id}`}
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className={activeIndex === index ? "" : "-rotate-90"}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.17599 9.13207L11.833 5.47507C11.8995 5.40198 11.9801 5.34299 12.0699 5.30159C12.1596 5.26018 12.2568 5.23721 12.3556 5.23403C12.4544 5.23084 12.5528 5.24751 12.6451 5.28305C12.7373 5.31859 12.8215 5.37227 12.8926 5.44092C12.9637 5.50957 13.0203 5.59179 13.0591 5.68272C13.0979 5.77364 13.1181 5.87143 13.1184 5.97028C13.1187 6.06913 13.0992 6.16704 13.061 6.25821C13.0228 6.34938 12.9667 6.43197 12.896 6.50107L12.878 6.51907L8.69899 10.6991C8.5604 10.8376 8.37246 10.9155 8.17649 10.9155C7.98052 10.9155 7.79257 10.8376 7.65399 10.6991L3.47499 6.52007C3.40519 6.45264 3.34936 6.37212 3.31068 6.2831C3.272 6.19409 3.25123 6.09834 3.24956 6.0013C3.24789 5.90426 3.26535 5.80784 3.30094 5.71755C3.33653 5.62726 3.38955 5.54487 3.45699 5.47507C3.52442 5.40527 3.60494 5.34944 3.69395 5.31076C3.78296 5.27208 3.87872 5.25132 3.97576 5.24964C4.0728 5.24797 4.16921 5.26543 4.2595 5.30102C4.34979 5.33661 4.43219 5.38964 4.50199 5.45707L4.51999 5.47507L8.17599 9.13207Z"
                              fill="#6F1DF4"
                              stroke="#6F1DF4"
                              strokeWidth="0.5"
                            />
                          </svg>
                        </div>
                      </button>
                      <div id={`content-${faq.id}`} className={`px-6 pb-4 ${activeIndex === index ? "" : "hidden"}`}>
                        <p className="font-normal font-inter text-lg text-gray-700">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </BaseLayout >
  );
};

export default HomePage;
