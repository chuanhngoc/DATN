import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const urlAdmin = "http://127.0.0.1:8000/api/admin"
const urlLocal = "http://127.0.0.1:8000/api"
const instance = axios.create({
  baseURL: urlAdmin, // URL của API server
  timeout: 10000, // Timeout sau 10 giây
  headers: {
    'Content-Type': 'application/json',
  },
});

export const instanceLocal = axios.create({
  baseURL: urlLocal, // URL của API server
  timeout: 10000, // Timeout sau 10 giây
  headers: {
      'Content-Type': 'application/json',
  },
});

// instance.interceptors.request.use(
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



export default instance; 