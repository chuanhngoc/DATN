import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Schema validation cho form
const userSchema = z.object({
  name: z.string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được quá 50 ký tự'),
  email: z.string()
    .email('Email không hợp lệ'),
  role: z.enum(['admin', 'user'], {
    required_error: 'Vui lòng chọn vai trò'
  })
});

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(userSchema)
  });

  // Lấy thông tin người dùng từ API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // TODO: Gọi API lấy thông tin người dùng theo id
        // Đây là dữ liệu mẫu, thay thế bằng API call thực tế
        const mockUser = {
          id: parseInt(id),
          name: 'Nguyễn Văn A',
          email: 'vana@example.com',
          role: 'admin'
        };
        setUser(mockUser);
        setValue('name', mockUser.name);
        setValue('email', mockUser.email);
        setValue('role', mockUser.role);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, setValue]);

  const onSubmit = (data) => {
    // TODO: Gọi API cập nhật người dùng
    console.log('Cập nhật người dùng:', { id, ...data });
    // Sau khi cập nhật thành công, quay lại trang danh sách
    navigate('/admin/users');
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

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-red-500">Không tìm thấy người dùng</div>
        <button
          onClick={() => navigate('/admin/users')}
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
        <h1 className="text-2xl font-bold">Sửa người dùng</h1>
        <button
          onClick={() => navigate('/admin/users')}
          className="text-gray-600 hover:text-gray-900"
        >
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tên người dùng
          </label>
          <input
            {...register('name')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Nhập tên người dùng"
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            {...register('email')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            placeholder="Nhập email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Vai trò
          </label>
          <select
            {...register('role')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Chọn vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="user">Người dùng</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs italic mt-1">{errors.role.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <Edit2 size={20} />
          Cập nhật người dùng
        </button>
      </form>
    </div>
  );
};

export default EditUser; 