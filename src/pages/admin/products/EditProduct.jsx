import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Save, ArrowLeft, X, Star, StarOff, Plus, Trash2 } from 'lucide-react';
import productsService from '../../../services/products';
import categoryService from '../../../services/categoryService';
import sizeService from '../../../services/sizeService';
import colorService from '../../../services/colorService';


const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State quản lý loading
  const [loading, setLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  // State quản lý ảnh
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // State quản lý form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
  });


  // Query lấy danh sách danh mục
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll()
  });

  // Effect lấy thông tin sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoadingProduct(true);
        const data = await productsService.getById(id);
        console.log('Product Data:', data);

        // Cập nhật form data
        setFormData({
          name: data.name,
          description: data.description || '',
          category_id: data.category_id,
        });
        
        // Xử lý ảnh hiện có của sản phẩm
        const mainImage = data.main_image ? {
          id: 'main',
          url: `${import.meta.env.VITE_API_URL}/${data.main_image}`,
          isMain: true
        } : null;
        
        const additionalImages = (data.additional_images || []).map((img, index) => ({
          id: `additional_${index}`,
          url: `${import.meta.env.VITE_API_URL}/${img}`,
          isMain: false
        }));

        setExistingImages(mainImage ? [mainImage, ...additionalImages] : additionalImages);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Không thể tải thông tin sản phẩm');
      } finally {
        setIsLoadingProduct(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Mutation cập nhật sản phẩm
  const editMutation = useMutation({
    mutationFn: (data) => {
      const formDataWithImages = new FormData();
      
      // Thêm thông tin cơ bản
      formDataWithImages.append('name', data.name);
      formDataWithImages.append('description', data.description);
      formDataWithImages.append('category_id', data.category_id);
      formDataWithImages.append('_method', "PUT");
      // Thêm ảnh mới (nếu có)
      images.forEach((image, index) => {
        if (index === mainImageIndex) {
          formDataWithImages.append('main_image', image.file);
        } else {
          formDataWithImages.append('additional_images[]', image.file);
        }
      });

      // Thêm ảnh cũ cần giữ lại
      existingImages.forEach((image, index) => {
        formDataWithImages.append('existing_images[]', image.url);
        // Nếu không có ảnh mới và ảnh này là ảnh chính
        if (index === mainImageIndex && images.length === 0) {
          formDataWithImages.append('main_image_index', index.toString());
        }
      });

      return productsService.updateProduct(id, formDataWithImages);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['product', id]);
      toast.success('Cập nhật sản phẩm thành công');
      navigate('/admin/products');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu
    if (!formData.name || !formData.category_id) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    if (images.length === 0 && existingImages.length === 0) {
      toast.error('Vui lòng chọn ít nhất một ảnh');
      return;
    }

    setLoading(true);
    await editMutation.mutateAsync(formData);
    setLoading(false);
  };

  // Xử lý thay đổi input cơ bản
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // Xử lý khi chọn ảnh mới
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  // Xử lý xóa ảnh mới
  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    // Cập nhật lại chỉ số ảnh chính nếu cần
    if (mainImageIndex === index) {
      setMainImageIndex(0);
    } else if (mainImageIndex > index) {
      setMainImageIndex(prev => prev - 1);
    }
  };

  // Xử lý xóa ảnh cũ
  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    // Cập nhật lại chỉ số ảnh chính nếu cần
    if (mainImageIndex === index + images.length) {
      setMainImageIndex(0);
    }
  };

  // Đặt ảnh làm ảnh chính
  const setAsMainImage = (index, isExisting = false) => {
    setMainImageIndex(isExisting ? index + images.length : index);
  };


  // UI chính
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sửa sản phẩm</h1>
              <p className="mt-2 text-gray-600">Cập nhật thông tin cơ bản của sản phẩm</p>
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
            <div className="">
              {/* Phần upload ảnh */}
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

                  {/* Hiển thị ảnh mới */}
                  {images.length > 0 && (
                    <>
                      <h3 className="text-sm font-medium text-gray-700">Ảnh mới</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                            />
                            {/* Overlay controls */}
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                              <button
                                type="button"
                                onClick={() => setAsMainImage(index)}
                                className="p-1 bg-white rounded-full text-yellow-500 hover:text-yellow-600"
                                title={mainImageIndex === index ? "Ảnh chính" : "Đặt làm ảnh chính"}
                              >
                                {mainImageIndex === index ? <Star className="w-5 h-5" /> : <StarOff className="w-5 h-5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="p-1 bg-white rounded-full text-red-500 hover:text-red-600"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            {/* Badge ảnh chính */}
                            {mainImageIndex === index && (
                              <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                                Ảnh chính
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Hiển thị ảnh hiện có */}
                  {existingImages.length > 0 && (
                    <>
                      <h3 className="text-sm font-medium text-gray-700">Ảnh hiện có</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {existingImages.map((image, index) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.url}
                              alt={`Existing ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                            />
                            {/* Overlay controls */}
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                              <button
                                type="button"
                                onClick={() => setAsMainImage(index, true)}
                                className="p-1 bg-white rounded-full text-yellow-500 hover:text-yellow-600"
                                title={mainImageIndex === index + images.length ? "Ảnh chính" : "Đặt làm ảnh chính"}
                              >
                                {mainImageIndex === index + images.length ? <Star className="w-5 h-5" /> : <StarOff className="w-5 h-5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => removeExistingImage(index)}
                                className="p-1 bg-white rounded-full text-red-500 hover:text-red-600"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            {/* Badge ảnh chính */}
                            {mainImageIndex === index + images.length && (
                              <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                                Ảnh chính
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {/* Tên sản phẩm */}
                <div className="col-span-12">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                {/* Mô tả */}
                <div className="col-span-12">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Nhập mô tả sản phẩm"
                  />
                </div>

                {/* Danh mục */}
                <div className="col-span-12 md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct; 