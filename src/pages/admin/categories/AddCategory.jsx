import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Schema validation cho form
const categorySchema = z.object({
  name: z.string()
    .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
    .max(50, 'Tên danh mục không được quá 50 ký tự')
});

const AddCategory = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(categorySchema)
  });

  const onSubmit = (data) => {
    // TODO: Gọi API thêm danh mục
    console.log('Thêm danh mục:', data);
    // Sau khi thêm thành công, quay lại trang danh sách
    navigate('/admin/categories');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Thêm danh mục mới</h1>
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
          <Plus size={20} />
          Thêm danh mục
        </button>
      </form>
    </div>
  );
};

export default AddCategory; 