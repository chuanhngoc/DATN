import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        {/* Top Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            SHOE<span className="text-red-500">STORE</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-red-500"
              />
              <button className="absolute right-3 top-2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-red-500 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-4 border-t border-gray-200">
          <ul className="flex items-center justify-center space-x-8">
            <li>
              <Link to="/" className="text-gray-600 hover:text-red-500 font-medium">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/products" className="text-gray-600 hover:text-red-500 font-medium">
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link to="/men" className="text-gray-600 hover:text-red-500 font-medium">
                Nam
              </Link>
            </li>
            <li>
              <Link to="/women" className="text-gray-600 hover:text-red-500 font-medium">
                Nữ
              </Link>
            </li>
            <li>
              <Link to="/sale" className="text-red-500 font-medium">
                Khuyến mãi
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-600 hover:text-red-500 font-medium">
                Liên hệ
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 