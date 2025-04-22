import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/auth';
import React from 'react';
const Login = () => {
  // Khai báo state để lưu giá trị của form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra form trống
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự!');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Gọi API đăng nhập
      const res = await authService.login({ email, password });
      location.reload();
      // Hiển thị thông báo thành công
      toast.success('Đăng nhập thành công!');

      // Chuyển hướng về trang chủ
      navigate('/');
    } catch (err: any) {
      // Hiển thị lỗi
      setError(err.response?.data?.message || 'Đăng nhập thất bại!');
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Đăng nhập
        </h2>

        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit}>
          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Input email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập email của bạn"
              disabled={loading}
            />
          </div>

          {/* Input password */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu của bạn"
              disabled={loading}
            />
          </div>

          {/* Nút đăng nhập */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Link đăng ký */}
        <p className="mt-4 text-center text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
