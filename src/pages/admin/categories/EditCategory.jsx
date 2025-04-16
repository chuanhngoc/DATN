import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Schema validation cho form
const categorySchema = z.object({
  name: z.string()
    .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
    .max(50, 'Tên danh mục không được quá 50 ký tự')
});

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(categorySchema)
  });

  // Lấy thông tin danh mục từ API
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        // TODO: Gọi API lấy thông tin danh mục theo id
        // Đây là dữ liệu mẫu, thay thế bằng API call thực tế
        const mockCategory = {
          id: parseInt(id),
          name: 'Sneaker'
        };
        setCategory(mockCategory);
        setValue('name', mockCategory.name);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin danh mục:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, setValue]);

  const onSubmit = (data) => {
    // TODO: Gọi API cập nhật danh mục
    console.log('Cập nhật danh mục:', { id, ...data });
    // Sau khi cập nhật thành công, quay lại trang danh sách
    navigate('/admin/categories');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-6">
        <div className="text-red-500">Không tìm thấy danh mục</div>
        <button
          onClick={() => navigate('/admin/categories')}
          className="mt-4 text-gray-600 hover:text-gray-900"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sửa danh mục</h1>
        <button
          onClick={() => navigate('/admin/categories')}
          className="text-gray-600 hover:text-gray-900"
        >
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tên danh mục
          </label>
          <input
            {...register('name')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Nhập tên danh mục"
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <Edit2 size={20} />
          Cập nhật danh mục
        </button>
      </form>
    </div>
  );
};

export default EditCategory; 