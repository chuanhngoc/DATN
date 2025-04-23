import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, Users, LogOut, Ruler, Palette } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  // Kiểm tra path hiện tại để active menu
  const isActive = (path) => {
    return location.pathname === path ? 'bg-gray-700' : '';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Trang quản trị</h1>
        </div>
        <nav className="mt-4">
          <Link
            to="/admin"
            className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 ${isActive('/admin')}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-2" />
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 ${isActive('/admin/products')}`}
          >
            <Package className="w-5 h-5 mr-2" />
            Sản phẩm
          </Link>
          <Link
            to="/admin/categories"
            className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 ${isActive('/admin/categories')}`}
          >
            <Tag className="w-5 h-5 mr-2" />
            Danh mục
          </Link>
          <Link
            to="/admin/colors"
            className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 ${isActive('/admin/colors')}`}
          >
            <Palette className="w-5 h-5 mr-2" />
            Màu sắc
          </Link>
          <Link
            to="/admin/sizes"
            className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 ${isActive('/admin/sizes')}`}
          >
            <Ruler className="w-5 h-5 mr-2" />
            Kích thước
          </Link>
          <Link
            to="/admin/users"
            className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 ${isActive('/admin/users')}`}
          >
            <Users className="w-5 h-5 mr-2" />
            Người dùng
          </Link>
          <Link
            to="/admin/orders"
            className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 ${isActive('/admin/orders')}`}
          >
            <Users className="w-5 h-5 mr-2" />
            Đơn hàng
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white shadow">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {location.pathname === '/admin' ? 'Dashboard' :
                location.pathname === '/admin/products' ? 'Quản lý sản phẩm' :
                  location.pathname === '/admin/categories' ? 'Quản lý danh mục' :
                    location.pathname === '/admin/users' ? 'Quản lý người dùng' : ''}
            </h2>
            <div className="flex items-center">
              <span className="text-gray-600 mr-4">Admin</span>
              <button className="text-gray-600 hover:text-gray-800">
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 