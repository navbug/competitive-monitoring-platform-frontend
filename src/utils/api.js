import axios from 'axios';
import { API_BASE_URL } from '../../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;



// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { API_BASE_URL } from './constants';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 30000, // 30 seconds
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle network errors
//     if (!error.response) {
//       toast.error('Network error. Please check your connection.');
//       return Promise.reject(error);
//     }

//     const { status, data } = error.response;

//     // Handle specific error cases
//     switch (status) {
//       case 401:
//         localStorage.removeItem('token');
//         window.location.href = '/login';
//         toast.error('Session expired. Please login again.');
//         break;
//       case 403:
//         toast.error('You do not have permission to perform this action.');
//         break;
//       case 404:
//         toast.error('Resource not found.');
//         break;
//       case 500:
//         toast.error('Server error. Please try again later.');
//         break;
//       default:
//         if (data?.message) {
//           toast.error(data.message);
//         }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;