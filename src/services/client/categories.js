import { instanceLocal } from "../instance";

export const categoriesAll = async () => {
    try {
        const response = await instanceLocal.get(`/categories`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        throw error;
    }
};

export const categoriesProducts = async (id) => {
    try {
        const response = await instanceLocal.get(`/categories/${id}/products`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        throw error;
    }
};

