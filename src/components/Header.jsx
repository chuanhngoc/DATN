import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import { productAll, searchProducts } from '../services/client/product';
import { useQuery } from '@tanstack/react-query';
import { categoriesAll } from '../services/client/categories';

const Header = () => {
  // State lưu thông tin người dùng (nếu đã đăng nhập)
  const [user, setUser] = useState(null); // Lưu thông tin user (nếu có token trong localStorage)
  const [searchTerm, setSearchTerm] = useState(''); // Từ khoá người dùng nhập vào ô tìm kiếm
  const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm sản phẩm
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading khi đang tìm kiếm
  const [showDropdown, setShowDropdown] = useState(false); // Hiển thị dropdown kết quả tìm kiếm

  const navigate = useNavigate(); // Hook dùng để chuyển trang
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Giảm số lần gọi API bằng cách debounce 500ms

  useEffect(() => {
    // Khi component được mount, lấy thông tin người dùng từ localStorage (nếu có)
    const storedUser = localStorage.getItem('token');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse JSON và lưu vào state user
    }
  }, []);

  const { data: categories, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAll()
  });

  useEffect(() => {
    // Gọi API tìm kiếm sản phẩm mỗi khi debouncedSearchTerm thay đổi
    const fetchSearchResults = async () => {
      if (debouncedSearchTerm) {
        setIsLoading(true); // Bắt đầu loading
        try {
          const data = await searchProducts(debouncedSearchTerm); // Gọi API tìm kiếm
          setSearchResults(data); // Lưu kết quả vào state
          setShowDropdown(true); // Hiển thị dropdown kết quả
        } catch (error) {
          console.error('Lỗi khi tìm kiếm sản phẩm:', error);
        } finally {
          setIsLoading(false); // Kết thúc loading
        }
      } else {
        // Nếu input rỗng, ẩn dropdown và xóa kết quả tìm kiếm
        setSearchResults([]);
        setShowDropdown(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchTerm]);

  // Xử lý đăng xuất: xoá token khỏi localStorage và chuyển về trang login
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Xử lý khi người dùng thay đổi input tìm kiếm
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Khi người dùng click vào 1 sản phẩm trong dropdown, chuyển đến trang chi tiết sản phẩm
  const handleProductClick = (productId) => {
    navigate(`/product/detail/${productId}`); // Chuyển trang
    setShowDropdown(false); // Ẩn dropdown
    setSearchTerm(''); // Reset input tìm kiếm
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
                value={searchTerm}
                onChange={handleSearchInputChange}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-red-500"
              />
              <button className="absolute right-3 top-2 text-gray-500">
                {isLoading ? '⌛' : '🔍'}
              </button>

              {/* Dropdown kết quả tìm kiếm */}
              {showDropdown && searchResults?.data.length > 0 && (
                <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults?.data.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductClick(product.id)}
                      className="p-3 hover:bg-gray-100 cursor-pointer flex items-center space-x-3 border-b border-gray-100"
                    >
                      <img
                        src={`http://127.0.0.1:8000/storage/${product.main_image}`}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{product.name}</div>
                        <div className="text-red-500 text-sm">{product.variation_min_price?.price.toLocaleString('vi-VN')}₫</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Thông tin người dùng và giỏ hàng */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Nếu đã đăng nhập, hiển thị tên người dùng và nút đăng xuất
              <div className="flex items-center space-x-3">
                <Link to={'/orders'}>
                  <span className="text-gray-600">👤 {user.name}</span>
                </Link>
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
            {/* Các link tĩnh */}
            <li>
              <Link to="/" className="text-gray-600 hover:text-red-500 font-medium">Trang chủ</Link>
            </li>
            <li>
              <Link to="/products" className="text-gray-600 hover:text-red-500 font-medium">Sản phẩm</Link>
            </li>

            {/* Danh mục có dropdown */}
            <li className="relative group">
              <span className="text-gray-600 hover:text-red-500 font-medium cursor-pointer flex items-center">
                Danh mục
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </span>
              <div className="absolute left-0 top-full mt-2 w-48 bg-white shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top scale-95 group-hover:scale-100 border border-gray-100">
                <ul className="py-1">
                  {categories?.map((category) => (
                    <li key={category.id} className="hover:bg-gray-50">
                      <Link
                        to={`/categories/${category.id}/products`}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:text-red-500 transition-colors duration-200"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
