import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:8000';

// Function to get CSRF token from cookies
const getCsrfToken = () => {
    return Cookies.get('csrftoken');
};

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    config => {
        const token = getCsrfToken();
        if (token) {
            config.headers['X-CSRFToken'] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;
