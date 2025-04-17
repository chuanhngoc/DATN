import instance from './instance'; // Import instance axios

// Lấy danh sách tất cả sản phẩm
const getAllProducts = async () => {
  try {
    const response = await instance.get('/products'); // GET request lấy danh sách sản phẩm
    return response.data; // Trả về danh sách sản phẩm
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Tạo mới một sản phẩm
const createProduct = async (data) => {
  try {
    const response = await instance.post('/products', data); // POST request tạo sản phẩm
    return response.data; // Trả về dữ liệu của sản phẩm vừa tạo
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Cập nhật thông tin sản phẩm
const updateProduct = async (id, data) => {
  try {
    const response = await instance.put(`/products/${id}`, data); // PUT request cập nhật thông tin sản phẩm
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

export default {
  getAllProducts,
  createProduct,
  updateProduct,
  addVariation,
  deleteVariation,
  deleteImage
};
