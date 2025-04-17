import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import productsService from '../../../services/products';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    is_active: true
  });

  // Fetch product data
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getById(id),
    onSuccess: (data) => {
      setFormData({
        name: data.name,
        description: data.description || '',
        category_id: data.category_id,
        is_active: data.is_active
      });
    }
  });

  const editMutation = useMutation({
    mutationFn: (data) => {
      const formDataWithImage = new FormData();
      formDataWithImage.append('name', data.name);
      formDataWithImage.append('description', data.description);
      formDataWithImage.append('category_id', data.category_id);
      formDataWithImage.append('is_active', data.is_active);
      if (image) {
        formDataWithImage.append('main_image', image);
      }
      return productsService.updateProduct(id, formDataWithImage);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category_id) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setLoading(true);
    await editMutation.mutateAsync(formData);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Sửa sản phẩm</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Tên sản phẩm *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>

        <div>
          <label className="block mb-1">Danh mục *</label>
          <input
            type="number"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Ảnh sản phẩm</label>
          {product?.main_image && (
            <img
              src={`${import.meta.env.VITE_API_URL}/${product.main_image}`}
              alt="Current product"
              className="w-32 h-32 object-cover mb-2"
            />
          )}
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="mr-2"
            />
            Đang bán
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="border px-4 py-2 rounded"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct; 