import axios from "axios";

// Create an Axios instance with a base URL from the environment variable.
const axiosAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add a request interceptor for error handling
axiosAPI.interceptors.request.use(
  (config) => {
    // You can add any request headers or configuration here
    config.headers["Content-Type"] = "application/json";
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["accept"] = "/*";
    return config;
  },
  (error) => {
    // Handle request errors (e.g., network issues)
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
axiosAPI.interceptors.response.use(
  (response) => {
    // Perform data transformations or checks on the response here
    return response;
  },
  (error) =>{
    // Handle response errors (e.g., HTTP status codes outside the 2xx range)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return error.response;
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(error.message);
    }
  }
);

// Common GET request function
export const get = (url: string, config = {}) => {
  return axiosAPI.get(url, config);
};

export default axiosAPI;
