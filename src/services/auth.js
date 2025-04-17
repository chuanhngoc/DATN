import { instanceLocal } from './instance';

const authService = {
    // Đăng nhập
    login: async (data) => {
        const response = await instanceLocal.post('/login', data);
        // Lưu token vào localStorage
        if (response.data) {
            localStorage.setItem('token', JSON.stringify(response.data));
        }
        return response.data;
    },

    // Đăng ký
    register: async (data) => {
        const response = await instanceLocal.post('/signup', data);
        return response.data;
    },

    // Đăng xuất
    logout: () => {
        // Xóa token khỏi localStorage
        localStorage.removeItem('token');
    },

    // Lấy token từ localStorage
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Kiểm tra đã đăng nhập chưa
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Lấy thông tin user hiện tại
    getCurrentUser: async () => {
        const response = await instanceLocal.get('/auth/me');
        return response.data;
    }
};

// Thêm interceptor để tự động thêm token vào header
// instance.interceptors.request.use(
//     (config) => {
//         const token = authService.getToken();
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// Thêm interceptor để xử lý lỗi 401 (token hết hạn)
// instance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             authService.logout();
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

export default authService;
