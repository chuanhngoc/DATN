import React from 'react';

function Products() {
  // Dữ liệu mẫu của một sản phẩm
  const product = {
    id: 1,
    name: "Áo thun nam cao cấp",
    description: "Chất liệu cotton mềm mại, co giãn 4 chiều",
    main_image: "uploads/main_1713352212_4d9e9271-22bc-4fda-9271-7e7fa4f1d7a0.jpg",
    category_id: 2,
    is_active: true,
    created_at: "2025-04-17T12:00:00.000000Z",
    updated_at: "2025-04-17T12:00:00.000000Z",
    deleted_at: null
  };

  return (
    // Container chính
    <div className="p-4">
      {/* Card sản phẩm */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden max-w-sm">
        {/* Phần ảnh sản phẩm */}
        <div className="relative group">
          <img 
            src={product.main_image} 
            alt={product.name}
            className="w-full h-64 object-cover object-center"
          />
          {/* Overlay khi hover */}
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              Xem chi tiết
            </button>
          </div>
        </div>

        {/* Phần thông tin sản phẩm */}
        <div className="p-4">
          {/* Tên sản phẩm */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h3>
          
          {/* Mô tả sản phẩm */}
          <p className="text-gray-600 text-sm mb-4">
            {product.description}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            {/* Trạng thái */}
            <span className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${product.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'}
            `}>
              {product.is_active ? 'Còn hàng' : 'Hết hàng'}
            </span>

            {/* Mã sản phẩm */}
            <span className="text-xs text-gray-500">
              Mã SP: #{product.id.toString().padStart(4, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
