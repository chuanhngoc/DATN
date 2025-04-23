import { token_auth } from "../../auth/getToken";
import { instanceLocal } from "../instance";

// Helper function để tạo headers với token
const getAuthHeaders = () => {
    const token_ = token_auth();
    return token_ ? { Authorization: `Bearer ${token_}` } : {};
};

// Lấy giỏ hàng
export const getCart = async () => {
    try {
        const response = await instanceLocal.get('/cart', { 
            headers: getAuthHeaders() 
        });
        return response.data;
    } catch (error) {
        throw new Error('Không thể lấy giỏ hàng');
    }
};

// Thêm sản phẩm vào giỏ
export const addToCart = async (data) => {
    try {
        const response = await instanceLocal.post('/cart/add', data, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Vui lòng đăng nhập để thêm vào giỏ hàng');
        }
        throw new Error('Không thể thêm sản phẩm vào giỏ hàng');
    }
};

// Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItem = async (data) => {
    try {
        const response = await instanceLocal.put('/cart/update', data, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        throw new Error('Không thể cập nhật số lượng sản phẩm');
    }
};

// Xóa sản phẩm khỏi giỏ
export const removeFromCart = async (data) => {
    try {
        const response = await instanceLocal.delete('/cart/remove', {
            headers: getAuthHeaders(),
            data
        });
        return response.data;
    } catch (error) {
        throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
    }
};

// Lấy dữ liệu checkout
export const getCheckoutData = async (data) => {
    try {
        const response = await instanceLocal.post('/cart/checkout-data', data, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        throw new Error('Không thể lấy dữ liệu thanh toán');
    }
};