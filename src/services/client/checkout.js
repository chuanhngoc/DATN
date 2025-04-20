import { token_auth } from "../../auth/getToken";
import { instanceLocal } from "../instance";
const getAuthHeaders = () => {
    const token_ = token_auth();
    return token_ ? { Authorization: `Bearer ${token_}` } : {};
};

export const checkout = async (data) => {
    try {
        const response = await instanceLocal.post('/checkout', data, {
            headers: getAuthHeaders(),
            data
        });
        return response.data;
    } catch (error) {
        throw new Error('Lỗi');
    }
};