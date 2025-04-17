import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../../../services/userService';
import { toast } from 'react-toastify';

// Schema validation cho form
const userSchema = z.object({
  name: z.string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được quá 50 ký tự'),
  email: z.string()
    .email('Email không hợp lệ'),
  password: z.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  password_confirmation: z.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  phone: z.string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(11, 'Số điện thoại không được quá 11 số'),
  address: z.string()
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
    .max(200, 'Địa chỉ không được quá 200 ký tự'),
  role: z.enum(['admin', 'user'], {
    required_error: 'Vui lòng chọn vai trò'
  })
}).refine((data) => data.password === data.password_confirmation, {
  message: "Mật khẩu không khớp",
  path: ["password_confirmation"],
});

const AddUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema)
  });

  const addMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Thêm người dùng thành công');
      navigate('/admin/users');
    },
    onError: () => {
      toast.error('Thêm người dùng thất bại');
    }
  });
  const onSubmit = (data) => {
    addMutation.mutate(data);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Thêm người dùng mới</h1>
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
            Mật khẩu
          </label>
          <input
            {...register('password')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="Nhập mật khẩu"
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Xác nhận mật khẩu
          </label>
          <input
            {...register('password_confirmation')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="Nhập lại mật khẩu"
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-xs italic mt-1">{errors.password_confirmation.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Số điện thoại
          </label>
          <input
            {...register('phone')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="tel"
            placeholder="Nhập số điện thoại"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs italic mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Địa chỉ
          </label>
          <textarea
            {...register('address')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nhập địa chỉ"
            rows={3}
          />
          {errors.address && (
            <p className="text-red-500 text-xs italic mt-1">{errors.address.message}</p>
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
          disabled={addMutation.isPending}
        >
          <Plus size={20} />
          {addMutation.isPending ? 'Đang thêm...' : 'Thêm người dùng'}
        </button>
      </form>
    </div>
  );
};

export default AddUser; 