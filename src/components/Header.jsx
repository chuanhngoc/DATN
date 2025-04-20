import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Header = () => {
  // State lưu thông tin người dùng (nếu đã đăng nhập)
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Khi component mount, lấy user từ localStorage (nếu có)
    const storedUser = localStorage.getItem('token');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Chuyển JSON thành object và set vào state
    }
  }, []);

  const handleLogout = () => {
    // Xoá thông tin user và token khỏi localStorage
    localStorage.removeItem('token');

    // Cập nhật state để giao diện chuyển về trạng thái chưa đăng nhập
    setUser(null);

    // Điều hướng về trang đăng nhập
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        {/* Thanh điều hướng phía trên */}
        <div className="flex items-center justify-between py-4">
          {/* Logo - điều hướng về trang chủ */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            SHOE<span className="text-red-500">STORE</span>
          </Link>

          {/* Ô tìm kiếm (chỉ hiển thị trên màn hình lớn) */}
          <div className="hidden md:block w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-red-500"
              />
              <button className="absolute right-3 top-2 text-gray-500">
                🔍
              </button>
            </div>
          </div>

          {/* Thông tin người dùng và giỏ hàng */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Nếu đã đăng nhập, hiển thị tên người dùng và nút đăng xuất
              <div className="flex items-center space-x-3">
                <span className="text-gray-600">👤 {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Nếu chưa đăng nhập, hiển thị liên kết đến trang đăng nhập
              <Link to="/login" className="text-gray-600 hover:text-red-500">
                Đăng nhập
              </Link>
            )}

            {/* Liên kết đến trang giỏ hàng */}
            <Link to="/cart" className="text-gray-600 hover:text-red-500 relative">
              🛒
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0 {/* Hiện số lượng sản phẩm trong giỏ (tạm thời là 0) */}
              </span>
            </Link>
          </div>
        </div>

        {/* Thanh menu điều hướng chính */}
        <nav className="py-4 border-t border-gray-200">
          <ul className="flex items-center justify-center space-x-8">
            <li><Link to="/" className="text-gray-600 hover:text-red-500 font-medium">Trang chủ</Link></li>
            <li><Link to="/products" className="text-gray-600 hover:text-red-500 font-medium">Sản phẩm</Link></li>
            <li><Link to="/sale" className="text-red-500 font-medium">Khuyến mãi</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
