import axios from 'axios';

function createClient() {
  axios.defaults.xsrfCookieName = 'csrftoken';
  axios.defaults.xsrfHeaderName = 'X-CSRFToken';
  axios.defaults.withCredentials = true;
  
  const client = axios.create({
    baseURL: "http://localhost:8000/"
  });
  return client;
}

const clients = createClient(); // Create an instance of the Axios client

export default clients;
