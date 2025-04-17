import { useQuery } from '@tanstack/react-query';
import productsService from '../../services/products';
import { toast } from 'react-toastify';

const Products = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productsService.getAllProducts();
      return response.data;
    }
  });

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-xl">Danh sách sản phẩm</h1>
        <button className="bg-blue-500 text-white px-4 py-2 mt-2">
          Thêm sản phẩm
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border p-2 mr-2"
        />
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Ảnh</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Mô tả</th>
            <th className="border p-2">Danh mục</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product.id} className="border">
              <td className="border p-2">
                <img 
                  src={`${import.meta.env.VITE_API_URL}/${product.main_image}`} 
                  alt={product.name}
                  className="w-16 h-16 object-cover" 
                />
              </td>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.description}</td>
              <td className="border p-2">{product.category_id}</td>
              <td className="border p-2">
                {product.is_active ? 'Đang bán' : 'Ngừng bán'}
              </td>
              <td className="border p-2">
                <button className="bg-blue-500 text-white px-2 py-1 mr-2">Sửa</button>
                <button className="bg-red-500 text-white px-2 py-1">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <button className="border px-2 py-1 mr-2">Trước</button>
        <button className="border px-2 py-1">Sau</button>
      </div>
    </div>
  );
};

export default Products; 