import api from './api/google_client'; // the axios instance created above
import { loginSuccess, fetchUser } from '../actions/auth'; // Redux actions
import { useDispatch } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";

export const googleLogin = async (accessToken) => {
    
    try {
        const response = await api.post('/api/auth/google/', {
            access_token: accessToken,
        });
        const data = response.data;
        if (data.key) {
            // Store the token in localStorage
            localStorage.setItem('authToken', data.key);
            return data.key;
            
        } else {
            throw new Error('Login failed: No authentication token received');
        }
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

const GoogleLoginButton = () => {
    const navigate = useNavigate();
    
    const dispatch = useDispatch();

    const login = useGoogleLogin({
        onSuccess: async tokenResponse => {
            try {
                const authToken = await googleLogin(tokenResponse.access_token);
                console.log(authToken)
                dispatch(loginSuccess(authToken));
                dispatch(fetchUser(authToken)); // Fetch and store user data
                navigate('/');
                window.location.reload();
            } catch (error) {
                console.error('Google login failed:', error);
            }
        },
    });

    return (
        <button className='inline-flex items-center justify-center space-x-4 w-full dark:text-gray-200 text-black' onClick={() => login()}>
           <FcGoogle />
           <div>

            Login with Google
           </div>
        </button>
    );
};

export default GoogleLoginButton;
