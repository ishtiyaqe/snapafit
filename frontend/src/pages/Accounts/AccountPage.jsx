import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import client from '../../components/api/client';
import BaseLayout from '../../components/BaseLayout';
import Divider from '@mui/material/Divider';
import ExitToAppTwoToneIcon from '@mui/icons-material/ExitToAppTwoTone';
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import Cookies from 'js-cookie';



const AccountPage = ({ children }) => {
  const [fullName, setFullName] = useState('');
  const [fullNameFirstW, setFullNameFirstW] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState();


  useEffect(() => {
    client.get("/api/user")
      .then(function (res) {
        setCurrentUser(true);
      })
      .catch(function (error) {
        setCurrentUser(false);
        navigate('/login');
      });
  }, [currentUser, navigate]);


  useEffect(() => {
    client.get('/api/user_profiles/')
      .then((res) => {
        setFullName('');
        setFullNameFirstW('');
      })
      .catch((error) => {
        // navigate('/login');
      });
  }, [navigate]);

  function submitLogout(e) {
    e.preventDefault();
    // Get CSRF token from cookies
    const csrfToken = Cookies.get('csrftoken');

    client.post("/api/auth/logout/", {}, {
        withCredentials: true,
        headers: {
            'X-CSRFToken': csrfToken
        }
    })
    .then((res) => {
        setCurrentUser(false);
        navigate('/login');
    })
    .catch((error) => {
        console.error('Error logging out:', error);
    });

  }


  return (
    <BaseLayout>

      <div className='max-w-screen bg-white mx-auto'>
        <div className='grid sm:grid-cols-1 md:grid-cols-3 gap-2 px-4 max-w-fit'>

        <div className='bg-black text-white px-4 md:w-80 sm:w-full h-fit grid grid-cols-1 gap-2 rounded-md'>
          <Link to="/account" className='flex flex-cols space-x-4 text-xl font-semibold self-center mb-2 mt-4'>
            <div className={` ${location.pathname === '/account' ? 'bg-rose-500 w-2 self-stretch pr-2.5 justify-start items-center inline-flex duration-500 rounded' : 'hidden duration-500'}`}>
              <div className="w-4 h-5 relative flex-col justify-start items-start flex" />
            </div>
            <DashboardTwoToneIcon className={`self-center ${location.pathname === '/account' ? 'text-rose-500' : 'text-gray-600'}`} />
            <div className={`text-sm self-center ${location.pathname === '/account' ? 'text-rose-500' : 'text-gray-600'}`}>Dashboard</div>
          </Link>
          <Link to="/refferal" className='flex flex-cols space-x-4 text-xl font-semibold self-center mb-2'>
            <div className={` ${location.pathname === '/refferal' ? 'bg-rose-500 w-2 self-stretch pr-2.5 justify-start items-center inline-flex duration-500 rounded' : 'hidden duration-500'}`}>
              <div className="w-4 h-5 relative flex-col justify-start items-start flex" />
            </div>
            <DashboardTwoToneIcon className={`self-center ${location.pathname === '/refferal' ? 'text-rose-500' : 'text-gray-600'}`} />
            <div className={`text-sm self-center ${location.pathname === '/refferal' ? 'text-rose-500' : 'text-gray-600'}`}>Referral
            </div>
          </Link>
          <Link to="/chat" className='flex flex-cols space-x-4 text-xl font-semibold self-center mb-2'>
            <div className={` ${location.pathname === '/chat' ? 'bg-rose-500 w-2 self-stretch pr-2.5 justify-start items-center inline-flex duration-500 rounded' : 'hidden duration-500'}`}>
              <div className="w-4 h-5 relative flex-col justify-start items-start flex" />
            </div>
            <DashboardTwoToneIcon className={`self-center ${location.pathname === '/chat' ? 'text-rose-500' : 'text-gray-600'}`} />
            <div className={`text-sm self-center ${location.pathname === '/chat' ? 'text-rose-500' : 'text-gray-600'}`}>Chat
            </div>
          </Link>
          <Link to="/quots" className='flex flex-cols space-x-4 text-xl font-semibold self-center mb-2'>
            <div className={` ${location.pathname === '/quots' ? 'bg-rose-500 w-2 self-stretch pr-2.5 justify-start items-center inline-flex duration-500 rounded' : 'hidden duration-500'}`}>
              <div className="w-4 h-5 relative flex-col justify-start items-start flex" />
            </div>
            <DashboardTwoToneIcon className={`self-center ${location.pathname === '/quots' ? 'text-rose-500' : 'text-gray-600'}`} />
            <div className={`text-sm self-center ${location.pathname === '/quots' ? 'text-rose-500' : 'text-gray-600'}`}>Quots
            </div>
          </Link>
          <Link to="/workout" className='flex flex-cols space-x-4 text-xl font-semibold self-center mb-2'>
            <div className={` ${location.pathname === '/workout' ? 'bg-rose-500 w-2 self-stretch pr-2.5 justify-start items-center inline-flex duration-500 rounded' : 'hidden duration-500'}`}>
              <div className="w-4 h-5 relative flex-col justify-start items-start flex" />
            </div>
            <DashboardTwoToneIcon className={`self-center ${location.pathname === '/workout' ? 'text-rose-500' : 'text-gray-600'}`} />
            <div className={`text-sm self-center ${location.pathname === '/workout' ? 'text-rose-500' : 'text-gray-600'}`}>Workout
            </div>
          </Link>
          <Link to="/nutrations" className='flex flex-cols space-x-4 text-xl font-semibold self-center mb-2'>
            <div className={` ${location.pathname === '/nutrations' ? 'bg-rose-500 w-2 self-stretch pr-2.5 justify-start items-center inline-flex duration-500 rounded' : 'hidden duration-500'}`}>
              <div className="w-4 h-5 relative flex-col justify-start items-start flex" />
            </div>
            <DashboardTwoToneIcon className={`self-center ${location.pathname === '/nutrations' ? 'text-rose-500' : 'text-gray-600'}`} />
            <div className={`text-sm self-center ${location.pathname === '/nutrations' ? 'text-rose-500' : 'text-gray-600'}`}>Nutrations
            </div>
          </Link>

           <Link to="/calculate_calory" className='flex flex-cols space-x-4 text-xl font-semibold self-center mb-2'>
            <div className={` ${location.pathname === '/calculate_calory' ? 'bg-rose-500 w-2 self-stretch pr-2.5 justify-start items-center inline-flex duration-500 rounded' : 'hidden duration-500'}`}>
              <div className="w-4 h-5 relative flex-col justify-start items-start flex" />
            </div>
            <DashboardTwoToneIcon className={`self-center ${location.pathname === '/calculate_calory' ? 'text-rose-500' : 'text-gray-600'}`} />
            <div className={`text-sm self-center ${location.pathname === '/calculate_calory' ? 'text-rose-500' : 'text-gray-600'}`}>Calculate Calory
            </div>
          </Link>

          <hr />
              <form onSubmit={submitLogout}>
          <div className='flex flex-cols space-x-4 text-xl font-semibold self-center mb-2'>
            <div className='self-center ml-3'>
              <ExitToAppTwoToneIcon className='text-orange-500' />
            </div>
            <div>
                <button type="submit">Log out</button>
            </div>
          </div>
              </form>
        </div>

        <div className=" bg-white md:col-span-2 min-w-92  mb-4">
          {children}

        </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default AccountPage