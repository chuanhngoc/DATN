import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/client/product';
import { Link } from 'react-router-dom';

function Products() {
  // Sử dụng useQuery để fetch data
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts()
  });

  // Loading state với skeleton
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md animate-pulse">
              <div className="h-64 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold mb-2">Đã có lỗi xảy ra</h3>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }


  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Danh sách sản phẩm</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.map((product) => (
          <Link to={'/product/detail/' + product.id}>
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
              {/* Ảnh sản phẩm */}
              <div className="relative group">
                <img
                  src={`http://127.0.0.1:8000/storage/${product.main_image}`}
                  alt={product.name}
                  className="w-full h-64 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                  <button className="bg-white text-gray-800 px-6 py-2 rounded-full font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-100">
                    Xem chi tiết
                  </button>
                </div>
              </div>

              {/* Thông tin sản phẩm */}
              <div className="p-4">
                {/* Category */}
                <div className="mb-2">
                  <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">
                    {product.category.name}
                  </span>
                </div>

                {/* Tên sản phẩm */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                  {product.name}
                </h3>

                {/* Mô tả */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Footer */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    {/* Trạng thái */}
                    <span className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${product.is_active
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'}
                  `}>
                      {product.is_active ? 'Còn hàng' : 'Hết hàng'}
                    </span>

                    {/* Mã sản phẩm */}
                    <span className="text-xs text-gray-500 font-medium">
                      #{product.id.toString().padStart(4, '0')}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {data?.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có sản phẩm nào</h3>
          <p className="text-gray-500">Hãy thêm sản phẩm mới vào danh sách của bạn</p>
        </div>
      )}
    </div>
  );
}

export default Products;
