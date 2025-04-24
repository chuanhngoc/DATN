import { instanceLocal } from "../instance";

// Service để lấy danh sách sản phẩm
export const getProducts = async (params) => {
    try {
        const response = await instanceLocal.get('/new-products', { params });
        return response.data;
    } catch (error) {
        throw new Error('Không thể lấy danh sách sản phẩm');
    }
};

// Service để lấy chi tiết một sản phẩm
export const getProductById = async (id) => {
    try {
        const response = await instanceLocal.get(`/product-detail/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Không thể lấy thông tin sản phẩm');
    }
};

// Service để tìm kiếm sản phẩm
export const searchProducts = async (searchTerm) => {
    try {
        const response = await instanceLocal.get('/products/search', {
            params: { keyword: searchTerm }
        });
        return response.data;
    } catch (error) {
        throw new Error('Không thể tìm kiếm sản phẩm');
    }
};

// Hàm lấy tất cả sản phẩm và tìm kiếm sản phẩm
export const productAll = async (searchTerm = '') => {
    try {
        // Nếu có từ khóa tìm kiếm, gọi API search
        if (searchTerm) {
            const response = await instanceLocal.get(`/products`);
            return response.data;
        }
        // Nếu không có từ khóa, lấy tất cả sản phẩm
        const response = await instanceLocal.get('/products');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        throw error;
    }
};
