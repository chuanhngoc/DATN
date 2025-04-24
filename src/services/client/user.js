import { token_auth } from "../../auth/getToken";
import { instanceLocal } from "../instance";
const getAuthHeaders = () => {
    const token_ = token_auth();
    return token_ ? { Authorization: `Bearer ${token_}` } : {};
};

export const profile = async (data) => {
    try {
        const response = await instanceLocal.get('/profile', {

            headers: getAuthHeaders(),

            data
        });
        return response.data;
    } catch (error) {
        throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
    }
};

export const updateProfile = async (data) => {
    try {
        const response = await instanceLocal.post('/user/profile', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...getAuthHeaders()
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
    }
};

export const updatePW = async (data) => {
    try {
        const response = await instanceLocal.post('/user/change-password', data, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
    }
};