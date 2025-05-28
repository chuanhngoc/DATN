import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, ArrowLeft, X, Star, StarOff, Trash2 } from 'lucide-react';
import productsService from '../../../services/products';
import categoryService from '../../../services/categoryService';
import sizeService from '../../../services/sizeService';
import colorService from '../../../services/colorService';

const AddProduct = () => {
  // Hooks cơ bản
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State quản lý loading
  const [loading, setLoading] = useState(false);

  // State quản lý ảnh
  const [images, setImages] = useState([]); // Mảng chứa các ảnh đã chọn
  const [mainImageIndex, setMainImageIndex] = useState(0); // Chỉ số của ảnh chính

  // State quản lý form data
  const [formData, setFormData] = useState({
    name: '', // Tên sản phẩm
    description: '', // Mô tả sản phẩm
    category_id: '', // ID danh mục
  });

  // State quản lý biến thể sản phẩm
  const [variations, setVariations] = useState([
    { color_id: '', size_id: '', price: '', sale_price: '', stock_quantity: '' }
  ]);
  // Query lấy danh sách danh mục
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll()
  });

  // Query lấy danh sách kích thước
  const { data: sizes = [] } = useQuery({
    queryKey: ['sizes'],
    queryFn: async () => await sizeService.getAll()
  });

  // Query lấy danh sách màu sắc
  const { data: colors = [] } = useQuery({
    queryKey: ['colors'],
    queryFn: async () => await colorService.getAll()
  });

  // Mutation để tạo sản phẩm mới
  const addMutation = useMutation({
    mutationFn: (data) => {
      const formDataWithImages = new FormData();

      // Thêm các trường thông tin cơ bản
      formDataWithImages.append('name', data.name);
      formDataWithImages.append('description', data.description);
      formDataWithImages.append('category_id', data.category_id);

      // Xử lý ảnh: thêm ảnh chính và ảnh phụ
      images.forEach((image, index) => {
        if (index === mainImageIndex) {
          formDataWithImages.append('main_image', image.file);
        } else {
          formDataWithImages.append('images[]', image.file);
        }
      });

      // Thêm biến thể sản phẩm
      variations.forEach((variation) => {
        formDataWithImages.append(`color_id`, variation.color_id);
        formDataWithImages.append(`size_id`, variation.size_id);
        formDataWithImages.append(`price`, variation.price);
        formDataWithImages.append(`stock_quantity`, variation.stock_quantity);
        if (variation.sale_price) {
          formDataWithImages.append(`sale_price`, variation.sale_price);
        }
      });

      return productsService.createProduct(formDataWithImages);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Thêm sản phẩm thành công');
      navigate('/admin/products');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
      setLoading(false);
    }
  });

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    // Validate dữ liệu
    if (!formData.name || !formData.category_id) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    if (images.length === 0) {
      toast.error('Vui lòng chọn ít nhất một ảnh');
      return;
    }
    if (!variations.every(v => v.color_id && v.size_id && v.price)) {
      toast.error('Vui lòng điền đầy đủ thông tin biến thể');
      return;
    }
    // Kiểm tra giá sale phải nhỏ hơn giá gốc
    const invalidSalePrice = variations.some(v => 
      v.sale_price && Number(v.sale_price) >= Number(v.price)
    );
    if (invalidSalePrice) {
      toast.error('Giá khuyến mãi phải nhỏ hơn giá gốc');
      return;
    }

    setLoading(true);
    await addMutation.mutateAsync(formData);
    setLoading(false);
  };

  // Xử lý khi thay đổi input cơ bản
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý khi thay đổi biến thể
  const handleVariationChange = (index, field, value) => {
    setVariations(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  // Thêm biến thể mới
  const addVariation = () => {
    setVariations(prev => [...prev, { color_id: '', size_id: '', price: '', sale_price: '' }]);
  };

  // Xóa biến thể
  const removeVariation = (index) => {
    setVariations(prev => prev.filter((_, i) => i !== index));
  };

  // Xử lý khi chọn ảnh mới
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file, // File ảnh gốc
      preview: URL.createObjectURL(file) // URL để preview ảnh
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  // Xử lý xóa ảnh
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    // Cập nhật lại chỉ số ảnh chính nếu cần
    if (mainImageIndex === index) {
      setMainImageIndex(0);
    } else if (mainImageIndex > index) {
      setMainImageIndex(prev => prev - 1);
    }
  };

  // Đặt ảnh làm ảnh chính
  const setAsMainImage = (index) => {
    setMainImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
              <p className="mt-2 text-gray-600">Điền thông tin để tạo sản phẩm mới</p>
            </div>
            <button
              onClick={() => navigate('/admin/products')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="grid grid-cols-1 gap-6">
              {/* Phần upload ảnh giữ nguyên */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh sản phẩm
                </label>
                <div className="space-y-4">
                  {/* Input file */}
                  <div className="flex items-center space-x-6">
                    <div className="flex-1">
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept="image/*"
                        multiple
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        PNG, JPG, GIF tối đa 2MB. Có thể chọn nhiều ảnh.
                      </p>
                    </div>
                  </div>

                  {/* Grid hiển thị ảnh đã chọn */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        {/* Ảnh preview */}
                        <img
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        {/* Overlay controls */}
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                          {/* Nút đặt ảnh chính */}
                          <button
                            type="button"
                            onClick={() => setAsMainImage(index)}
                            className="p-1 bg-white rounded-full text-yellow-500 hover:text-yellow-600"
                            title={index === mainImageIndex ? "Ảnh chính" : "Đặt làm ảnh chính"}
                          >
                            {index === mainImageIndex ? <Star className="w-5 h-5" /> : <StarOff className="w-5 h-5" />}
                          </button>
                          {/* Nút xóa ảnh */}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1 bg-white rounded-full text-red-500 hover:text-red-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        {/* Badge ảnh chính */}
                        {index === mainImageIndex && (
                          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                            Ảnh chính
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <form className="space-y-6">

                {/* Tên sản phẩm & Mô tả */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tên sản phẩm */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>

                  {/* Mô tả */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      rows="4"
                      placeholder="Nhập mô tả sản phẩm"
                    />
                  </div>
                </div>

                {/* Danh mục */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Biến thể sản phẩm */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Biến thể sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={addVariation}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                    >
                     
                    </button>
                  </div>

                  <div className="space-y-6">
                    {variations.map((variation, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg relative">

                        {/* Màu sắc */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Màu sắc <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={variation.color_id}
                            onChange={(e) => handleVariationChange(index, 'color_id', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="">Chọn màu</option>
                            {colors.map(color => (
                              <option key={color.id} value={color.id}>
                                {color.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Kích thước */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kích thước <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={variation.size_id}
                            onChange={(e) => handleVariationChange(index, 'size_id', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="">Chọn size</option>
                            {sizes.map(size => (
                              <option key={size.id} value={size.id}>
                                {size.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Giá */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giá <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={variation.price}
                            onChange={(e) => handleVariationChange(index, 'price', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            min="0"
                            placeholder="Nhập giá"
                          />
                        </div>
                        {/* Số lượng */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số lượng <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={variation.quantity}
                            onChange={(e) => handleVariationChange(index, 'stock_quantity', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            min="0"
                            placeholder="Nhập số lượng"
                          />
                        </div>

                        {/* Giá khuyến mãi */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giá khuyến mãi
                          </label>
                          <input
                            type="number"
                            value={variation.sale_price}
                            onChange={(e) => handleVariationChange(index, 'sale_price', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            placeholder="Nhập giá KM"
                          />
                        </div>

                        {/* Nút xóa */}
                        {variations.length > 1 && (
                          <div className="flex items-start justify-end">
                            <button
                              type="button"
                              onClick={() => removeVariation(index)}
                              className="p-1 bg-red-100 rounded-full text-red-600 hover:text-red-700 mt-6"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </form>

            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-blue-600 border border-transparent rounded-lg font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <Plus className="w-5 h-5 mr-2" />
                {loading ? 'Đang thêm...' : 'Thêm sản phẩm'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct; 