import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import GoogleLoginButton from '../GoogleLoginButton';
import BaseLayout from '../BaseLayout';

const Login = () => {
  const [currentUser, setCurrentUser] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/api/user/')
      .then((res) => {
        setCurrentUser(true);
        navigate('/');
      })
      .catch((error) => {
        setCurrentUser(false);
      });
  }, [navigate]);

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    client.post('/api/login/', { username, password })
      .then((res) => {
        setCurrentUser(true);
        navigate('/');
      })
      .catch((error) => {
        setShowSnackbar(true);
        setErrorMsg('Login failed. Please check your username and password.');
      });
  };

  if (currentUser) {
    navigate('/');
    return null;
  }

  return (
    <>
      {showSnackbar && (
        <div style={{ backgroundColor: '#ef4444' }} className="bg-red-500 text-white text-center py-2 px-4 rounded">
          {errorMsg}
        </div>
      )}
      <div className="bg-gray-900 flex flex-col items-center w-full min-h-screen">
        <div className="mt-20">
          <h1 className="text-gradient3 mt-10 font-black text-3xl text-center">Sign in</h1>
        </div>
        <div className="p-8 w-96 rounded-md mt-10 mb-10 text-center" style={{ backgroundColor: '#202127', padding: '1rem' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                Username
              </label>
              <div className="mt-2">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  style={{ backgroundColor: '#464955', color: 'white', padding: '.5rem' }}
                  className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                Password
              </label>
              <div className="mt-2">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  style={{ backgroundColor: '#464955', color: 'white', padding: '.5rem' }}
                  className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex mt-4 w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign in
              </button>
            </div>
            
          </form>
        </div>
        <div className="mb-10 mt-5">
          <GoogleLoginButton />
        </div>
        <p className="text-center text-sm mt-5 text-gray-400 mb-10">
          Not a member?{" "}
          <Link to="/signup" className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
            Create an Account
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
