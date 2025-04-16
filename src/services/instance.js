import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // URL của API server
  timeout: 10000, // Timeout sau 10 giây
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
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



export default instance; 