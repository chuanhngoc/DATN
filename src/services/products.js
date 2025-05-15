import instance from './instance'; // Import instance axios

// Lấy danh sách tất cả sản phẩm
const getAllProducts = async (filters = {}) => {
    try {
        // Construct query parameters from filters
        const queryParams = new URLSearchParams();
        if (filters.name) queryParams.append('name', filters.name);
        if (filters.category_id) queryParams.append('category_id', filters.category_id);
        
        const queryString = queryParams.toString();
        const url = `/products${queryString ? `?${queryString}` : ''}`;
        
        const response = await instance.get(url); // GET request lấy danh sách sản phẩm
        return response.data; // Trả về danh sách sản phẩm
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Tạo mới một sản phẩm
const createProduct = async (data) => {
    try {
        const response = await instance.post('/products', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }); // POST request tạo sản phẩm
        return response.data; // Trả về dữ liệu của sản phẩm vừa tạo
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

// Cập nhật thông tin sản phẩm
const updateProduct = async (id, data) => {
    try {
        const response = await instance.post(`/products/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }); // PUT request cập nhật thông tin sản phẩm
        return response.data; // Trả về dữ liệu sản phẩm sau khi cập nhật
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

// Thêm biến thể cho sản phẩm
const addVariation = async (data) => {
    try {
        const response = await instance.post('/products/variation', data); // POST request thêm biến thể
        return response.data; // Trả về dữ liệu biến thể đã thêm
    } catch (error) {
        console.error('Error adding variation:', error);
        throw error;
    }
};

// Xoá biến thể của sản phẩm
const deleteVariation = async (id) => {
    try {
        const response = await instance.delete(`/products/variation/${id}`); // DELETE request xoá biến thể
        return response.data; // Trả về dữ liệu phản hồi sau khi xoá
    } catch (error) {
        console.error('Error deleting variation:', error);
        throw error;
    }
};

// Xoá ảnh của sản phẩm
const deleteImage = async (id) => {
    try {
        const response = await instance.delete(`/products/image/${id}`); // DELETE request xoá ảnh
        return response.data; // Trả về dữ liệu phản hồi sau khi xoá ảnh
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

const getById = async (id) => {
    try {
        const response = await instance.get(`/products/${id}`); // DELETE request xoá ảnh
        return response.data; // Trả về dữ liệu phản hồi sau khi xoá ảnh
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};


const getProductImages = async (id) => {
    try {
        const response = await instance.get(`/products/${id}/images`); // DELETE request xoá ảnh
        return response.data; // Trả về dữ liệu phản hồi sau khi xoá ảnh
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

const deleteProductImage = async (id) => {
    try {
        const response = await instance.delete(`/products/image/${id}`); // DELETE request xoá ảnh
        return response.data; // Trả về dữ liệu phản hồi sau khi xoá ảnh
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

const uploadProductImages = async (id, data) => {
    try {
        const response = await instance.post(`/products/${id}/images`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }); // DELETE request xoá ảnh
        return response.data; // Trả về dữ liệu phản hồi sau khi xoá ảnh
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

const createProductVariant = async (id, data) => {
    try {
        const response = await instance.post(`/products/variation`, {
            ...data, product_id: id
        }); //thêm biến thể
        return response.data;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

const updateProductVariant = async (id, data) => {
    try {
        const response = await instance.put(`/products/variation/${id}`, data); //sửa biến thể
        return response.data;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

const getProductVariants = async (id) => {
    try {
        const response = await instance.get(`/products/${id}/variants`); //thêm biến thể
        return response.data;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

const deleteProductVariant = async (id) => {
    try {
        const response = await instance.delete(`/products/variation/${id}`); //delete biến thể
        return response.data;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};
export default {
    getAllProducts,
    createProduct,
    updateProduct,
    addVariation,
    deleteVariation,
    deleteImage,
    getById,
    getProductImages,
    uploadProductImages,
    deleteProductImage,
    createProductVariant,
    updateProductVariant,
    getProductVariants,
    deleteProductVariant
};
